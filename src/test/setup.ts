
import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';

// Mock dependencies that might cause issues in tests
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: [],
          error: null
        })),
        is: vi.fn(() => ({
          data: [],
          error: null
        })),
        in: vi.fn(() => ({
          data: [],
          error: null
        })),
        single: vi.fn(() => ({
          data: null,
          error: null
        })),
        maybeSingle: vi.fn(() => ({
          data: null,
          error: null
        })),
        limit: vi.fn(() => ({
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
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: null,
          error: null
        })),
        in: vi.fn(() => ({
          data: null,
          error: null
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: null,
          error: null
        }))
      }))
    })),
    functions: {
      invoke: vi.fn(() => Promise.resolve({ data: {}, error: null }))
    },
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        on: vi.fn(() => ({
          subscribe: vi.fn((callback) => callback('SUBSCRIBED'))
        }))
      })),
      subscribe: vi.fn((callback) => callback('SUBSCRIBED'))
    })),
    removeChannel: vi.fn()
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
