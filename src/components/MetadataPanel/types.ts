
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
  onMetadataChange?: () => void;
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
