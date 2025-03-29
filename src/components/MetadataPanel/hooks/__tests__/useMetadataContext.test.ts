
import { renderHook } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { useMetadataContext } from '../useMetadataContext';
import { useMetadataPanel } from '../useMetadataPanel';

// Mock the useMetadataPanel hook
vi.mock('../useMetadataPanel', () => ({
  useMetadataPanel: vi.fn()
}));

describe('useMetadataContext', () => {
  const mockMetadataPanelResult = {
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
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useMetadataPanel as any).mockReturnValue(mockMetadataPanelResult);
  });

  test('returns metadata context state with all required properties', () => {
    const contentId = 'content-123';
    const onMetadataChange = vi.fn();

    const { result } = renderHook(() => 
      useMetadataContext(contentId, onMetadataChange)
    );

    // Check that all expected properties are present
    expect(result.current).toHaveProperty('contentId', contentId);
    expect(result.current).toHaveProperty('tags', mockMetadataPanelResult.tags);
    expect(result.current).toHaveProperty('newTag', mockMetadataPanelResult.newTag);
    expect(result.current).toHaveProperty('setNewTag', mockMetadataPanelResult.setNewTag);
    expect(result.current).toHaveProperty('handleAddTag', mockMetadataPanelResult.handleAddTag);
    expect(result.current).toHaveProperty('handleDeleteTag', mockMetadataPanelResult.handleDeleteTag);
    expect(result.current).toHaveProperty('externalSourceUrl', mockMetadataPanelResult.externalSourceUrl);
    expect(result.current).toHaveProperty('needsExternalReview', mockMetadataPanelResult.needsExternalReview);
    expect(result.current).toHaveProperty('lastCheckedAt', mockMetadataPanelResult.lastCheckedAt);
    expect(result.current).toHaveProperty('isLoading', mockMetadataPanelResult.isLoading);
    expect(result.current).toHaveProperty('error', mockMetadataPanelResult.error);
    expect(result.current).toHaveProperty('isPending', mockMetadataPanelResult.isPending);
    expect(result.current).toHaveProperty('isCollapsed', mockMetadataPanelResult.isCollapsed);
    expect(result.current).toHaveProperty('setIsCollapsed', mockMetadataPanelResult.setIsCollapsed);
    expect(result.current).toHaveProperty('isEditable', true); // Based on the presence of user
    expect(result.current).toHaveProperty('handleRefresh', mockMetadataPanelResult.handleRefresh);
    expect(result.current).toHaveProperty('refreshMetadata');
  });

  test('calls useMetadataPanel with the correct parameters', () => {
    const contentId = 'content-123';
    const onMetadataChange = vi.fn();
    const isCollapsible = true;
    const initialCollapsed = true;

    renderHook(() => 
      useMetadataContext(contentId, onMetadataChange, isCollapsible, initialCollapsed)
    );

    expect(useMetadataPanel).toHaveBeenCalledWith(
      contentId, 
      onMetadataChange, 
      isCollapsible, 
      initialCollapsed
    );
  });

  test('refreshMetadata returns a promise and calls handleRefresh', async () => {
    // Mock setTimeout to resolve immediately
    vi.useFakeTimers();
    
    const contentId = 'content-123';
    const { result } = renderHook(() => useMetadataContext(contentId));
    
    const refreshPromise = result.current.refreshMetadata();
    
    // Verify handleRefresh was called
    expect(mockMetadataPanelResult.handleRefresh).toHaveBeenCalledTimes(1);
    
    // Fast-forward timers to resolve the promise
    vi.advanceTimersByTime(100);
    
    // Wait for the promise to resolve
    await refreshPromise;
    
    // Clean up
    vi.useRealTimers();
  });

  test('sets isEditable to true when user is present', () => {
    const contentId = 'content-123';
    const { result } = renderHook(() => useMetadataContext(contentId));
    
    expect(result.current.isEditable).toBe(true);
  });

  test('sets isEditable to false when user is not present', () => {
    const contentId = 'content-123';
    (useMetadataPanel as any).mockReturnValue({
      ...mockMetadataPanelResult,
      user: null
    });
    
    const { result } = renderHook(() => useMetadataContext(contentId));
    
    expect(result.current.isEditable).toBe(false);
  });

  test('memoizes the context state to prevent unnecessary re-renders', () => {
    const contentId = 'content-123';
    
    // First render
    const { result, rerender } = renderHook(() => useMetadataContext(contentId));
    const firstResult = result.current;
    
    // Re-render with the same props (should use memoized value)
    rerender();
    const secondResult = result.current;
    
    // The objects should be referentially equal
    expect(secondResult).toBe(firstResult);
  });
});
