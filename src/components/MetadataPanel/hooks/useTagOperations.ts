
/**
 * @deprecated Use the hook from './tag-operations' instead.
 * This re-export exists for backward compatibility and will be removed in a future version.
 */

import { useTagOperations as useTagOperationsImpl } from './tag-operations/useTagOperations';
export { useTagOperations as default, useTagOperations } from './tag-operations/useTagOperations';
export type { Tag } from './tag-operations/types';

// For backward compatibility, re-export the hook with its original signature
export interface UseTagOperationsProps {
  contentId: string;
  user: any;
  onMetadataChange?: () => void;
}

// Re-export with the same interface for backward compatibility
export const useTagOperations = useTagOperationsImpl;
