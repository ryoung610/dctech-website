/**
 * H2 Authentication Service
 * Provides authentication functionality compatible with H2 database
 */

import h2Database, { type H2AuthUser } from './h2Database';

interface AuthResponse {
  user: H2AuthUser | null;
  error: string | null;
}

interface SignUpData {
  email: string;
  password: string;
}

interface SignInData {
  email: string;
  password: string;
}

class H2AuthService {
  private currentUser: H2AuthUser | null = null;
  private sessionKey = 'h2_auth_session';

  constructor() {
    this.loadSession();
  }

  /**
   * Sign up a new user
   */
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const result = await h2Database.signUp(data.email, data.password);
      
      if (result.error) {
        return { user: null, error: result.error };
      }

      const user = result.data[0];
      this.currentUser = user;
      this.saveSession(user);
      
      return { user, error: null };
    } catch (error) {
      return { 
        user: null, 
        error: error instanceof Error ? error.message : 'Sign up failed' 
      };
    }
  }

  /**
   * Sign in an existing user
   */
  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const result = await h2Database.signIn(data.email, data.password);
      
      if (result.error) {
        return { user: null, error: result.error };
      }

      const user = result.data[0];
      this.currentUser = user;
      this.saveSession(user);
      
      return { user, error: null };
    } catch (error) {
      return { 
        user: null, 
        error: error instanceof Error ? error.message : 'Sign in failed' 
      };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    await h2Database.signOut();
    this.currentUser = null;
    this.clearSession();
  }

  /**
   * Get the current user
   */
  getCurrentUser(): H2AuthUser | null {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Get user session
   */
  getSession(): H2AuthUser | null {
    return this.currentUser;
  }

  /**
   * Update user profile
   */
  async updateUser(updates: Partial<H2AuthUser>): Promise<AuthResponse> {
    if (!this.currentUser) {
      return { user: null, error: 'No user logged in' };
    }

    try {
      const result = await h2Database.update('users', this.currentUser.id, updates);
      
      if (result.error) {
        return { user: null, error: result.error };
      }

      const updatedUser = result.data[0];
      this.currentUser = updatedUser;
      this.saveSession(updatedUser);
      
      return { user: updatedUser, error: null };
    } catch (error) {
      return { 
        user: null, 
        error: error instanceof Error ? error.message : 'Update failed' 
      };
    }
  }

  /**
   * Delete user account
   */
  async deleteUser(): Promise<{ error: string | null }> {
    if (!this.currentUser) {
      return { error: 'No user logged in' };
    }

    try {
      // Delete user's todos
      const todos = await h2Database.select('todos', { user_id: this.currentUser.id });
      for (const todo of todos.data) {
        await h2Database.delete('todos', todo.id);
      }

      // Delete user's settings
      const settings = await h2Database.select('settings', { user_id: this.currentUser.id });
      for (const setting of settings.data) {
        await h2Database.delete('settings', setting.id);
      }

      // Delete user
      const result = await h2Database.delete('users', this.currentUser.id);
      
      if (result.error) {
        return { error: result.error };
      }

      this.currentUser = null;
      this.clearSession();
      
      return { error: null };
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Delete failed' 
      };
    }
  }

  /**
   * Reset password (simplified for H2)
   */
  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const result = await h2Database.select<H2AuthUser>('users', { email });
      
      if (result.data.length === 0) {
        return { error: 'User not found' };
      }

      // In a real app, you'd send an email with a reset link
      // For H2, we'll just return success
      return { error: null };
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Reset failed' 
      };
    }
  }

  /**
   * Save session to localStorage
   */
  private saveSession(user: H2AuthUser): void {
    try {
      localStorage.setItem(this.sessionKey, JSON.stringify(user));
    } catch (error) {
      console.warn('Failed to save session:', error);
    }
  }

  /**
   * Load session from localStorage
   */
  private loadSession(): void {
    try {
      const sessionData = localStorage.getItem(this.sessionKey);
      if (sessionData) {
        this.currentUser = JSON.parse(sessionData);
      }
    } catch (error) {
      console.warn('Failed to load session:', error);
      this.clearSession();
    }
  }

  /**
   * Clear session from localStorage
   */
  private clearSession(): void {
    try {
      localStorage.removeItem(this.sessionKey);
    } catch (error) {
      console.warn('Failed to clear session:', error);
    }
  }

  /**
   * Check session validity
   */
  async validateSession(): Promise<boolean> {
    if (!this.currentUser) {
      return false;
    }

    try {
      // Check if user still exists in database
      const result = await h2Database.select<H2AuthUser>('users', { id: this.currentUser.id });
      return result.data.length > 0;
    } catch (error) {
      console.warn('Session validation failed:', error);
      return false;
    }
  }
}

// Create and export the auth service instance
const h2Auth = new H2AuthService();

export default h2Auth;
export { H2AuthService, type AuthResponse, type SignUpData, type SignInData };
