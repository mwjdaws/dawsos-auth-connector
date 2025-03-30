
// Export metadata-related hooks
export * from './useTagsQuery';
export * from './useContentExists';
export * from './useMetadataQuery';
export * from './useTagMutation';
export * from './useTagReordering';

// Bridge for backward compatibility
export { useAddTagMutation as useTagMutations } from './useTagMutation';
