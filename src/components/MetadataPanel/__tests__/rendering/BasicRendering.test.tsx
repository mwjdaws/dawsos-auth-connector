
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import MetadataPanel from '../../MetadataPanel';
import { useMetadataPanel } from '../../hooks/useMetadataPanel';

// Mock the hooks
vi.mock('../../hooks/useMetadataPanel', () => ({
  useMetadataPanel: vi.fn()
}));

// Mock the sections
vi.mock('../../sections', () => ({
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
        {tags.map(tag => (
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
}));

describe('MetadataPanel Basic Rendering', () => {
  // Default mock implementation
  const defaultMockImplementation = () => ({
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

  beforeEach(() => {
    vi.clearAllMocks();
    (useMetadataPanel as any).mockImplementation(defaultMockImplementation);
  });

  test('renders the panel with content ID', () => {
    render(<MetadataPanel contentId="content-123" />);
    
    expect(screen.getByTestId('content-id-section')).toHaveTextContent('content-123');
    expect(screen.getByTestId('tags-section')).toBeInTheDocument();
    expect(screen.getByTestId('external-source-section')).toBeInTheDocument();
  });

  test('shows an error message when no content ID is provided', () => {
    render(<MetadataPanel contentId="" />);
    
    expect(screen.getByText('No content ID provided. Metadata cannot be loaded.')).toBeInTheDocument();
  });

  test('renders children when provided', () => {
    render(
      <MetadataPanel contentId="content-123">
        <div data-testid="custom-child">Custom Content</div>
      </MetadataPanel>
    );
    
    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
  });
});
