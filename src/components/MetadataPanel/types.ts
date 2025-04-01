import { Tag } from '@/types/tag';
import { OntologyTerm } from '@/types/ontology';

// Export OntologyTerm to resolve the error
export type { OntologyTerm };

/**
 * Metadata context props interface
 */
export interface MetadataContextProps {
  contentId: string;
  tags: Tag[];
  validationResult: {
    isValid: boolean;
    contentExists: boolean;
    errorMessage: string | null;
  };
  isEditable: boolean;
  isLoading: boolean;
  error: Error | null;
  sourceMetadata: SourceMetadata | null;
  refreshMetadata?: () => Promise<void>;
  handleAddTag?: (tagName: string, typeId?: string | null) => Promise<void>;
  handleDeleteTag?: (tagId: string) => Promise<void>;
  handleReorderTags?: (tags: Tag[]) => Promise<void>;
}

/**
 * Source metadata interface
 */
export interface SourceMetadata {
  id: string;
  title: string;
  external_source_url: string | null;
  external_source_checked_at: string | null;
  needs_external_review: boolean;
  published: boolean;
  updated_at: string | null;
}

/**
 * External source metadata interface
 */
export interface ExternalSourceMetadata {
  externalSourceUrl: string | null;
  lastCheckedAt: string | null;
  needsExternalReview: boolean;
}

// Add SimpleSourceMetadata interface to fix the error in useSourceMetadata.ts
export interface SimpleSourceMetadata extends SourceMetadata {
  content: string;
  created_at: string;
  published_at: string | null;
  metadata: any | null;
}

/**
 * Header section props interface
 */
export interface HeaderSectionProps {
  title?: string;
  needsExternalReview: boolean;
  handleRefresh: () => void;
  isCollapsible?: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isLoading?: boolean;
}

/**
 * External source section props interface
 */
export interface ExternalSourceSectionProps {
  externalSourceUrl: string | null;
  lastCheckedAt: string | null;
  needsExternalReview: boolean;
  editable: boolean;
  contentId: string;
  onMetadataChange?: () => void;
}

/**
 * Content ID section props interface
 */
export interface ContentIdSectionProps {
  contentId: string;
}

/**
 * Ontology section props interface
 */
export interface OntologySectionProps {
  sourceId: string;
  editable: boolean;
}

/**
 * Tags section props interface
 */
export interface TagsSectionProps {
  tags: Tag[];
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: (typeId?: string | null) => Promise<void>;
  onDeleteTag: (tagId: string) => Promise<void>;
  onReorderTags?: (reorderedTags: Tag[]) => Promise<void>;
  editable?: boolean;
  isAddingTag?: boolean;
  isDeletingTag?: boolean;
  isReordering?: boolean;
  onMetadataChange?: () => void;
  className?: string;
}

/**
 * Domain section props interface
 */
export interface DomainSectionProps {
  domain: string;
}

/**
 * Ontology terms section props interface
 */
export interface OntologyTermsSectionProps {
  sourceId: string;
  editable: boolean;
  terms?: OntologyTerm[];
}

/**
 * Metadata panel props interface
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
 * Tag list props interface
 */
export interface TagListProps {
  tags: Tag[];
  editable: boolean;
  onDeleteTag: (tagId: string) => Promise<void>;
  onReorderTags?: (tags: Tag[]) => Promise<void>;
}
