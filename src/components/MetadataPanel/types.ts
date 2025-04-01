
/**
 * Types for MetadataPanel components
 */

import { Tag } from '@/types/tag';

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
}

export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain?: string;
}

export interface MetadataState {
  tags: Tag[];
  ontologyTerms: OntologyTerm[];
  externalSource: ExternalSourceMetadata | null;
  isLoading: boolean;
  error: Error | null;
}

export interface ExternalSourceMetadata {
  external_source_url: string | null;
  external_source_checked_at: string | null;
  needs_external_review: boolean;
}

export interface DomainInfo {
  id: string;
  name: string;
  description: string;
}

// Source metadata for compatibility
export interface SourceMetadata {
  id?: string;
  title?: string;
  content?: string;
  created_at?: string;
  updated_at?: string;
  external_source_url: string | null;
  external_source_checked_at: string | null;
  needs_external_review: boolean;
  external_content_hash?: string | null;
  user_id?: string | null;
}
