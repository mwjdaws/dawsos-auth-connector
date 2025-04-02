
/**
 * Central export of all types used throughout the application
 */

// Core Data Models
export * from './content';
export * from './document';
export * from './knowledge-source';
export * from './source-metadata';
export * from './validation';
export * from './draft';
export * from './ontology';

// Tag System
export * from './tag';

// Re-export tag utility functions explicitly
export {
  Tag,
  TagPosition,
  TagGroup,
  TagData,
  TagDisplay,
  CreateTagData,
  DeleteTagData,
  mapApiTagToTag,
  mapApiTagsToTags,
  ensureNonNullableTag,
  convertTagPositionsToTags,
  sortTagsByDisplayOrder,
  filterDuplicateTags
} from './tag';

// Compatibility Types
export * from './compat';

// Graph Types
export * from './graph';

// API Types
export * from './api';

// Error Types
export * from './errors';

// Authentication Types
export * from './auth';

// Utility Types
export * from './utils';
