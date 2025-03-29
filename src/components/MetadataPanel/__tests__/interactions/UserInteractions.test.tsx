
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  ExternalSourceSection: () => <div data-testid="external-source-section" />,
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
  OntologyTermsSection: () => <div data-testid="ontology-terms-section" />,
  ContentIdSection: () => <div data-testid="content-id-section" />,
  LoadingState: () => <div data-testid="loading-state">Loading...</div>,
  DomainSection: () => <div data-testid="domain-section" />
}));

describe('MetadataPanel User Interactions', () => {
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
});
