
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import MetadataPanel from '../MetadataPanel';
import { useMetadataPanel } from '../hooks/useMetadataPanel';

// Mock the hooks
vi.mock('../hooks/useMetadataPanel', () => ({
  useMetadataPanel: vi.fn()
}));

// Mock the sections
vi.mock('../sections', () => ({
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

describe('MetadataPanel', () => {
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

  test('renders loading state when isLoading is true', () => {
    (useMetadataPanel as any).mockImplementation(() => ({
      ...defaultMockImplementation(),
      isLoading: true
    }));
    
    render(<MetadataPanel contentId="content-123" />);
    
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
  });

  test('renders error state when error is present', () => {
    const errorMessage = 'Failed to load metadata';
    (useMetadataPanel as any).mockImplementation(() => ({
      ...defaultMockImplementation(),
      error: errorMessage,
      isLoading: false
    }));
    
    render(<MetadataPanel contentId="content-123" />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('toggles collapsed state when collapse button is clicked', async () => {
    const setIsCollapsedMock = vi.fn();
    (useMetadataPanel as any).mockImplementation(() => ({
      ...defaultMockImplementation(),
      setIsCollapsed: setIsCollapsedMock
    }));
    
    render(<MetadataPanel contentId="content-123" isCollapsible={true} />);
    
    const collapseButton = screen.getByTestId('collapse-button');
    fireEvent.click(collapseButton);
    
    expect(setIsCollapsedMock).toHaveBeenCalledTimes(1);
  });

  test('calls handleRefresh when refresh button is clicked', () => {
    const handleRefreshMock = vi.fn();
    (useMetadataPanel as any).mockImplementation(() => ({
      ...defaultMockImplementation(),
      handleRefresh: handleRefreshMock
    }));
    
    render(<MetadataPanel contentId="content-123" />);
    
    const refreshButton = screen.getByTestId('refresh-button');
    fireEvent.click(refreshButton);
    
    expect(handleRefreshMock).toHaveBeenCalledTimes(1);
  });

  test('does not render OntologyTermsSection when showOntologyTerms is false', () => {
    render(<MetadataPanel contentId="content-123" showOntologyTerms={false} />);
    
    expect(screen.queryByTestId('ontology-terms-section')).not.toBeInTheDocument();
  });

  test('renders DomainSection when showDomain is true', () => {
    render(
      <MetadataPanel 
        contentId="content-123"
        showDomain={true}
        domain="Engineering"
      />
    );
    
    expect(screen.getByTestId('domain-section')).toBeInTheDocument();
    expect(screen.getByTestId('domain-section')).toHaveTextContent('Engineering');
  });

  test('does not render DomainSection when showDomain is false', () => {
    render(<MetadataPanel contentId="content-123" showDomain={false} />);
    
    expect(screen.queryByTestId('domain-section')).not.toBeInTheDocument();
  });

  test('allows adding tags when editable', async () => {
    const setNewTagMock = vi.fn();
    const handleAddTagMock = vi.fn();
    (useMetadataPanel as any).mockImplementation(() => ({
      ...defaultMockImplementation(),
      setNewTag: setNewTagMock,
      handleAddTag: handleAddTagMock
    }));
    
    render(<MetadataPanel contentId="content-123" editable={true} />);
    
    const tagInput = screen.getByTestId('new-tag-input');
    const addButton = screen.getByTestId('add-tag-button');
    
    await userEvent.type(tagInput, 'New Tag');
    expect(setNewTagMock).toHaveBeenCalled();
    
    fireEvent.click(addButton);
    expect(handleAddTagMock).toHaveBeenCalledTimes(1);
  });

  test('allows deleting tags when editable', () => {
    const handleDeleteTagMock = vi.fn();
    (useMetadataPanel as any).mockImplementation(() => ({
      ...defaultMockImplementation(),
      handleDeleteTag: handleDeleteTagMock
    }));
    
    render(<MetadataPanel contentId="content-123" editable={true} />);
    
    const deleteButton = screen.getByTestId('delete-tag-1');
    fireEvent.click(deleteButton);
    
    expect(handleDeleteTagMock).toHaveBeenCalledWith('1');
  });

  test('shows border styling when content needs external review', () => {
    (useMetadataPanel as any).mockImplementation(() => ({
      ...defaultMockImplementation(),
      needsExternalReview: true
    }));
    
    const { container } = render(<MetadataPanel contentId="content-123" />);
    
    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement.className).toContain('border-yellow-400');
  });

  test('applies custom className when provided', () => {
    const { container } = render(
      <MetadataPanel contentId="content-123" className="custom-class" />
    );
    
    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement.className).toContain('custom-class');
  });

  test('renders children when provided', () => {
    render(
      <MetadataPanel contentId="content-123">
        <div data-testid="custom-child">Custom Content</div>
      </MetadataPanel>
    );
    
    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
  });

  test('respects the editable prop value', () => {
    (useMetadataPanel as any).mockImplementation(() => ({
      ...defaultMockImplementation(),
      user: { id: 'user-1' }
    }));
    
    render(<MetadataPanel contentId="content-123" editable={false} />);
    
    // Should not be editable even though a user is present
    expect(screen.queryByTestId('new-tag-input')).not.toBeInTheDocument();
    expect(screen.queryByTestId('add-tag-button')).not.toBeInTheDocument();
  });
});
