
/**
 * Metadata Management Hooks
 * 
 * This module provides hooks for working with metadata in the application.
 */

// Tag related hooks
export { useTagReordering } from './useTagReordering';
export { useInlineMetadataEdit } from './useInlineMetadataEdit';
export { useTagsQuery } from './useTagsQuery';
export { useTagMutation, useAddTagMutation, useDeleteTagMutation, useTagMutations } from './useTagMutation';
export { useMetadataQuery } from './useMetadataQuery';
export { useContentExists } from './useContentExists';
export { useOntologyTermsQuery } from './useOntologyTermsQuery';

// Add types if needed
export type { Tag } from '@/components/MetadataPanel/hooks/tag-operations/types';
