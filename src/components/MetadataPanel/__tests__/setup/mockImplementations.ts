
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
  HeaderSection: ({ handleRefresh, setIsCollapsed, isCollapsed }) => (
    <div data-testid="header-section">
      <button data-testid="refresh-button" onClick={handleRefresh}>Refresh</button>
      <button 
        data-testid="collapse-button" 
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? 'Expand' : 'Collapse'}
      </button>
    </div>
  ),
  ExternalSourceSection: ({ externalSourceUrl }) => (
    <div data-testid="external-source-section">
      {externalSourceUrl && <a href={externalSourceUrl}>{externalSourceUrl}</a>}
    </div>
  ),
  TagsSection: ({ tags, editable, newTag, setNewTag, onAddTag, onDeleteTag }) => (
    <div data-testid="tags-section">
      <ul>
        {tags?.map(tag => (
          <li key={tag.id} data-testid={`tag-${tag.id}`}>
            {tag.name}
            {editable && (
              <button 
                data-testid={`delete-tag-${tag.id}`}
                onClick={() => onDeleteTag(tag.id)}
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
      {editable && (
        <div>
          <input 
            data-testid="new-tag-input"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
          />
          <button data-testid="add-tag-button" onClick={onAddTag}>Add Tag</button>
        </div>
      )}
    </div>
  ),
  OntologyTermsSection: ({ sourceId, editable }) => (
    <div data-testid="ontology-terms-section" data-source-id={sourceId} data-editable={editable}>
      Ontology Terms
    </div>
  ),
  ContentIdSection: ({ contentId }) => (
    <div data-testid="content-id-section">Content ID: {contentId}</div>
  ),
  LoadingState: () => <div data-testid="loading-state">Loading...</div>,
  DomainSection: ({ domain }) => (
    <div data-testid="domain-section">
      {domain || 'No domain'}
    </div>
  )
};
