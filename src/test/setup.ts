
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock dependencies that might cause issues in tests
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: [],
          error: null
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          data: [],
          error: null
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: null,
          error: null
        }))
      }))
    }))
  }
}));

// Mock console.error to clean up test output
const originalConsoleError = console.error;
console.error = (...args) => {
  // Filter out specific React-related errors that clutter test output
  if (
    typeof args[0] === 'string' && 
    (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
     args[0].includes('Warning: useLayoutEffect does nothing on the server'))
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Clean up after each test
afterEach(() => {
  vi.restoreAllMocks();
});
