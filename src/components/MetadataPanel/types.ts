
import { OntologyTerm } from '@/hooks/markdown-editor/ontology-terms/types';
import { ReactNode } from 'react';

export interface Tag {
  name: string;
  id?: string;
  content_id?: string;
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

export interface HeaderSectionProps {
  needsExternalReview: boolean;
  handleRefresh: () => void;
  isLoading: boolean;
  isCollapsible: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export interface ExternalSourceSectionProps {
  externalSourceUrl?: string;
  lastCheckedAt?: string;
}

export interface DomainSectionProps {
  domain: string | null;
}

export interface ContentIdSectionProps {
  contentId: string;
}

export interface OntologyTermsSectionProps {
  sourceId: string;
  editable: boolean;
}

export interface BaseSectionProps {
  className?: string;
}

export interface MetadataContextState {
  contentId: string;
  title?: string;
  tags: any[];
  domains: string[];
  externalSource?: string;
  ontologyTerms: OntologyTerm[];
  loading: boolean;
  error: string | null;
  setTags: (tags: any[]) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  refreshTags: () => void;
}
