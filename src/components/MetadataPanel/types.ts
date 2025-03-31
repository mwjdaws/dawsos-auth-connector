
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
  updated_at: string | null;
  published: boolean;
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
  onMetadataChange?: () => void;
}
