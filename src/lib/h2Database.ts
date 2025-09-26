/**
 * H2 Database Service
 * Provides a complete H2-like database interface for the browser
 */

interface H2Config {
  name: string;
  version: number;
  tables: H2Table[];
}

interface H2Table {
  name: string;
  columns: H2Column[];
  indexes?: H2Index[];
}

interface H2Column {
  name: string;
  type: 'TEXT' | 'INTEGER' | 'REAL' | 'BLOB' | 'BOOLEAN' | 'DATETIME';
  primaryKey?: boolean;
  autoIncrement?: boolean;
  notNull?: boolean;
  defaultValue?: any;
}

interface H2Index {
  name: string;
  columns: string[];
  unique?: boolean;
}

interface H2QueryResult<T = any> {
  data: T[];
  error: string | null;
  count: number;
}

interface H2AuthUser {
  id: string;
  email: string;
  password?: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
}

class H2Database {
  private db: IDBDatabase | null = null;
  private config: H2Config;
  private currentUser: H2AuthUser | null = null;

  constructor(config: H2Config) {
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
        
        // Create tables
        this.config.tables.forEach(table => {
          if (!db.objectStoreNames.contains(table.name)) {
            const primaryKey = table.columns.find(col => col.primaryKey)?.name || 'id';
            const store = db.createObjectStore(table.name, { 
              keyPath: primaryKey,
              autoIncrement: !table.columns.find(col => col.primaryKey && col.type === 'TEXT')
            });

            // Create indexes
            table.columns.forEach(column => {
              if (column.name !== primaryKey) {
                store.createIndex(column.name, column.name, { unique: false });
              }
            });

            // Create custom indexes
            table.indexes?.forEach(index => {
              store.createIndex(index.name, index.columns, { unique: index.unique || false });
            });
          }
        });
      };
    });
  }

  // Generic CRUD operations
  async select<T = any>(table: string, conditions?: any, orderBy?: string): Promise<H2QueryResult<T>> {
    if (!this.db) throw new Error('Database not connected');

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([table], 'readonly');
      const store = transaction.objectStore(table);
      const request = store.getAll();

      request.onsuccess = () => {
        let data = request.result;
        
        // Apply conditions
        if (conditions) {
          data = data.filter((item: any) => {
            return Object.keys(conditions).every(key => {
              const value = conditions[key];
              if (typeof value === 'object' && value !== null) {
                // Handle operators like { gt: 10 }, { like: '%test%' }
                if (value.gt !== undefined) return item[key] > value.gt;
                if (value.lt !== undefined) return item[key] < value.lt;
                if (value.gte !== undefined) return item[key] >= value.gte;
                if (value.lte !== undefined) return item[key] <= value.lte;
                if (value.like !== undefined) return new RegExp(value.like.replace(/%/g, '.*')).test(item[key]);
                if (value.in !== undefined) return value.in.includes(item[key]);
                if (value.eq !== undefined) return item[key] === value.eq;
              }
              return item[key] === value;
            });
          });
        }

        // Apply ordering
        if (orderBy) {
          const [column, direction = 'ASC'] = orderBy.split(' ');
          data.sort((a: any, b: any) => {
            const aVal = a[column];
            const bVal = b[column];
            const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return direction.toUpperCase() === 'DESC' ? -result : result;
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
          error: request.error?.message || 'Select failed',
          count: 0
        });
      };
    });
  }

  async insert<T = any>(table: string, data: any): Promise<H2QueryResult<T>> {
    if (!this.db) throw new Error('Database not connected');

    return new Promise((resolve) => {
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

  async update<T = any>(table: string, id: any, data: any): Promise<H2QueryResult<T>> {
    if (!this.db) throw new Error('Database not connected');

    return new Promise((resolve) => {
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

  async delete(table: string, id: any): Promise<H2QueryResult> {
    if (!this.db) throw new Error('Database not connected');

    return new Promise((resolve) => {
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

  // Authentication methods
  async signUp(email: string, password: string): Promise<H2QueryResult<H2AuthUser>> {
    // Check if user already exists
    const existing = await this.select<H2AuthUser>('users', { email });
    if (existing.data.length > 0) {
      return {
        data: [],
        error: 'User already exists',
        count: 0
      };
    }

    const userData = {
      email,
      password: await this.hashPassword(password),
      id: this.generateId()
    };

    return this.insert<H2AuthUser>('users', userData);
  }

  async signIn(email: string, password: string): Promise<H2QueryResult<H2AuthUser>> {
    const result = await this.select<H2AuthUser>('users', { email });
    
    if (result.data.length === 0) {
      return {
        data: [],
        error: 'User not found',
        count: 0
      };
    }

    const user = result.data[0];
    const isValid = await this.verifyPassword(password, user.password || '');

    if (!isValid) {
      return {
        data: [],
        error: 'Invalid password',
        count: 0
      };
    }

    // Update last sign in
    await this.update('users', user.id, { last_sign_in_at: new Date().toISOString() });
    
    this.currentUser = user;
    
    return {
      data: [user],
      error: null,
      count: 1
    };
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
  }

  getCurrentUser(): H2AuthUser | null {
    return this.currentUser;
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private async hashPassword(password: string): Promise<string> {
    // Simple hash for demo - in production use proper hashing
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    const passwordHash = await this.hashPassword(password);
    return passwordHash === hash;
  }

  /**
   * Export database to JSON
   */
  async exportDatabase(): Promise<string> {
    const exportData: any = {};
    const tables = ['users', 'todos', 'sessions', 'settings'];

    for (const table of tables) {
      const result = await this.select(table);
      exportData[table] = result.data;
    }

    return JSON.stringify({
      version: this.config.version,
      timestamp: new Date().toISOString(),
      data: exportData
    }, null, 2);
  }

  /**
   * Import database from JSON
   */
  async importDatabase(jsonData: string): Promise<void> {
    const importData = JSON.parse(jsonData);
    
    if (!importData.data) {
      throw new Error('Invalid import data format');
    }

    // Import each table
    for (const [tableName, records] of Object.entries(importData.data)) {
      if (Array.isArray(records)) {
        for (const record of records) {
          await this.insert(tableName, record);
        }
      }
    }
  }

  /**
   * Get database statistics
   */
  async getStats(): Promise<any> {
    const tables = ['users', 'todos', 'sessions', 'settings'];
    const stats: any = {
      tables: {},
      totalRecords: 0,
      totalSize: 0
    };

    for (const table of tables) {
      const result = await this.select(table);
      stats.tables[table] = result.count;
      stats.totalRecords += result.count;
    }

    // Calculate approximate size
    try {
      const estimate = await navigator.storage?.estimate();
      stats.totalSize = estimate?.usage || 0;
      stats.availableSpace = estimate?.quota || 0;
    } catch (error) {
      stats.totalSize = 'Unknown';
      stats.availableSpace = 'Unknown';
    }

    return stats;
  }

  /**
   * Clear all data from database
   */
  async clearDatabase(): Promise<void> {
    const tables = ['users', 'todos', 'sessions', 'settings'];
    
    for (const table of tables) {
      const result = await this.select(table);
      for (const record of result.data) {
        await this.delete(table, record.id);
      }
    }
  }

  /**
   * Backup database to localStorage
   */
  async backupToLocalStorage(): Promise<void> {
    const backupData = await this.exportDatabase();
    localStorage.setItem('h2_database_backup', backupData);
  }

  /**
   * Restore database from localStorage
   */
  async restoreFromLocalStorage(): Promise<void> {
    const backupData = localStorage.getItem('h2_database_backup');
    
    if (!backupData) {
      throw new Error('No backup found in localStorage');
    }

    await this.importDatabase(backupData);
  }

  /**
   * Download database as file
   */
  async downloadDatabase(): Promise<void> {
    const data = await this.exportDatabase();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `h2_database_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Upload database from file
   */
  async uploadDatabase(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          await this.importDatabase(content);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// H2 Database configuration
const h2Config: H2Config = {
  name: 'dctech_h2_database',
  version: 1,
  tables: [
    {
      name: 'users',
      columns: [
        { name: 'id', type: 'TEXT', primaryKey: true },
        { name: 'email', type: 'TEXT', notNull: true },
        { name: 'password', type: 'TEXT' },
        { name: 'created_at', type: 'DATETIME' },
        { name: 'updated_at', type: 'DATETIME' },
        { name: 'last_sign_in_at', type: 'DATETIME' }
      ],
      indexes: [
        { name: 'email_index', columns: ['email'], unique: true }
      ]
    },
    {
      name: 'todos',
      columns: [
        { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
        { name: 'content', type: 'TEXT', notNull: true },
        { name: 'completed', type: 'BOOLEAN', defaultValue: false },
        { name: 'user_id', type: 'TEXT' },
        { name: 'created_at', type: 'DATETIME' },
        { name: 'updated_at', type: 'DATETIME' }
      ],
      indexes: [
        { name: 'user_id_index', columns: ['user_id'] },
        { name: 'completed_index', columns: ['completed'] }
      ]
    },
    {
      name: 'sessions',
      columns: [
        { name: 'id', type: 'TEXT', primaryKey: true },
        { name: 'user_id', type: 'TEXT' },
        { name: 'expires_at', type: 'DATETIME' },
        { name: 'created_at', type: 'DATETIME' }
      ]
    },
    {
      name: 'settings',
      columns: [
        { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
        { name: 'key', type: 'TEXT', notNull: true },
        { name: 'value', type: 'TEXT' },
        { name: 'user_id', type: 'TEXT' },
        { name: 'created_at', type: 'DATETIME' },
        { name: 'updated_at', type: 'DATETIME' }
      ],
      indexes: [
        { name: 'key_index', columns: ['key'] },
        { name: 'user_id_index', columns: ['user_id'] }
      ]
    }
  ]
};

// Create and export the H2 database instance
const h2Database = new H2Database(h2Config);

// Initialize connection
h2Database.connect().catch(console.error);

export default h2Database;
export { H2Database, type H2Config, type H2QueryResult, type H2AuthUser };
