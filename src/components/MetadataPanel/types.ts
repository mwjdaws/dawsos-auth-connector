
import { Tag } from '@/types/tag';
import { ValidationResult } from '@/utils/validation/types';

/**
 * Ontology term interface
 * 
 * Represents a term from the knowledge domain ontology
 */
export interface OntologyTerm {
  id: string;
  term: string;
  description?: string;
  domain?: string;
  relation_type?: string | null;
  review_required?: boolean;
}

/**
 * Metadata panel props interface
 * 
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
 * TagPosition interface
 * 
 * Used for tag reordering operations
 */
export interface TagPosition {
  id: string;
  position: number;
}

/**
 * External source metadata interface
 * 
 * Information about external sources for content
 */
export interface ExternalSourceMetadata {
  externalSourceUrl: string | null;
  needsExternalReview: boolean;
  lastCheckedAt: string | null;
}
