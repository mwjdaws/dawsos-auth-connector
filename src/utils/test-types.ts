
/**
 * Types used for testing purposes
 */
import { Tag } from '@/types/tag';

// Test props for different sections
export interface HeaderSectionTestProps {
  title: string;
  lastUpdated?: string;
  handleRefresh: () => void;
  setIsCollapsed: (value: boolean) => void;
  isCollapsed: boolean;
  needsExternalReview?: boolean;
}

export interface TagsSectionTestProps {
  tags: Tag[];
  editable: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: (typeId?: string | null) => Promise<void>;
  onDeleteTag: (tagId: string) => Promise<void>;
  contentId: string;
  onMetadataChange?: () => void;
}

export interface OntologySectionTestProps {
  terms: { id: string; term: string; description: string }[];
  editable: boolean;
  sourceId: string;
}

export interface ContentIdSectionTestProps {
  contentId: string;
}

export interface ExternalSourceSectionTestProps {
  externalSourceUrl: string | null;
  editable: boolean;
  contentId: string;
  lastCheckedAt?: string | null;
  needsExternalReview?: boolean;
}

export interface DomainSectionTestProps {
  domain: string | null;
}

// Test tag helpers
export interface TestTag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string | null;
  type_name?: string | null;
  display_order?: number;
}

// Convert simple test tag to Tag type
export function toTag(testTag: TestTag): Tag {
  return {
    id: testTag.id,
    name: testTag.name,
    content_id: testTag.content_id,
    type_id: testTag.type_id || null,
    type_name: testTag.type_name || null,
    display_order: testTag.display_order || 0
  };
}
