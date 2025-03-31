
import { ValidationResult } from '@/utils/validation/types';

/**
 * Props for the MetadataPanel component
 */
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
  children?: React.ReactNode;
}

/**
 * Structure of a source's metadata
 */
export interface SourceMetadata {
  id: string;
  title: string;
  content?: string;
  external_source_url: string | null;
  external_source_checked_at: string | null;
  external_content_hash?: string | null;
  needs_external_review: boolean;
  published?: boolean;
  published_at?: string | null;
  updated_at: string;
  created_at?: string;
  metadata?: Record<string, any> | null;
}

/**
 * Simple version of source metadata with fewer fields
 */
export interface SimpleSourceMetadata {
  id: string;
  title: string;
  content: string;
  external_source_url: string | null;
  external_source_checked_at: string | null;
  needs_external_review: boolean;
  published: boolean;
  published_at: string | null;
  updated_at: string;
  created_at: string;
  metadata: Record<string, any> | null;
}

/**
 * Ontology term structure
 */
export interface OntologyTerm {
  id: string;
  term: string;
  domain?: string;
  description?: string;
}
