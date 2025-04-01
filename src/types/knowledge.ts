
import { Json } from '@/integrations/supabase/types';

/**
 * Knowledge template type
 */
export interface KnowledgeTemplate {
  id: string;
  name: string;
  content: string;
  structure?: Json;
  metadata?: Json;
  user_id?: string | null;
  is_global?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Knowledge source type
 */
export interface KnowledgeSource {
  id: string;
  title: string;
  content: string;
  user_id?: string | null;
  created_by?: string | null; 
  created_at?: string;
  updated_at?: string;
  external_source_url?: string | null;
  external_source_checked_at?: string | null;
  external_content_hash?: string | null;
  needs_external_review?: boolean;
  published?: boolean;
  published_at?: string | null;
  template_id?: string | null;
  metadata?: Json;
}

/**
 * Knowledge source version type
 */
export interface KnowledgeSourceVersion {
  id: string;
  source_id: string;
  content: string;
  version_number: number;
  created_at?: string;
  metadata?: Json;
}

/**
 * Knowledge source content type
 */
export type KnowledgeContent = {
  id: string;
  title: string;
  content: string;
  templateId?: string | null;
  externalSourceUrl?: string | null;
};
