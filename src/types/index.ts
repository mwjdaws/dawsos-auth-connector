
/**
 * Central export of all types used throughout the application
 */

// Core Data Models
export type { 
  DocumentMetadata, 
  DocumentContent, 
  Document,
  DocumentValidationResult
} from './document';

export type {
  KnowledgeSource,
  KnowledgeSourceMetadata
} from './knowledge-source';

export type {
  SourceMetadata,
  ExternalSourceMetadata
} from './source-metadata';

export type {
  Draft,
  DraftMetadata,
  DraftVersion
} from './draft';

export type {
  OntologyTerm,
  OntologyDomain
} from './ontology';

// Tag System
export * from './tag';

// Re-export tag utility functions explicitly
export type {
  Tag,
  TagPosition,
  TagGroup,
  TagData,
  TagDisplay,
  CreateTagData,
  DeleteTagData
} from './tag';

export {
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
export type {
  GraphNode,
  GraphLink,
  GraphData,
  RelationshipGraphOptions,
  GraphStats
} from './graph';

// API Types
export * from './api';

// Error Types
export * from './errors';

// Authentication Types
export type {
  User,
  UserProfile,
  AuthSession,
  AuthState
} from './auth';

export { UserRole } from './auth';

// Utility Types
export type {
  Nullable,
  Optional,
  NullableOptional,
  IdType,
  UUID,
  ISODateString,
  ApiResponse,
  PaginatedResponse,
  AsyncCallback,
  ErrorCallback,
  LoadingState,
  FetchStatus,
  SelectOption,
  ChangeEvent
} from './utils';
