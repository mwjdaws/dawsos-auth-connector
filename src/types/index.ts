
// filepath: /dawsos-web-app/dawsos-web-app/src/types/index.ts
// Re-export the Tag types from the centralized location
export type { 
  Tag, 
  AugmentedTag, 
  TagPosition 
} from './tag';

export {
  mapApiTagToTag, 
  mapApiTagsToTags,
  ensureNonNullableTag,
  filterDuplicateTags,
  convertTagPositionsToTags,
  isValidTag
} from './tag';

export interface KnowledgeSource {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    externalSourceUrl?: string;
    externalSourceCheckedAt?: string;
    externalContentHash?: string;
    needsExternalReview?: boolean;
}

export interface Template {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
    data: T;
    error: string | null;
}

export type FetchStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
