
/**
 * Draft Types
 * 
 * Types related to draft documents and versioning
 */

export interface Draft {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  template_id: string | null;
  user_id: string | null;
  external_source_url: string | null;
}

export interface DraftMetadata {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  template_id: string | null;
  external_source_url: string | null;
}

export interface DraftVersion {
  id: string;
  draft_id: string;
  content: string;
  metadata: Record<string, any> | null;
  created_at: string;
  created_by: string | null;
  is_auto_save: boolean;
}
