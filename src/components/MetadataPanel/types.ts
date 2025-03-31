
import { ReactNode } from 'react';

// Source metadata type - updated to make non-optional fields nullable to match database
export interface SourceMetadata {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  external_source_url: string | null;
  external_source_checked_at: string | null;
  external_content_hash: string | null;
  needs_external_review: boolean;
  is_published: boolean;
  published_at: string | null;
  template_id: string | null;
}

// Simplified source metadata for hooks that only use a subset of fields
export interface SimpleSourceMetadata {
  id: string;  // Made required to match SourceMetadata
  title?: string;  
  content?: string;  
  created_at?: string;  
  updated_at?: string;  
  external_source_url: string | null;
  external_source_checked_at: string | null;
  external_content_hash: string | null;
  needs_external_review: boolean;
  is_published: boolean;
  published_at?: string | null;
  template_id?: string | null;
}

// Tag type
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
}

// Ontology term type
export interface OntologyTerm {
  id: string;
  term: string;
  description?: string | null;
  domain?: string | null;
  review_required?: boolean;
}

// Props for the main MetadataPanel component
export interface MetadataPanelProps {
  contentId: string;
  editable?: boolean;
  onMetadataChange?: (() => void);
  isCollapsible?: boolean;
  initialCollapsed?: boolean;
  showOntologyTerms?: boolean;
  showDomain?: boolean;
  domain?: string | null;
  className?: string;
  children?: ReactNode;
}

// Props for the MetadataContent component
export interface MetadataContentProps {
  data: SourceMetadata | null;
  contentId: string;
  error: any;
  tags: Tag[];
  editable: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: (typeId?: string | null) => Promise<void>;
  onDeleteTag: (tagId: string) => Promise<void>;
  onRefresh: () => void;
  externalSourceUrl: string | null;
  lastCheckedAt: string | null;
  needsExternalReview: boolean;
  onMetadataChange: (() => void);
  showOntologyTerms: boolean;
}

// Props for the HeaderSection component
export interface HeaderSectionProps {
  needsExternalReview?: boolean;
  handleRefresh?: () => void;
  isLoading?: boolean;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
  setIsCollapsed?: ((value: boolean) => void);
  className?: string;
}

// Props for the ExternalSourceSection component
export interface ExternalSourceSectionProps {
  externalSourceUrl: string | null;
  lastCheckedAt: string | null;
  editable: boolean;
  onMetadataChange?: (() => void);
  contentId: string;
}

// Props for the TagsSection component
export interface TagsSectionProps {
  tags: Tag[];
  contentId: string;
  editable: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: (typeId?: string | null) => Promise<void>;
  onDeleteTag: (tagId: string) => Promise<void>;
  onMetadataChange?: (() => void);
  className?: string;
}

// Props for the OntologySection component
export interface OntologySectionProps {
  sourceId: string;
  editable: boolean;
}

// Props for the OntologyTermsSection component
export interface OntologyTermsSectionProps {
  contentId: string;
  sourceId?: string;
  editable?: boolean;
  onMetadataChange?: (() => void);
  className?: string;
  ontologyTerms?: OntologyTerm[]; 
}

// Props for the ContentAlert component
export interface ContentAlertProps {
  contentId: string;
  isValidContent: boolean;
  contentExists: boolean;
}

// Props for the DomainSection component
export interface DomainSectionProps {
  domain: string | null;
  className?: string;
}
