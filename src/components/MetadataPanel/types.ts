
/**
 * MetadataPanel Types
 * 
 * This file contains TypeScript interface definitions for the MetadataPanel component system.
 * It includes types for:
 * - Props for all section components
 * - Main MetadataPanel component props
 * - Metadata context state and operations
 * - Data structures for tags and source metadata
 */

import { ReactNode } from "react";

/**
 * Base props interface for all metadata panel sections
 */
export interface BaseSectionProps {
  className?: string;
}

/**
 * Props for the HeaderSection component
 */
export interface HeaderSectionProps extends BaseSectionProps {
  needsExternalReview: boolean;
  handleRefresh: () => void;
  isLoading: boolean;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

/**
 * Props for the ExternalSourceSection component
 */
export interface ExternalSourceSectionProps extends BaseSectionProps {
  externalSourceUrl: string | null;
  lastCheckedAt: string | null;
}

/**
 * Tag object structure
 */
export interface Tag {
  id: string;
  name: string;
  content_id: string;
}

/**
 * Props for the TagsSection component
 */
export interface TagsSectionProps extends BaseSectionProps {
  tags: Tag[];
  editable: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: () => void;
  onDeleteTag: (tagId: string) => void;
}

/**
 * Props for the ContentIdSection component
 */
export interface ContentIdSectionProps extends BaseSectionProps {
  contentId: string;
}

/**
 * Props for the OntologyTermsSection component
 */
export interface OntologyTermsSectionProps extends BaseSectionProps {
  sourceId: string;
  editable: boolean;
}

/**
 * Props for the DomainSection component
 */
export interface DomainSectionProps extends BaseSectionProps {
  domain: string | null;
}

/**
 * Main MetadataPanel component props
 */
export interface MetadataPanelProps {
  contentId: string;
  onMetadataChange?: () => void;
  isCollapsible?: boolean;
  initialCollapsed?: boolean;
  showOntologyTerms?: boolean;
  editable?: boolean;
  showDomain?: boolean;
  domain?: string | null;
  className?: string;
  children?: ReactNode;
}

/**
 * Source metadata structure
 */
export interface SourceMetadata {
  external_source_url: string | null;
  needs_external_review: boolean;
  external_source_checked_at: string | null;
}

/**
 * Metadata context state exposed by useMetadataContext hook
 */
export interface MetadataContextState {
  // Content info
  contentId: string;
  
  // Tag operations
  tags: Tag[];
  newTag: string;
  setNewTag: (value: string) => void;
  handleAddTag: () => void;
  handleDeleteTag: (tagId: string) => void;
  
  // External source info
  externalSourceUrl: string | null;
  needsExternalReview: boolean;
  lastCheckedAt: string | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  isPending: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  
  // User state
  isEditable: boolean;
  
  // Operations
  handleRefresh: () => void;
  refreshMetadata: () => Promise<void>;
}
