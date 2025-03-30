
import { ReactNode } from 'react';

export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  type_name?: string | null;
}

export interface TagPosition {
  id: string;
  position: number;
}

export interface SourceMetadata {
  external_source_url: string | null;
  needs_external_review: boolean;
  external_source_checked_at: string | null;
}

export interface OntologyTerm {
  id: string;
  term: string;
  description: string | null;
  review_required?: boolean;
  domain?: string | null;
}

export interface MetadataPanelProps {
  contentId: string;
  onMetadataChange?: () => void;
  isCollapsible?: boolean;
  initialCollapsed?: boolean;
  showOntologyTerms?: boolean;
  showDomain?: boolean;
  domain?: string | null;
  editable?: boolean;
  className?: string;
  children?: ReactNode;
}

export interface MetadataContentProps {
  isLoading: boolean;
  error: Error | null;
  contentId: string;
  externalSourceUrl: string | null;
  lastCheckedAt: string | null;
  tags: Tag[];
  editable?: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: () => void;
  onDeleteTag: (tagId: string) => void;
  isPending: boolean;
  showOntologyTerms: boolean;
  ontologyTerms: OntologyTerm[];
  onMetadataChange?: () => void;
  onRefresh?: () => void;
  children?: ReactNode;
}

export interface HeaderSectionProps {
  needsExternalReview: boolean;
  handleRefresh: () => void;
  isLoading: boolean;
  isCollapsible: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  className?: string;
}

export interface OntologyTermsSectionProps {
  terms: OntologyTerm[];
  sourceId: string;
  editable: boolean;
  className?: string;
}

export interface ExternalSourceSectionProps {
  contentId: string;
  externalSourceUrl: string | null;
  lastCheckedAt: string | null;
  editable: boolean;
  onMetadataChange?: () => void;
  className?: string;
}

export interface TagsSectionProps {
  tags: Tag[];
  contentId: string;
  editable: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: () => void;
  onDeleteTag: (tagId: string) => void;
  onMetadataChange?: () => void;
  className?: string;
}

export interface ErrorStateProps {
  error: Error;
  title: string;
  retry?: () => void;
}

export interface UseInlineMetadataEditProps {
  contentId: string;
  onMetadataChange?: () => void;
}

export interface UseTagReorderingProps {
  contentId: string;
  onMetadataChange?: () => void;
}
