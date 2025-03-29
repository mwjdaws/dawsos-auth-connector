
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({ data: null, error: null })),
          limit: vi.fn(() => ({ data: [], error: null })),
          order: vi.fn(() => ({ data: [], error: null })),
          range: vi.fn(() => ({ data: [], error: null })),
          in: vi.fn(() => ({ data: [], error: null })),
          not: vi.fn(() => ({ data: [], error: null })),
          is: vi.fn(() => ({ data: [], error: null })),
          maybeSingle: vi.fn(() => ({ data: null, error: null })),
        })),
        ilike: vi.fn(() => ({
          eq: vi.fn(() => ({ data: null, error: null })),
          maybeSingle: vi.fn(() => ({ data: null, error: null })),
        })),
        single: vi.fn(() => ({ data: null, error: null })),
        gte: vi.fn(() => ({ data: [], error: null })),
        lte: vi.fn(() => ({ data: [], error: null })),
        like: vi.fn(() => ({ data: [], error: null })),
        filter: vi.fn(() => ({ data: [], error: null })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({ data: null, error: null })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({ data: null, error: null })),
        filter: vi.fn(() => ({ data: null, error: null })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({ data: null, error: null })),
        filter: vi.fn(() => ({ data: null, error: null })),
      })),
    })),
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signIn: vi.fn(() => Promise.resolve({ data: null, error: null })),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(() => ({ data: null, error: null })),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: '' } })),
        list: vi.fn(() => ({ data: [], error: null })),
        remove: vi.fn(() => ({ data: null, error: null })),
      })),
    },
    functions: {
      invoke: vi.fn(() => Promise.resolve({ data: null, error: null })),
    },
    channel: vi.fn(() => ({
      on: vi.fn(() => ({ on: vi.fn(() => ({ subscribe: vi.fn() })) })),
      subscribe: vi.fn(() => {}),
    })),
    removeChannel: vi.fn(),
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock Intersection Observer
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
