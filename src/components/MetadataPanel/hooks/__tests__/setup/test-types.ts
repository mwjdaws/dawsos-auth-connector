
import { Tag } from '@/types/tag';
import { OntologyTerm } from '@/types/ontology';

/**
 * Creates a mock tag for testing purposes
 */
export function createMockTag(id: string, name: string, contentId: string): Tag {
  return {
    id,
    name,
    content_id: contentId,
    type_id: null,
    display_order: 0,
    type_name: '' // Add the type_name property
  };
}

/**
 * Creates a mock OntologyTerm for testing
 */
export function createMockOntologyTerm(id: string, term: string): OntologyTerm {
  return {
    id,
    term,
    description: 'Test description',
    domain: 'Test Domain', // Add the required domain property
    review_required: false
  };
}

/**
 * Creates an array of mock tags for testing
 */
export function createMockTags(contentId: string, count = 3): Tag[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `tag-${i + 1}`,
    name: `Mock Tag ${i + 1}`,
    content_id: contentId,
    type_id: null,
    display_order: i,
    type_name: '' // Add the type_name property
  }));
}

/**
 * Creates an array of mock ontology terms for testing
 */
export function createMockOntologyTerms(count = 3): OntologyTerm[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `term-${i + 1}`,
    term: `Mock Term ${i + 1}`,
    description: `Description for term ${i + 1}`,
    domain: `Domain ${i + 1}`, // Add the required domain property
    review_required: false
  }));
}

/**
 * Basic testing tag
 */
export const basicTag: Tag = {
  id: 'test-tag-1',
  name: 'Test Tag',
  content_id: 'test-content-1',
  type_id: null,
  display_order: 0,
  type_name: '' // Add the type_name property
};

/**
 * Tag with type
 */
export const typedTag: Tag = {
  id: 'test-tag-2',
  name: 'Typed Tag',
  content_id: 'test-content-1',
  type_id: 'tag-type-1',
  display_order: 1,
  type_name: 'Category'
};
