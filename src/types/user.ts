
/**
 * User-related type definitions
 */

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
  GUEST = 'guest'
}

export interface User {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string | null;
  role: UserRole;
  last_sign_in?: string | null;
  created_at?: string | null;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  social_links?: Record<string, string> | null;
}

export interface UserSettings {
  user_id: string;
  theme_preference?: 'light' | 'dark' | 'system';
  notification_preferences?: Record<string, boolean> | null;
  ui_preferences?: Record<string, any> | null;
}
