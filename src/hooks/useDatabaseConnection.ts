import { useEffect, useRef, useCallback, useState } from 'react';
import { connectionManager } from '../lib/connectionManager';

/**
 * Custom hook for managing database connections efficiently
 * Automatically manages connection lifecycle and provides connection status
 */
export function useDatabaseConnection() {
  const connectionId = useRef<string | null>(null);
  const isConnected = useRef(false);

  // Generate unique connection ID
  const generateConnectionId = useCallback(() => {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Establish connection
  const connect = useCallback(() => {
    if (!isConnected.current && connectionManager.canCreateConnection()) {
      connectionId.current = generateConnectionId();
      connectionManager.registerConnection();
      isConnected.current = true;
      return true;
    }
    return false;
  }, [generateConnectionId]);

  // Release connection
  const disconnect = useCallback(() => {
    if (isConnected.current) {
      connectionManager.releaseConnection();
      isConnected.current = false;
      connectionId.current = null;
    }
  }, []);

  // Get connection status
  const getStatus = useCallback(() => {
    return {
      isConnected: isConnected.current,
      connectionId: connectionId.current,
      poolStatus: connectionManager.getPoolStatus(),
    };
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    
    // Auto-disconnect on unmount
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    getStatus,
    isConnected: isConnected.current,
    connectionId: connectionId.current,
  };
}

/**
 * Hook for batched database operations
 */
export function useBatchedOperations() {
  const executeBatch = useCallback(async (operations: Array<() => Promise<any>>) => {
    const results: any[] = [];
    const batchSize = 5; // Process 5 operations at a time to reduce connection usage

    for (let i = 0; i < operations.length; i += batchSize) {
      const batch = operations.slice(i, i + batchSize);
      
      // Wait for available connections
      while (!connectionManager.canCreateConnection()) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const batchResults = await Promise.all(
        batch.map(async (operation) => {
          if (connectionManager.registerConnection()) {
            try {
              const result = await operation();
              return result;
            } finally {
              connectionManager.releaseConnection();
            }
          }
          throw new Error('Unable to establish connection for operation');
        })
      );

      results.push(...batchResults);
    }

    return results;
  }, []);

  return { executeBatch };
}

/**
 * Hook for connection monitoring
 */
export function useConnectionMonitor(interval: number = 5000) {
  const [poolStatus, setPoolStatus] = useState(connectionManager.getPoolStatus());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPoolStatus(connectionManager.getPoolStatus());
    }, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return poolStatus;
}
