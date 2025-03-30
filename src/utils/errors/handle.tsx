
// This file is deprecated - import from handle.ts instead
import { handleError as originalHandleError } from './handle';

export { handleError } from './handle';

// This ensures any imports from this file will continue to work
// while we transition to the new module structure
