
import { ReactNode } from 'react';
import { Tag } from './hooks/tag-operations/types';

export interface SourceMetadata {
  external_source_url: string | null;
  needs_external_review: boolean;
  external_source_checked_at: string | null;
}

export interface OntologyTerm {
  id: string;
  term: string;
  description?: string;
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
  error: any;
  contentId: string;
  externalSourceUrl: string | null;
  lastCheckedAt: string | null;
  tags: Tag[];
  editable?: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: (typeId?: string | null) => Promise<void>;
  onDeleteTag: (tagId: string) => Promise<void>;
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
}
