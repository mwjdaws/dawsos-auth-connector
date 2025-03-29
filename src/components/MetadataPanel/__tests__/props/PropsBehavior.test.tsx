
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
  HeaderSection: () => <div data-testid="header-section" />,
  ExternalSourceSection: () => <div data-testid="external-source-section" />,
  TagsSection: ({ editable }) => (
    <div data-testid="tags-section">
      {editable && (
        <div>
          <input data-testid="new-tag-input" />
          <button data-testid="add-tag-button">Add Tag</button>
        </div>
      )}
    </div>
  ),
  OntologyTermsSection: () => <div data-testid="ontology-terms-section" />,
  ContentIdSection: () => <div data-testid="content-id-section" />,
  LoadingState: () => <div data-testid="loading-state">Loading...</div>,
  DomainSection: ({ domain }) => (
    <div data-testid="domain-section">
      {domain || 'No domain'}
    </div>
  )
}));

describe('MetadataPanel Props Behavior', () => {
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

  test('applies custom className when provided', () => {
    const { container } = render(
      <MetadataPanel contentId="content-123" className="custom-class" />
    );
    
    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement.className).toContain('custom-class');
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
