
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
  domain?: string | null;
  children?: React.ReactNode;
}

export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string | null;
  type_name?: string | null;
}

export interface OntologyTerm {
  id: string;
  term: string;
  description?: string | null;
  domainId?: string | null;
  domainName?: string | null;
}

export interface SourceMetadata {
  title?: string | null;
  description?: string | null;
  author?: string | null;
  publishedDate?: string | null;
  lastUpdated?: string | null;
  sourceUrl?: string | null;
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
  className?: string;
}

export interface OntologyTermsSectionProps {
  ontologyTerms: OntologyTerm[];
  editable?: boolean;
  contentId?: string;
  sourceId?: string | null;
  onMetadataChange?: () => void;
  className?: string;
}

export interface ContentValidationResult {
  isValid: boolean;
  contentExists: boolean;
  message?: string | null;
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
