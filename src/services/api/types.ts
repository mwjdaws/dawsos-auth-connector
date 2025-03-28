
import { Json } from '@/integrations/supabase/types';

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface KnowledgeSource {
  id: string;
  title: string;
  content: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  template_id?: string;
}

export interface KnowledgeSourceVersion {
  id: string;
  source_id: string;
  version_number: number;
  content: string;
  metadata?: Json;
  created_at?: string;
}

export interface KnowledgeTemplate {
  id: string;
  name: string;
  content: string;
  metadata?: Json;
  structure?: Json;
  is_global?: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}
