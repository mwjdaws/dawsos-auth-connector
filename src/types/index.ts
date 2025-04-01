
/**
 * Central type definitions for the application
 * 
 * This file re-exports all type definitions from their respective modules
 * to provide a clean interface for importing types.
 */

// Re-export tag types
export type { Tag, TagData, TagDisplay, TagGroup, TagPosition } from './tag';
export type { OntologyTerm, OntologyDomain, RelatedTerm } from './ontology';
export type { ExternalSourceMetadata } from './metadata';
export type { KnowledgeSource, ContentType } from './content';
export type { User, UserProfile, UserSettings } from './user';
export type { ValidationResult } from './validation';
export type { ApiResponse, ApiError, RequestOptions } from './api';
export type { SourceMetadata } from './sourceMetadata';

// Re-export utility functions
export { 
  // Tag utilities
  mapApiTagToTag,
  mapApiTagsToTags,
  ensureNonNullableTag,
  filterDuplicateTags,
  convertTagPositionsToTags
} from './tag';

// Re-export constants
export { ContentStatus } from './content';
export { ErrorCode } from './errors';
export { UserRole } from './user';
