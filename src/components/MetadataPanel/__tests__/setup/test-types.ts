
/**
 * Type definitions for test files
 * 
 * This module provides TypeScript types and interfaces used across test files
 * to ensure consistent typing and reduce duplication.
 */

import { Tag, OntologyTerm } from '@/types';
import { Mock } from 'vitest';

/**
 * Test version of Tag that makes type_id optional to simplify test setup
 */
export interface TestTag {
  id: string;
  name: string;
  content_id: string;
  type_id: string;
  type_name?: string | null;
}

/**
 * Helper function to convert TestTag to Tag
 */
export function toTag(testTag: TestTag): Tag {
  return {
    id: testTag.id,
    name: testTag.name,
    content_id: testTag.content_id,
    type_id: testTag.type_id || '',
    type_name: testTag.type_name
  };
}

/**
 * Test version of OntologyTerm to simplify test setup
 */
export interface TestOntologyTerm {
  id: string;
  term: string;
  description: string;
  domain?: string;
}

/**
 * Test callbacks for component testing
 */
export interface TestCallbacks {
  handleRefresh: Mock;
  setIsCollapsed: Mock;
  onAddTag: Mock;
  onDeleteTag: Mock;
  setNewTag: Mock;
  onMetadataChange: Mock;
}

/**
 * Test mock data structure
 */
export interface TestMockData {
  contentId: string;
  tags: Tag[];
  ontologyTerms: OntologyTerm[];
  externalSourceUrl: string | null;
  domain: string | null;
  isCollapsed: boolean;
  editable: boolean;
  newTag: string;
}

/**
 * Create empty test mock data
 */
export function createEmptyTestData(): TestMockData {
  return {
    contentId: '123',
    tags: [],
    ontologyTerms: [],
    externalSourceUrl: null,
    domain: null,
    isCollapsed: false,
    editable: false,
    newTag: ''
  };
}

/**
 * Create mock test callbacks
 */
export function createTestCallbacks(): TestCallbacks {
  return {
    handleRefresh: vi.fn(),
    setIsCollapsed: vi.fn(),
    onAddTag: vi.fn(),
    onDeleteTag: vi.fn(),
    setNewTag: vi.fn(),
    onMetadataChange: vi.fn()
  };
}
