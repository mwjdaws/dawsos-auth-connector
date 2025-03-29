
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
  TagsSection: () => <div data-testid="tags-section" />,
  OntologyTermsSection: () => <div data-testid="ontology-terms-section" />,
  ContentIdSection: () => <div data-testid="content-id-section" />,
  LoadingState: () => <div data-testid="loading-state">Loading...</div>,
  DomainSection: () => <div data-testid="domain-section" />
}));

describe('MetadataPanel State Handling', () => {
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

  test('shows border styling when content needs external review', () => {
    (useMetadataPanel as any).mockImplementation(() => ({
      ...defaultMockImplementation(),
      needsExternalReview: true
    }));
    
    const { container } = render(<MetadataPanel contentId="content-123" />);
    
    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement.className).toContain('border-yellow-400');
  });
});
