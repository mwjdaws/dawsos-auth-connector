
/**
 * Type definitions for test files
 * 
 * This file provides common type definitions for test files to prevent
 * implicit any type errors in test files.
 */

import { Tag, OntologyTerm } from '@/components/MetadataPanel/types';

// Header section test props
export interface HeaderSectionTestProps {
  handleRefresh: () => void;
  setIsCollapsed: (value: boolean) => void;
  isCollapsed: boolean;
  needsExternalReview?: boolean;
  isLoading?: boolean;
}

// External source section test props
export interface ExternalSourceSectionTestProps {
  externalSourceUrl: string | null;
  lastCheckedAt?: string | null;
  editable: boolean;
  onMetadataChange?: () => void;
  contentId: string;
}

// Tags section test props
export interface TagsSectionTestProps {
  tags: Tag[];
  editable: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: (typeId?: string | null) => Promise<void>;
  onDeleteTag: (tagId: string) => Promise<void>;
  contentId?: string;
  onMetadataChange?: () => void;
}

// Domain section test props
export interface DomainSectionTestProps {
  domain: string | null;
}

// Ontology section test props
export interface OntologySectionTestProps {
  sourceId: string;
  editable: boolean;
}

// Content ID section test props
export interface ContentIdSectionTestProps {
  contentId: string;
}

// Test tag type
export interface TestTag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string | null;
}

// Test suggestion type
export interface TestSuggestion {
  id: string;
  term: string;
  description?: string;
  domain?: string;
  score?: number;
}
