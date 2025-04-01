
import { Tag } from "@/types/tag";
import { OntologyTerm } from "@/types/ontology";
import { SourceMetadata } from "@/types/sourceMetadata";

/**
 * Sample tag data for testing
 */
export const sampleTag: Tag = {
  id: "tag-1",
  name: "Test Tag",
  content_id: "content-123",
  type_id: null,
  display_order: 0,
  type_name: null // Added type_name property to fix type errors
};

/**
 * Sample ontology term for testing
 */
export const sampleOntologyTerm: OntologyTerm = {
  id: "term-1",
  term: "Test Term",
  description: "Test description",
  domain: "Test Domain"
};

/**
 * Sample source metadata for testing 
 */
export const sampleSourceMetadata: SourceMetadata = {
  id: "source-1",
  title: "Test Source",
  content: "Test content",
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
  user_id: null,
  created_by: null,
  template_id: null,
  external_source_url: "https://example.com",
  external_source_checked_at: "2023-01-01T00:00:00Z",
  external_content_hash: null,
  needs_external_review: false,
  published: false
};

/**
 * Sample tags array for testing
 */
export const sampleTags: Tag[] = [
  {
    id: "tag-1",
    name: "Tag 1",
    content_id: "content-123",
    type_id: null,
    display_order: 0,
    type_name: null // Added type_name property to fix type errors
  },
  {
    id: "tag-2",
    name: "Tag 2",
    content_id: "content-123",
    type_id: null,
    display_order: 1,
    type_name: null // Added type_name property to fix type errors
  }
];

/**
 * Sample new tag for testing
 */
export const newTag: Tag = {
  id: "new-tag",
  name: "New Tag",
  content_id: "content-123",
  type_id: null,
  display_order: 2,
  type_name: null // Added type_name property to fix type errors
};

/**
 * Sample ontology terms array for testing
 */
export const sampleOntologyTerms: OntologyTerm[] = [
  {
    id: "term-1",
    term: "Term 1",
    description: "Description 1",
    domain: "Domain 1"
  },
  {
    id: "term-2",
    term: "Term 2",
    description: "Description 2",
    domain: "Domain 2"
  }
];
