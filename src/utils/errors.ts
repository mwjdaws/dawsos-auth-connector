
/**
 * Re-export all error handling functionality
 * This maintains backward compatibility while using a modular approach
 */
export * from './errors/types';
export * from './errors/categorize';
export * from './errors/handle';
export * from './errors/wrappers';
export * from './errors/deduplication';
export * from './errors/format';
export * from './errors/generateId';
export * from './errors/compatibility';

// For backward compatibility, re-export default
import { handleError } from './errors/handle';
export default handleError;
