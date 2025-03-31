
import { ReactNode } from 'react';

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

// Standardized tag interface
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  type_name?: string | null;
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

// Ontology term
export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain?: string | null;
}
