
import { vi } from 'vitest';
import React from 'react';

/**
 * Default mock implementation for useMetadataPanel hook
 */
export const createDefaultMetadataPanelMock = () => ({
  tags: [{ id: '1', name: 'React', content_id: 'content-123' }],
  isLoading: false,
  error: null,
  isPending: false,
  newTag: '',
  setNewTag: vi.fn(),
  user: { id: 'user-1' },
  externalSourceUrl: 'https://example.com',
  needsExternalReview: false,
  lastCheckedAt: '2023-01-01T00:00:00Z',
  isCollapsed: false,
  setIsCollapsed: vi.fn(),
  handleRefresh: vi.fn(),
  handleAddTag: vi.fn(),
  handleDeleteTag: vi.fn()
});

/**
 * Mocks for individual section components
 */
export const mockSections = {
  HeaderSection: vi.fn().mockImplementation(({ handleRefresh, setIsCollapsed, isCollapsed }) => ({
    type: 'header-section',
    props: { handleRefresh, setIsCollapsed, isCollapsed }
  })),
  
  ExternalSourceSection: vi.fn().mockImplementation(({ externalSourceUrl }) => ({
    type: 'external-source-section',
    props: { externalSourceUrl }
  })),
  
  TagsSection: vi.fn().mockImplementation(({ tags, editable, newTag, setNewTag, onAddTag, onDeleteTag }) => ({
    type: 'tags-section',
    props: { tags, editable, newTag, setNewTag, onAddTag, onDeleteTag }
  })),
  
  OntologyTermsSection: vi.fn().mockImplementation(({ sourceId, editable }) => ({
    type: 'ontology-terms-section',
    props: { sourceId, editable }
  })),
  
  ContentIdSection: vi.fn().mockImplementation(({ contentId }) => ({
    type: 'content-id-section',
    props: { contentId }
  })),
  
  LoadingState: vi.fn().mockImplementation(() => ({
    type: 'loading-state'
  })),
  
  DomainSection: vi.fn().mockImplementation(({ domain }) => ({
    type: 'domain-section',
    props: { domain }
  }))
};
