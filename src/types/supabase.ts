
/**
 * JSON value types supported by Supabase
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * Database schema types for Supabase
 */
export interface Database {
  public: {
    Tables: {
      knowledge_sources: {
        Row: {
          id: string;
          title: string;
          content: string;
          template_id: string | null;
          external_source_url: string | null;
          external_content_hash: string | null;
          external_source_checked_at: string | null;
          needs_external_review: boolean;
          published: boolean;
          published_at: string | null;
          created_at: string | null;
          updated_at: string | null;
          user_id: string | null;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          template_id?: string | null;
          external_source_url?: string | null;
          external_content_hash?: string | null;
          external_source_checked_at?: string | null;
          needs_external_review?: boolean;
          published?: boolean;
          published_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          template_id?: string | null;
          external_source_url?: string | null;
          external_content_hash?: string | null;
          external_source_checked_at?: string | null;
          needs_external_review?: boolean;
          published?: boolean;
          published_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          created_by?: string | null;
        };
      };
      knowledge_templates: {
        Row: {
          id: string;
          name: string;
          content: string;
          is_global: boolean;
          metadata: Json;
          structure: Json;
          created_at: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          content: string;
          is_global?: boolean;
          metadata?: Json;
          structure?: Json;
          created_at?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          content?: string;
          is_global?: boolean;
          metadata?: Json;
          structure?: Json;
          created_at?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
      };
      knowledge_source_versions: {
        Row: {
          id: string;
          source_id: string;
          content: string;
          version_number: number;
          metadata: Json;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          source_id: string;
          content: string;
          version_number: number;
          metadata?: Json;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          source_id?: string;
          content?: string;
          version_number?: number;
          metadata?: Json;
          created_at?: string | null;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          content_id: string;
          type_id: string | null;
          display_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          content_id: string;
          type_id?: string | null;
          display_order?: number;
        };
        Update: {
          id?: string;
          name?: string;
          content_id?: string;
          type_id?: string | null;
          display_order?: number;
        };
      };
    };
    Views: {
      [key: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
    Functions: {
      [key: string]: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
    };
    Enums: {
      [key: string]: string[];
    };
    CompositeTypes: {
      [key: string]: {
        [key: string]: unknown;
      };
    };
  };
}
