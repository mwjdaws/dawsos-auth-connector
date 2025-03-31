
import { ReactNode } from 'react';
import { Tag } from '@/types/tag';

// Define OntologyTerm
export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain?: string;
  review_required: boolean;
}

// Base metadata panel props
export interface MetadataPanelProps {
  contentId: string;
  editable?: boolean;
  onMetadataChange?: (() => void) | null;
  isCollapsible?: boolean;
  initialCollapsed?: boolean;
  showOntologyTerms?: boolean;
  showDomain?: boolean;
  domain?: string | null;
  className?: string;
  children?: ReactNode;
}

// Source metadata
export interface SourceMetadata {
  id: string;
  title: string;
  content: string;
  external_source_url: string | null;
  external_source_checked_at: string | null;
  external_content_hash: string | null;
  needs_external_review: boolean;
  is_published: boolean;
}

// Simplified source metadata for internal use
export interface SimpleSourceMetadata {
  id: string;
  external_source_url: string | null;
  external_source_checked_at: string | null;
  external_content_hash: string | null;
  needs_external_review: boolean;
  is_published: boolean;
}

// External source metadata
export interface ExternalSourceMetadata {
  url: string | null;
  lastChecked: string | null;
  needsReview: boolean;
}

// Props for the OntologyTermsSection component
export interface OntologyTermsSectionProps {
  contentId: string;
  editable?: boolean;
  sourceId?: string;
  onMetadataChange?: (() => void) | null;
  className?: string;
  ontologyTerms?: OntologyTerm[];
}

// Re-export Tag type from the centralized location
export type { Tag };
