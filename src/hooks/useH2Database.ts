/**
 * React hooks for H2 Database operations
 * Provides easy-to-use hooks for database interactions
 */

import { useState, useEffect, useCallback } from 'react';
import h2Database, { type H2QueryResult } from '../lib/h2Database';
import h2Auth, { type AuthResponse } from '../lib/h2Auth';

/**
 * Hook for database queries
 */
export function useH2Query<T = any>(
  table: string,
  conditions?: any,
  orderBy?: string,
  enabled: boolean = true
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  const refetch = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result: H2QueryResult<T> = await h2Database.select<T>(table, conditions, orderBy);
      
      if (result.error) {
        setError(result.error);
        setData([]);
        setCount(0);
      } else {
        setData(result.data);
        setCount(result.count);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query failed');
      setData([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [table, conditions, orderBy, enabled]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    data,
    loading,
    error,
    count,
    refetch
  };
}

/**
 * Hook for database mutations (insert, update, delete)
 */
export function useH2Mutation<T = any>(table: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const insert = useCallback(async (data: any): Promise<H2QueryResult<T>> => {
    setLoading(true);
    setError(null);

    try {
      const result = await h2Database.insert<T>(table, data);
      
      if (result.error) {
        setError(result.error);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Insert failed';
      setError(errorMessage);
      return {
        data: [],
        error: errorMessage,
        count: 0
      };
    } finally {
      setLoading(false);
    }
  }, [table]);

  const update = useCallback(async (id: any, data: any): Promise<H2QueryResult<T>> => {
    setLoading(true);
    setError(null);

    try {
      const result = await h2Database.update<T>(table, id, data);
      
      if (result.error) {
        setError(result.error);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Update failed';
      setError(errorMessage);
      return {
        data: [],
        error: errorMessage,
        count: 0
      };
    } finally {
      setLoading(false);
    }
  }, [table]);

  const remove = useCallback(async (id: any): Promise<H2QueryResult> => {
    setLoading(true);
    setError(null);

    try {
      const result = await h2Database.delete(table, id);
      
      if (result.error) {
        setError(result.error);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed';
      setError(errorMessage);
      return {
        data: [],
        error: errorMessage,
        count: 0
      };
    } finally {
      setLoading(false);
    }
  }, [table]);

  return {
    insert,
    update,
    remove,
    loading,
    error
  };
}

/**
 * Hook for authentication
 */
export function useH2Auth() {
  const [user, setUser] = useState(h2Auth.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      const result = await h2Auth.signUp({ email, password });
      
      if (result.error) {
        setError(result.error);
      } else {
        setUser(result.user);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed';
      setError(errorMessage);
      return { user: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      const result = await h2Auth.signIn({ email, password });
      
      if (result.error) {
        setError(result.error);
      } else {
        setUser(result.user);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError(errorMessage);
      return { user: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await h2Auth.signOut();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (updates: any): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      const result = await h2Auth.updateUser(updates);
      
      if (result.error) {
        setError(result.error);
      } else {
        setUser(result.user);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Update failed';
      setError(errorMessage);
      return { user: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (): Promise<{ error: string | null }> => {
    setLoading(true);
    setError(null);

    try {
      const result = await h2Auth.deleteUser();
      
      if (result.error) {
        setError(result.error);
      } else {
        setUser(null);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Validate session on mount
  useEffect(() => {
    const validateSession = async () => {
      const isValid = await h2Auth.validateSession();
      if (!isValid) {
        setUser(null);
      }
    };

    validateSession();
  }, []);

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateUser,
    deleteUser,
    isAuthenticated: !!user
  };
}

/**
 * Hook for todos management
 */
export function useTodos() {
  const { user } = useH2Auth();
  const { data: todos, loading, error, refetch } = useH2Query(
    'todos',
    user ? { user_id: user.id } : null,
    'created_at DESC',
    !!user
  );

  const { insert, update, remove } = useH2Mutation('todos');

  const addTodo = useCallback(async (content: string) => {
    if (!user) return;

    const result = await insert({
      content,
      completed: false,
      user_id: user.id
    });

    if (!result.error) {
      refetch();
    }

    return result;
  }, [user, insert, refetch]);

  const toggleTodo = useCallback(async (id: number, completed: boolean) => {
    const result = await update(id, { completed });

    if (!result.error) {
      refetch();
    }

    return result;
  }, [update, refetch]);

  const deleteTodo = useCallback(async (id: number) => {
    const result = await remove(id);

    if (!result.error) {
      refetch();
    }

    return result;
  }, [remove, refetch]);

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    refetch
  };
}

/**
 * Hook for settings management
 */
export function useSettings() {
  const { user } = useH2Auth();
  const { data: settings, loading, error, refetch } = useH2Query(
    'settings',
    user ? { user_id: user.id } : null,
    'key ASC',
    !!user
  );

  const { insert, update, remove } = useH2Mutation('settings');

  const getSetting = useCallback((key: string) => {
    return settings.find(setting => setting.key === key)?.value;
  }, [settings]);

  const setSetting = useCallback(async (key: string, value: string) => {
    if (!user) return;

    const existing = settings.find(setting => setting.key === key);
    
    if (existing) {
      const result = await update(existing.id, { value });
      if (!result.error) {
        refetch();
      }
      return result;
    } else {
      const result = await insert({
        key,
        value,
        user_id: user.id
      });
      if (!result.error) {
        refetch();
      }
      return result;
    }
  }, [user, settings, insert, update, refetch]);

  const deleteSetting = useCallback(async (key: string) => {
    const setting = settings.find(s => s.key === key);
    if (!setting) return;

    const result = await remove(setting.id);
    if (!result.error) {
      refetch();
    }
    return result;
  }, [settings, remove, refetch]);

  return {
    settings,
    loading,
    error,
    getSetting,
    setSetting,
    deleteSetting,
    refetch
  };
}
