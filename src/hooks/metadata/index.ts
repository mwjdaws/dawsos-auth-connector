
// Core metadata hooks
export * from './useMetadataBase';
export * from './useFetchMetadata';
export * from './useTagOperations';
export * from './useOntologyTermOperations';
export * from './useExternalSourceOperations';
export * from './useMetadataOperations';

// Re-export from existing hooks
export { useTagsQuery } from './useTagsQuery';
export { useContentExists } from './useContentExists';
export { useMetadataQuery } from './useMetadataQuery';
export { useTagMutation, useTagMutations } from './useTagMutation';
export { useTagReordering } from './useTagReordering';
export { useSourceMetadataMutation } from './useSourceMetadataMutation';
export { useOntologyTermMutations } from './useOntologyTermMutation';

// Export types
export type { MetadataState, ExternalSourceMetadata } from './useMetadataBase';
export type { Tag } from '@/types/tag';
export type { OntologyTerm } from '@/components/MetadataPanel/types';

// Bridge for backward compatibility
export { useTagMutations as useAddTagMutation } from './useTagMutation';
