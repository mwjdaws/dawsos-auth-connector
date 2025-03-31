
/**
 * Types for MetadataPanel component
 */
import { Tag } from '@/types/tag';

/**
 * Source metadata interface
 */
export interface SourceMetadata {
  id: string;
  title: string;
  content: string;
  created_at: string | null;
  updated_at: string | null;
  published: boolean;
  published_at: string | null;
  external_source_url: string | null;
  external_source_checked_at: string | null;
  external_content_hash: string | null;
  needs_external_review: boolean;
  metadata: Record<string, any> | null;
}

/**
 * Simplified source metadata for lighter context
 */
export interface SimpleSourceMetadata {
  id: string;
  title: string;
  content: string; // Changed from optional to required to match SourceMetadata
  updated_at: string | null;
  published: boolean;
  external_source_url?: string | null;
  external_source_checked_at?: string | null;
  external_content_hash?: string | null;
  needs_external_review?: boolean;
  created_at?: string | null;
  published_at?: string | null;
  metadata?: Record<string, any> | null;
}

/**
 * External source metadata
 */
export interface ExternalSourceMetadata {
  url: string | null;
  checkedAt: string | null;
  contentHash: string | null;
  needsReview: boolean;
  isValid?: boolean;
}

/**
 * Ontology term interface
 */
export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain?: string;
  review_required?: boolean;
  relation_type?: string | null;
}

/**
 * Props for OntologyTermsSection
 */
export interface OntologyTermsSectionProps {
  terms: OntologyTerm[];
  contentId: string;
  editable?: boolean;
  onAdd?: (term: OntologyTerm) => Promise<void>;
  onDelete?: (termId: string) => Promise<void>;
  sourceId?: string;
  onMetadataChange?: () => void;
  className?: string;
  ontologyTerms?: OntologyTerm[];
}

/**
 * MetadataPanel props interface
 */
export interface MetadataPanelProps {
  contentId: string;
  editable?: boolean;
  isCollapsible?: boolean;
  initialCollapsed?: boolean;
  showOntologyTerms?: boolean;
  className?: string;
  onMetadataChange?: (() => void) | null;
  showDomain?: boolean;
  domain?: string | null;
  children?: React.ReactNode;
}

/**
 * Re-export Tag from @/types/tag to avoid circular dependencies
 */
export type { Tag };
