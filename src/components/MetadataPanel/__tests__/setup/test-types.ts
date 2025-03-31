
import { Tag } from "@/types/tag";
import { OntologyTerm } from "../../types";

// Basic tag object for testing
export const basicTag: Tag = {
  id: "test-tag-123",
  name: "test tag",
  content_id: "test-content-123",
  type_id: null,
  display_order: 0
};

// Tag with type for testing
export const typedTag: Tag = {
  id: "test-tag-456",
  name: "test category tag",
  content_id: "test-content-123",
  type_id: "category",
  type_name: "Category",
  display_order: 1
};

// Basic ontology term for testing
export const basicTerm: OntologyTerm = {
  id: "test-term-123",
  term: "Example Term",
  description: "This is a description of the example term",
  review_required: false
};

// Mock metadata context values for testing
export const mockMetadataContext = {
  contentId: "test-content-123",
  validationResult: { isValid: true, message: null },
  isEditable: true,
  isLoading: false,
  error: null,
  tags: [basicTag, typedTag],
  ontologyTerms: [basicTerm],
  refreshMetadata: jest.fn(),
  handleRefresh: jest.fn().mockResolvedValue(undefined),
  fetchSourceMetadata: jest.fn().mockResolvedValue(undefined),
  fetchTags: jest.fn().mockResolvedValue([basicTag, typedTag]),
  addTag: jest.fn(),
  removeTag: jest.fn(),
  refreshTags: jest.fn().mockResolvedValue(undefined),
  handleAddTag: jest.fn().mockResolvedValue(undefined),
  handleDeleteTag: jest.fn().mockResolvedValue(undefined),
  deleteTag: jest.fn().mockResolvedValue(true)
};
