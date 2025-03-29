
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

export interface HeaderSectionProps extends BaseSectionProps {
  needsExternalReview: boolean;
  handleRefresh: () => void;
  isLoading: boolean;
  isCollapsible: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export interface ExternalSourceSectionProps extends BaseSectionProps {
  externalSourceUrl?: string;
  lastCheckedAt?: string;
}

export interface DomainSectionProps extends BaseSectionProps {
  domain: string | null;
}

export interface ContentIdSectionProps extends BaseSectionProps {
  contentId: string;
}

export interface OntologyTermsSectionProps extends BaseSectionProps {
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
