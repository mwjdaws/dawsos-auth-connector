
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
  avatar_url?: string;
  role: UserRole;
  last_sign_in?: string;
  created_at?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  social_links?: Record<string, string>;
}

export interface UserSettings {
  user_id: string;
  theme_preference?: 'light' | 'dark' | 'system';
  notification_preferences?: Record<string, boolean>;
  ui_preferences?: Record<string, any>;
}
