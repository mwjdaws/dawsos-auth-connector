
import { vi } from 'vitest';
import { Tag, OntologyTerm } from '@/components/MetadataPanel/types';

// Mock data for testing
export const mockTags: Tag[] = [
  {
    id: 'tag-1',
    name: 'development',
    content_id: 'content-1',
    type_id: null
  },
  {
    id: 'tag-2',
    name: 'react',
    content_id: 'content-1',
    type_id: 'type-1',
    type_name: 'Technology' 
  }
];

export const mockOntologyTerms: OntologyTerm[] = [
  {
    id: 'term-1',
    term: 'JavaScript',
    description: 'A programming language',
    domain: 'Programming',
    review_required: false
  },
  {
    id: 'term-2',
    term: 'React',
    description: 'A JavaScript library for building user interfaces',
    domain: 'Programming',
    review_required: true
  }
];

// Mock functions
export const mockHandleAddTag = vi.fn();
export const mockHandleDeleteTag = vi.fn();
export const mockHandleRefresh = vi.fn();
export const mockSetNewTag = vi.fn();
export const mockSetIsCollapsed = vi.fn();
export const mockHandleMetadataChange = vi.fn();
