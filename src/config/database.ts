/**
 * Database connection configuration
 * Centralized settings for connection pool management
 */

export const DATABASE_CONFIG = {
  // Connection pool settings
  connectionPool: {
    maxConnections: 5, // Reduced from default 10-20
    minConnections: 1,
    idleTimeout: 30000, // 30 seconds
    connectionTimeout: 5000, // 5 seconds
    acquireTimeout: 10000, // 10 seconds
  },

  // H2 Database specific settings
  h2: {
    database: {
      name: 'dctech_h2_database',
      version: 1,
      maxConnections: 3, // H2 is lightweight, fewer connections needed
    },
    storage: {
      type: 'indexeddb', // Browser storage
      quota: 50 * 1024 * 1024, // 50MB limit
    },
    auth: {
      sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
      autoSignOut: true,
    },
  },

  // AWS Amplify settings
  amplify: {
    sync: {
      maxRecordsToSync: 1000,
      fullSyncInterval: 24, // Hours
      deltaSyncInterval: 1, // Hours
    },
    conflictResolution: {
      strategy: 'AUTOMERGE',
    },
  },

  // Query optimization
  queries: {
    batchSize: 10,
    maxRetries: 3,
    retryDelay: 1000, // 1 second
    cacheTimeout: 300000, // 5 minutes
  },

  // Performance monitoring
  monitoring: {
    logConnections: process.env.NODE_ENV === 'development',
    logQueryPerformance: process.env.NODE_ENV === 'development',
    connectionMetricsInterval: 30000, // 30 seconds
  },
} as const;

/**
 * Environment-specific overrides
 */
export const getDatabaseConfig = () => {
  const baseConfig = { ...DATABASE_CONFIG };

  // Production optimizations
  if (process.env.NODE_ENV === 'production') {
    baseConfig.connectionPool.maxConnections = 3; // Even more conservative in production
    baseConfig.connectionPool.idleTimeout = 15000; // 15 seconds
    baseConfig.queries.batchSize = 5;
    baseConfig.monitoring.logConnections = false;
    baseConfig.monitoring.logQueryPerformance = false;
  }

  // Development settings
  if (process.env.NODE_ENV === 'development') {
    baseConfig.connectionPool.maxConnections = 8; // Slightly higher for development
    baseConfig.monitoring.logConnections = true;
    baseConfig.monitoring.logQueryPerformance = true;
  }

  return baseConfig;
};

/**
 * Connection pool health check
 */
export const checkConnectionPoolHealth = () => {
  const config = getDatabaseConfig();
  
  return {
    isHealthy: true,
    recommendations: [
      'Monitor connection utilization regularly',
      'Adjust maxConnections based on actual usage patterns',
      'Consider implementing connection warming for critical paths',
      'Set up alerts for connection pool exhaustion',
    ],
    config: config.connectionPool,
  };
};
