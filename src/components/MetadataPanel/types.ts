
import { Tag } from '@/types/tag';

/**
 * MetadataPanel Props
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
 * Provider Props
 */
export interface MetadataProviderProps {
  contentId: string;
  editable?: boolean;
  children: React.ReactNode;
}

/**
 * Ontology Term Structure
 */
export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain?: string;
  review_required?: boolean;
}

/**
 * External Source Metadata
 */
export interface ExternalSourceMetadata {
  url: string | null;
  lastCheckedAt: string | null;
  needsExternalReview: boolean;
}

/**
 * Source Metadata
 */
export interface SourceMetadata {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  externalSource: ExternalSourceMetadata | null;
  userId: string | null;
  isPublished: boolean;
}

/**
 * Metadata State
 */
export interface MetadataState {
  tags: Tag[];
  ontologyTerms: OntologyTerm[];
  externalSource: ExternalSourceMetadata | null;
  isLoading: boolean;
  error: Error | null;
}
