
/**
 * Common type definitions shared across the application
 */

// Import and re-export the Tag type from the centralized definition
export { Tag, AugmentedTag, TagPosition } from './tag';

// Knowledge Source type definition
export interface KnowledgeSource {
  id: string;
  title: string;
  content: string;
  created_at?: string | null;
  updated_at?: string | null;
  user_id: string;
  template_id?: string | null;
  external_source_url?: string | null;
  external_source_checked_at?: string | null;
  external_content_hash?: string | null;
  needs_external_review?: boolean;
}

// External Source Metadata
export interface ExternalSourceMetadata {
  url: string | null;
  lastCheckedAt: string | null;
  contentHash: string | null;
  needsReview: boolean;
}

// Ontology Term definition
export interface OntologyTerm {
  id: string;
  term: string;
  description?: string;
  domain?: string | null;
  domain_id?: string | null;
}

// API Response wrapper type
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

// Status types for async operations
export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
