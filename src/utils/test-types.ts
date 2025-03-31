
import { ValidationResult } from "./validation/types";

/**
 * Test utility types and mock data
 * 
 * This file provides common test data structures for use across test files.
 */

/**
 * Mock user for authentication testing
 */
export const mockUser = {
  id: "test-user-id",
  email: "test@example.com",
  user_metadata: {
    name: "Test User",
    avatar_url: "https://example.com/avatar.png"
  }
};

/**
 * Mock session for authentication testing
 */
export const mockSession = {
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
  expires_at: Date.now() + 3600,
  user: mockUser
};

/**
 * Mock content source for testing
 */
export const mockContentSource = {
  id: "test-source-id",
  title: "Test Document",
  content: "This is test content for a mock document",
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-02T00:00:00Z",
  published: false,
  user_id: "test-user-id",
  template_id: null,
  external_source_url: null
};

/**
 * Mock tag for testing
 */
export const mockTag = {
  id: "test-tag-id",
  name: "test-tag",
  content_id: "test-source-id",
  type_id: null,
  type_name: null,
  display_order: 0
};

/**
 * Mock ontology term for testing
 */
export const mockOntologyTerm = {
  id: "test-term-id",
  term: "Test Term",
  description: "This is a test ontology term",
  domain: "Test Domain",
  review_required: false
};

/**
 * Mock validation result (success)
 */
export const mockValidationSuccess: ValidationResult = {
  isValid: true,
  message: "Validation passed",
  errorMessage: ""
};

/**
 * Mock validation result (failure)
 */
export const mockValidationFailure: ValidationResult = {
  isValid: false,
  message: null,
  errorMessage: "Validation failed"
};
