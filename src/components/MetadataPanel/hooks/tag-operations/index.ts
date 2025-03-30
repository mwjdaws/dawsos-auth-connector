
// Re-export all tag operation related types and hooks
export * from './types';
export { useTagState } from './useTagState';
export { useTagFetch } from './useTagFetch';
export { useTagMutations } from './useTagMutations';
export { useTagOperations } from './useTagOperations';

// If there's ambiguity with UseTagMutationsResult, use a named export
import type { 
  UseTagMutationsResult as UseTagMutationsResultOriginal 
} from './types';

// Re-export with a clarified name
export type { UseTagMutationsResultOriginal as UseTagMutationsResult };
