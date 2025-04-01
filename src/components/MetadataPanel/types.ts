
/**
 * Props for the MetadataPanel component
 */
export interface MetadataPanelProps {
  contentId: string;
  editable?: boolean;
  isCollapsible?: boolean;
  initialCollapsed?: boolean;
  showOntologyTerms?: boolean;
  showDomain?: boolean;
  domain?: string | null;
  className?: string;
  children?: React.ReactNode;
  onMetadataChange?: (() => void) | null;
}

/**
 * Tag interface for MetadataPanel
 */
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string;
  display_order: number;
  type_name: string;
  color?: string;
  icon?: string;
}

/**
 * Validation result type for content
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  contentExists: boolean;
  message?: string | null;
}

/**
 * Source metadata interface for knowledge sources
 */
export interface SourceMetadata {
  id: string;
  content: string;
  title: string;
  created_at: string | null;
  updated_at: string | null;
  user_id: string | null;
  created_by: string | null;
  external_source_url: string | null;
  external_content_hash: string | null;
  external_source_checked_at: string | null;
  needs_external_review: boolean;
  published: boolean;
  published_at: string | null;
  template_id: string | null;
  metadata: Record<string, any> | null;
}

/**
 * Ontology term interface
 */
export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain?: string | null;
  review_required?: boolean;
}
