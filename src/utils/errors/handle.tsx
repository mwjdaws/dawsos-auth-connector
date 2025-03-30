
// This file is deprecated - import from handle.ts instead
// We're maintaining this file temporarily for backward compatibility
import { handleError as originalHandleError } from './handle';
export { handleError } from './handle';

// This ensures any imports from this file will continue to work
// while we transition to the new module structure
