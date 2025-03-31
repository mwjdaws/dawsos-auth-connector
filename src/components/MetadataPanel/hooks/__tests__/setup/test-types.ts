
import { ValidationResult } from '@/utils/validation/types';
import { Tag } from '@/types/tag';
import { OntologyTerm } from '../../types';

// Mock tag objects
export const basicTag: Tag = {
  id: "tag-1",
  name: "test-tag",
  content_id: "test-content-id"
};

export const typedTag: Tag = {
  id: "tag-2",
  name: "typed-tag",
  content_id: "test-content-id",
  type_id: "type-1",
  type_name: "Test Type"
};

// Mock ontology term
export const mockOntologyTerm: OntologyTerm = {
  id: "term-1",
  term: "Test Term",
  description: "This is a test term",
  domain: "Test Domain",
  relation_type: null
};

// Mock validation result
export const mockValidationResult: ValidationResult = {
  isValid: true,
  message: "Validation passed",
  errorMessage: null
};

// Mock metadata context for testing
export const mockMetadataContext = {
  contentId: "test-content-id",
  title: "Test Content",
  description: "Test description",
  contentType: "article",
  sourceUrl: "https://example.com",
  validationResult: mockValidationResult,
  isEditable: true,
  isLoading: false,
  error: null,
  tags: [basicTag, typedTag],
  ontologyTerms: [mockOntologyTerm],
  refreshMetadata: jest.fn(),
  handleRefresh: jest.fn(),
  fetchSourceMetadata: jest.fn(),
  fetchTags: jest.fn()
};
