
/**
 * Source metadata type definition for external sources
 */
export interface SourceMetadata {
  id: string;
  title: string;
  external_source_url: string | null;
  external_source_checked_at: string | null;
  external_content_hash: string | null;
  needs_external_review: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * External source metadata (simplified version)
 */
export interface ExternalSourceMetadata {
  externalSourceUrl: string | null;
  lastCheckedAt: string | null;
  needsExternalReview: boolean;
}

/**
 * Simple source metadata with content and additional fields
 */
export interface SimpleSourceMetadata extends SourceMetadata {
  content: string;
  created_at: string;
  published_at: string | null;
  metadata: any | null;
}

/**
 * Metadata summary interface
 */
export interface MetadataSummary {
  tagCount: number;
  ontologyTermCount: number;
  hasExternalSource: boolean;
  needsExternalReview: boolean;
  lastUpdated: string | null;
}
