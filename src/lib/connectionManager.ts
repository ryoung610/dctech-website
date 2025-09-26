/**
 * Connection Manager for optimizing database connections
 * Reduces connection pool usage and manages connection lifecycle
 */

interface ConnectionConfig {
  maxConnections: number;
  idleTimeout: number;
  connectionTimeout: number;
}

class ConnectionManager {
  private static instance: ConnectionManager;
  private activeConnections: number = 0;
  private config: ConnectionConfig = {
    maxConnections: 5, // Reduced from default
    idleTimeout: 30000, // 30 seconds
    connectionTimeout: 5000, // 5 seconds
  };

  private constructor() {}

  public static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  /**
   * Check if a new connection can be established
   */
  public canCreateConnection(): boolean {
    return this.activeConnections < this.config.maxConnections;
  }

  /**
   * Register a new connection
   */
  public registerConnection(): boolean {
    if (this.canCreateConnection()) {
      this.activeConnections++;
      return true;
    }
    return false;
  }

  /**
   * Release a connection
   */
  public releaseConnection(): void {
    if (this.activeConnections > 0) {
      this.activeConnections--;
    }
  }

  /**
   * Get current connection count
   */
  public getConnectionCount(): number {
    return this.activeConnections;
  }

  /**
   * Get connection pool status
   */
  public getPoolStatus() {
    return {
      active: this.activeConnections,
      max: this.config.maxConnections,
      available: this.config.maxConnections - this.activeConnections,
      utilization: (this.activeConnections / this.config.maxConnections) * 100,
    };
  }

  /**
   * Update connection configuration
   */
  public updateConfig(newConfig: Partial<ConnectionConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Reset connection pool
   */
  public reset(): void {
    this.activeConnections = 0;
  }
}

export const connectionManager = ConnectionManager.getInstance();

/**
 * Decorator to manage database connections
 */
export function withConnectionManagement<T extends (...args: any[]) => Promise<any>>(
  fn: T
): T {
  return (async (...args: any[]) => {
    if (!connectionManager.registerConnection()) {
      throw new Error('Connection pool exhausted. Please try again later.');
    }

    try {
      const result = await fn(...args);
      return result;
    } finally {
      connectionManager.releaseConnection();
    }
  }) as T;
}

/**
 * Utility to batch database operations
 */
export class BatchOperationManager {
  private operations: Array<() => Promise<any>> = [];
  private batchSize: number = 10; // Process 10 operations at a time

  public addOperation(operation: () => Promise<any>): void {
    this.operations.push(operation);
  }

  public async executeBatch(): Promise<any[]> {
    const results: any[] = [];
    
    for (let i = 0; i < this.operations.length; i += this.batchSize) {
      const batch = this.operations.slice(i, i + this.batchSize);
      const batchResults = await Promise.all(
        batch.map(op => withConnectionManagement(op)())
      );
      results.push(...batchResults);
    }

    this.operations = [];
    return results;
  }

  public clear(): void {
    this.operations = [];
  }
}

export const batchManager = new BatchOperationManager();
