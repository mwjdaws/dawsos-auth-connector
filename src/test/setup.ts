
/**
 * Test Setup
 * 
 * Configure the testing environment with necessary extensions and mocks
 */

import '@testing-library/jest-dom';
import { expect } from 'vitest';

// Extend jest matchers with testing-library's dom matchers
expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null && received !== undefined;
    return {
      pass,
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be in the document`,
    };
  },
});

// Mock browser APIs not available in test environment
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

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

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Set up missing browser environment variables
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(() => null),
      setItem: vi.fn(() => null),
      removeItem: vi.fn(() => null),
      clear: vi.fn(() => null),
    },
    writable: true,
  });
}

// Set up missing dom functions used by React components
if (typeof document !== 'undefined') {
  document.createRange = () => {
    const range = new Range();
    range.getBoundingClientRect = vi.fn();
    range.getClientRects = vi.fn(() => ({
      item: () => null,
      length: 0,
    }));
    return range;
  };
}
