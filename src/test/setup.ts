
/**
 * Setup file for unit tests
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { expect } from 'vitest';
import { beforeAll, afterAll, vi, afterEach } from 'vitest';

// Extend the Element interface to support shadow root operations
// @ts-ignore - Extend global Element for testing
global.Element.prototype.scrollIntoView = vi.fn();

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock window.matchMedia for responsive design testing
global.matchMedia = vi.fn().mockImplementation((query) => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  };
});

// Create a mock IntersectionObserver for components that use it
global.IntersectionObserver = vi.fn().mockImplementation(function(callback) {
  this.callback = callback;
  
  this.observe = vi.fn();
  this.unobserve = vi.fn();
  this.disconnect = vi.fn();
  
  // Simulate an intersection
  this.trigger = (entries) => {
    callback(entries, this);
  };
});

// Mock window.URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();
global.structuredClone = vi.fn(obj => JSON.parse(JSON.stringify(obj)));
global.crypto.randomUUID = vi.fn(() => Math.random().toString(36).substring(2));

// Create any custom matchers
expect.extend({
  toBeValidUUID(received) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const pass = uuidRegex.test(received);
    return {
      pass,
      message: () => pass
        ? `Expected ${received} not to be a valid UUID`
        : `Expected ${received} to be a valid UUID`
    };
  },
});

// Additional test setup here
