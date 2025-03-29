
import { vi } from "vitest";

// This file provides mock implementations for Supabase client
// to use in tests and prevent type errors in development

export const createSupabaseMock = () => ({
  from: vi.fn((table) => ({
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
});

// Export the mock
export const supabaseMock = createSupabaseMock();
