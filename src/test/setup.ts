
import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Automatically run cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => {
  return {
    supabase: {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: {}, error: null }),
            maybeSingle: () => Promise.resolve({ data: {}, error: null })
          }),
          not: () => Promise.resolve({ data: [], error: null }),
          ilike: () => ({
            maybeSingle: () => Promise.resolve({ data: null, error: null })
          })
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: {}, error: null })
          })
        }),
        upsert: () => Promise.resolve({ error: null }),
        delete: () => Promise.resolve({ error: null })
      }),
      rpc: () => Promise.resolve({ data: [], error: null }),
      functions: {
        invoke: () => Promise.resolve({ data: {}, error: null })
      }
    }
  };
});
