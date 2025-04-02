
import { Tag } from '@/types/tag';

/**
 * Ontology term representation
 */
export interface OntologyTerm {
  /**
   * Unique identifier
   */
  id: string;
  
  /**
   * The term text
   */
  term: string;
  
  /**
   * Description of the term
   */
  description: string;
  
  /**
   * Domain the term belongs to
   */
  domain: string;
  
  /**
   * Whether this term requires review
   */
  review_required?: boolean;
}

/**
 * Metadata for external sources
 */
export interface SourceMetadata {
  /**
   * The external URL source, if any
   */
  external_source_url: string | null;
  
  /**
   * Hash of the external content for change detection
   */
  external_content_hash?: string | null;
  
  /**
   * When the external source was last checked
   */
  external_source_checked_at?: string | null;
  
  /**
   * Whether the external source needs review
   */
  needs_external_review: boolean;
}

/**
 * Props for the metadata panel
 */
export interface MetadataPanelProps {
  /**
   * ID of the content to show metadata for
   */
  contentId: string;
  
  /**
   * Whether the metadata is editable
   * @default false
   */
  editable?: boolean;
  
  /**
   * Callback when metadata changes
   */
  onMetadataChange?: (() => void) | null;
  
  /**
   * Whether the panel can be collapsed
   * @default false
   */
  isCollapsible?: boolean;
  
  /**
   * Whether the panel starts collapsed
   * @default false
   */
  initialCollapsed?: boolean;
  
  /**
   * Whether to show ontology terms section
   * @default true
   */
  showOntologyTerms?: boolean;
  
  /**
   * Whether to show domain information
   * @default false
   */
  showDomain?: boolean;
  
  /**
   * Domain to filter by, if any
   */
  domain?: string | null;
  
  /**
   * Additional CSS class name
   */
  className?: string;
}

/**
 * Props for the MetadataQuery provider
 */
export interface MetadataQueryProviderProps {
  /**
   * ID of the content to provide metadata for
   */
  contentId: string;
  
  /**
   * Whether the metadata is editable
   */
  editable: boolean;
  
  /**
   * Children to render
   */
  children: React.ReactNode;
}

/**
 * Validation result type
 */
export interface ValidationResult {
  /**
   * Whether the validation passed
   */
  isValid: boolean;
  
  /**
   * Error message if not valid
   */
  errorMessage: string | null;
}
