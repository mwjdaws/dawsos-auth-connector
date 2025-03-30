
import { User } from '@supabase/supabase-js';

export interface MetadataPanelProps {
  contentId: string;
  onMetadataChange?: () => void;
  className?: string;
  editable?: boolean;
  showOntologyTerms?: boolean;
  showDomain?: boolean;
  isCollapsible?: boolean;
  initialCollapsed?: boolean;
  domain?: string;
  children?: React.ReactNode;
}

export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string;
  type_name?: string;
}

export interface OntologyTerm {
  id: string;
  name: string;
  description?: string;
  domainId?: string;
  domainName?: string;
}

export interface SourceMetadata {
  title?: string;
  description?: string;
  author?: string;
  publishedDate?: string;
  lastUpdated?: string;
  sourceUrl?: string;
  external_source_url?: string | null;
  needs_external_review?: boolean;
  external_source_checked_at?: string | null;
  [key: string]: any;
}

export interface HeaderSectionProps {
  needsExternalReview?: boolean;
  handleRefresh?: () => void;
  isLoading?: boolean;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
  setIsCollapsed?: (value: boolean) => void;
}

export interface OntologyTermsSectionProps {
  ontologyTerms: OntologyTerm[];
  editable?: boolean;
  contentId?: string;
  onMetadataChange?: () => void;
}

export interface ContentValidationResult {
  isValid: boolean;
  contentExists: boolean;
  message?: string;
}

export interface MetadataContextState {
  contentId: string;
  isLoading: boolean;
  error: any;
  tags: Tag[];
  ontologyTerms: OntologyTerm[];
  metadata: SourceMetadata | null;
  editable: boolean;
  handleRefresh: () => void;
}
