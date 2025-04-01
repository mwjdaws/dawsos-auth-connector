
import { Tag } from '@/types/tag';
import { OntologyTerm } from '@/types/ontology';
import { ValidationResult } from '@/utils/validation/types';

/**
 * Source metadata for a content item
 */
export interface SourceMetadata {
  id: string;
  title: string;
  content: string;
  created_at: string | null;
  updated_at: string | null;
  user_id: string | null;
  created_by: string | null;
  published: boolean;
  published_at: string | null;
  external_source_url: string | null;
  external_source_checked_at: string | null;
  external_content_hash: string | null;
  needs_external_review: boolean;
  template_id: string | null;
}

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
  onMetadataChange?: (() => void) | null;
  children?: React.ReactNode;
}

/**
 * Props for the MetadataContext
 */
export interface MetadataContextProps {
  contentId: string;
  tags: Tag[];
  validationResult: ValidationResult | null;
  isEditable: boolean;
  isLoading: boolean;
  error: Error | null;
  ontologyTerms?: OntologyTerm[];
  sourceMetadata?: SourceMetadata | null;
  refreshMetadata?: () => Promise<void>;
  fetchTags?: () => Promise<Tag[]>;
  handleAddTag?: (tagName: string, typeId?: string | null) => Promise<void>;
  handleDeleteTag?: (tagId: string) => Promise<void>;
}

/**
 * Props for the MetadataContent component
 */
export interface MetadataContentProps {
  contentId: string;
  data: SourceMetadata | null;
  tags: Tag[];
  error: Error | null;
  editable: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: (typeId?: string | null) => Promise<void>;
  onDeleteTag: (tagId: string) => Promise<void>;
  onRefresh: () => void;
  externalSourceUrl: string | null;
  lastCheckedAt: string | null;
  needsExternalReview: boolean;
  showOntologyTerms?: boolean;
  domain?: string | null;
  showDomain?: boolean;
}
