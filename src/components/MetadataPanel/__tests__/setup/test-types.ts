
/**
 * Test type definitions
 */
import { Tag } from '@/types/tag';
import { OntologyTerm } from '@/types/ontology';

/**
 * Sample Tag data for tests
 */
export const mockTag: Tag = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Test Tag',
  content_id: '123e4567-e89b-12d3-a456-426614174001',
  type_id: '123e4567-e89b-12d3-a456-426614174002',
  display_order: 0,
  type_name: 'Test Type'
};

/**
 * Sample OntologyTerm data for tests
 */
export const mockOntologyTerm: OntologyTerm = {
  id: '123e4567-e89b-12d3-a456-426614174003',
  term: 'Test Term',
  description: 'A term used for testing',
  domain: 'Testing Domain',
  review_required: false
};

/**
 * Sample Tag collection for tests
 */
export const mockTags: Tag[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'React',
    content_id: '123e4567-e89b-12d3-a456-426614174001',
    type_id: '123e4567-e89b-12d3-a456-426614174002',
    display_order: 0,
    type_name: 'Technology'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174010',
    name: 'TypeScript',
    content_id: '123e4567-e89b-12d3-a456-426614174001',
    type_id: '123e4567-e89b-12d3-a456-426614174002',
    display_order: 1,
    type_name: 'Technology'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174020',
    name: 'Frontend',
    content_id: '123e4567-e89b-12d3-a456-426614174001',
    type_id: '123e4567-e89b-12d3-a456-426614174003',
    display_order: 2,
    type_name: 'Category'
  }
];

/**
 * Sample OntologyTerm collection for tests
 */
export const mockOntologyTerms: OntologyTerm[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174003',
    term: 'Component',
    description: 'A reusable UI element',
    domain: 'Web Development',
    review_required: false
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174004',
    term: 'State Management',
    description: 'Handling application state',
    domain: 'Web Development',
    review_required: false
  }
];

/**
 * Mock property data for HeaderSection tests
 */
export interface MockHeaderSectionProps {
  title: string;
  handleRefresh: () => void;
  setIsCollapsed: (isCollapsed: boolean) => void;
  isCollapsed: boolean;
  needsExternalReview: boolean;
}

/**
 * Mock data for MetadataPanel tests
 */
export interface MockMetadataPanelData {
  contentId: string;
  tags: Tag[];
  ontologyTerms: OntologyTerm[];
  externalSource: {
    url: string;
    lastCheckedAt: string;
    needsReview: boolean;
  } | null;
  isLoading: boolean;
  error: Error | null;
}
