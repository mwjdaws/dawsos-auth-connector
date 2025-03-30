
/**
 * MetadataPanel component types
 */

export interface MetadataPanelProps {
  contentId: string;
  editable?: boolean;
  isCollapsible?: boolean;
  initialCollapsed?: boolean;
  showOntologyTerms?: boolean;
  onMetadataChange?: () => void;
  className?: string;
}

export interface SourceMetadata {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  user_id: string;
  is_published: boolean;
  published_at: string | null;
  external_source_url: string | null;
  external_source_checked_at: string | null;
  external_content_hash: string | null;
  needs_external_review: boolean;
}

export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string | null;
}

export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain?: string;
}

export interface ExternalSourceMetadata {
  url: string | null;
  lastChecked: string | null;
  needsReview: boolean;
}

export interface TagsSectionProps {
  tags: Tag[];
  editable?: boolean;
  newTag?: string;
  setNewTag?: (value: string) => void;
  onAddTag?: () => Promise<void>;
  onDeleteTag?: (tagId: string) => Promise<void>;
  onUpdateTagOrder?: (tags: Tag[]) => void;
}

// Props for ContentAlert component
export interface ContentAlertProps {
  contentId: string;
  isValidContent: boolean;
  contentExists: boolean;
  validationResult: string;
}

// Props for MetadataContent component
export interface MetadataContentProps {
  contentId: string;
  contentExists: boolean;
  isValidContent: boolean;
  tags: Tag[];
  ontologyTerms: OntologyTerm[];
  isLoading: boolean;
  error: Error | null;
  editable?: boolean;
  onMetadataChange?: () => void;
  handleRefresh: () => void;
}

// Props for OntologyTermsSection
export interface OntologyTermsSectionProps {
  terms: OntologyTerm[];
  editable?: boolean;
  onDeleteTerm?: (termId: string) => Promise<void>;
}

export type ValidationStatus = 'valid' | 'invalid' | 'missing' | 'pending';
