
/**
 * Authentication Types
 * 
 * Types related to user authentication and authorization
 */

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  role?: UserRole;
}

export enum UserRole {
  Admin = 'admin',
  Editor = 'editor',
  Viewer = 'viewer',
  Guest = 'guest'
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  preferences: Record<string, any> | null;
}

export interface AuthSession {
  user: User | null;
  session: any;
  isLoading: boolean;
  error: Error | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}
