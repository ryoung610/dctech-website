/**
 * H2-like Database Client using IndexedDB
 * Provides H2-compatible interface for browser-based applications
 */

interface DatabaseConfig {
  name: string;
  version: number;
  stores: string[];
}

interface QueryResult {
  data: any[];
  error: string | null;
  count: number;
}

class H2LikeDatabase {
  private db: IDBDatabase | null = null;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.name, this.config.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores (tables)
        this.config.stores.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
            store.createIndex('created_at', 'created_at', { unique: false });
            store.createIndex('updated_at', 'updated_at', { unique: false });
          }
        });
      };
    });
  }

  async query(table: string, conditions?: any): Promise<QueryResult> {
    if (!this.db) throw new Error('Database not connected');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([table], 'readonly');
      const store = transaction.objectStore(table);
      const request = store.getAll();

      request.onsuccess = () => {
        let data = request.result;
        
        // Apply conditions if provided
        if (conditions) {
          data = data.filter((item: any) => {
            return Object.keys(conditions).every(key => 
              item[key] === conditions[key]
            );
          });
        }

        resolve({
          data,
          error: null,
          count: data.length
        });
      };

      request.onerror = () => {
        resolve({
          data: [],
          error: request.error?.message || 'Query failed',
          count: 0
        });
      };
    });
  }

  async insert(table: string, data: any): Promise<QueryResult> {
    if (!this.db) throw new Error('Database not connected');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([table], 'readwrite');
      const store = transaction.objectStore(table);
      
      const record = {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const request = store.add(record);

      request.onsuccess = () => {
        resolve({
          data: [{ id: request.result, ...record }],
          error: null,
          count: 1
        });
      };

      request.onerror = () => {
        resolve({
          data: [],
          error: request.error?.message || 'Insert failed',
          count: 0
        });
      };
    });
  }

  async update(table: string, id: number, data: any): Promise<QueryResult> {
    if (!this.db) throw new Error('Database not connected');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([table], 'readwrite');
      const store = transaction.objectStore(table);
      
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const existing = getRequest.result;
        if (!existing) {
          resolve({
            data: [],
            error: 'Record not found',
            count: 0
          });
          return;
        }

        const updated = {
          ...existing,
          ...data,
          updated_at: new Date().toISOString()
        };

        const putRequest = store.put(updated);
        
        putRequest.onsuccess = () => {
          resolve({
            data: [updated],
            error: null,
            count: 1
          });
        };

        putRequest.onerror = () => {
          resolve({
            data: [],
            error: putRequest.error?.message || 'Update failed',
            count: 0
          });
        };
      };

      getRequest.onerror = () => {
        resolve({
          data: [],
          error: getRequest.error?.message || 'Get failed',
          count: 0
        });
      };
    });
  }

  async delete(table: string, id: number): Promise<QueryResult> {
    if (!this.db) throw new Error('Database not connected');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([table], 'readwrite');
      const store = transaction.objectStore(table);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve({
          data: [],
          error: null,
          count: 1
        });
      };

      request.onerror = () => {
        resolve({
          data: [],
          error: request.error?.message || 'Delete failed',
          count: 0
        });
      };
    });
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Create and export the database instance
const h2Database = new H2LikeDatabase({
  name: 'dctech_h2_db',
  version: 1,
  stores: ['users', 'todos', 'sessions', 'settings']
});

// Initialize connection
h2Database.connect().catch(console.error);

export { h2Database as supabase };
export default h2Database;
