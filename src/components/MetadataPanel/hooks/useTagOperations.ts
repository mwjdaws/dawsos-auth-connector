
/**
 * @deprecated Use the hook from './tag-operations' instead.
 * This re-export exists for backward compatibility and will be removed in a future version.
 */

// Import and re-export the implementation
import { useTagOperations as useTagOperationsImpl } from './tag-operations/useTagOperations';
export { useTagOperations } from './tag-operations/useTagOperations';

// For backward compatibility, preserve the original export signature
export default useTagOperationsImpl;

// Re-export the Tag type for convenience
export type { Tag } from './tag-operations/types';
