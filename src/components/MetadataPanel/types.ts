
import { Tag } from '@/types/tag';

/**
 * External source metadata type
 */
export interface ExternalSourceMetadata {
  externalSource: string | null;
  needsExternalReview: boolean;
  lastCheckedAt: string | null;
}

/**
 * Source metadata from the database
 */
export interface SourceMetadata {
  id: string;
  title: string;
  content: string;
  external_source_url: string | null;
  needs_external_review: boolean;
  external_source_checked_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

/**
 * Ontology term type
 */
export interface OntologyTerm {
  id: string;
  term: string;
  description: string | null;
  review_required: boolean;
}

/**
 * Props for the main MetadataPanel component
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
}

/**
 * Props for the MetadataQuery provider
 */
export interface MetadataQueryProviderProps {
  contentId: string;
  editable?: boolean;
  children: React.ReactNode;
}

/**
 * Context for metadata components
 */
export interface MetadataContextProps {
  contentId: string;
  editable: boolean;
  isLoading: boolean;
  error: Error | null;
  tags: Tag[];
  ontologyTerms: OntologyTerm[];
  sourceMetadata: SourceMetadata | null;
  refetchAll: () => Promise<void>;
  refetchTags: () => Promise<void>;
  refetchOntologyTerms: () => Promise<void>;
  refetchSourceMetadata: () => Promise<void>;
}

/**
 * Props for the useMetadataPanel hook
 */
export interface UseMetadataPanelProps {
  contentId: string;
  onMetadataChange: (() => void) | null;
  isCollapsible?: boolean;
  initialCollapsed?: boolean;
}

/**
 * Props for sections
 */
export interface ContentIdDetailProps {
  contentId: string;
  className?: string;
}

export interface TagsSectionProps {
  tags: Tag[];
  contentId: string;
  editable: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: (typeId?: string | null) => Promise<void>;
  onDeleteTag: (tagId: string) => Promise<void>;
  onMetadataChange?: () => void;
  className?: string;
}

export interface OntologyTermsSectionProps {
  ontologyTerms: OntologyTerm[];
  contentId: string;
  editable: boolean;
  onAssignTerm?: (termId: string) => Promise<void>;
  onRemoveTerm?: (termId: string) => Promise<void>;
  onCreateTerm?: (term: string, description?: string) => Promise<void>;
  className?: string;
}

export interface DomainSectionProps {
  domain: string | null;
  editable: boolean;
  onChangeDomain?: (domain: string) => Promise<void>;
  className?: string;
}
