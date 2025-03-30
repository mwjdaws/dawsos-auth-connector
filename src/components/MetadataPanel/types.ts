
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
  [key: string]: any;
}
