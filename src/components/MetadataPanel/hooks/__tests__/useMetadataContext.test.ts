
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
    expect(result.current).toHaveProperty('domains');
    expect(result.current).toHaveProperty('externalSource', mockMetadataPanelResult.externalSourceUrl);
    expect(result.current).toHaveProperty('ontologyTerms');
    expect(result.current).toHaveProperty('loading', mockMetadataPanelResult.isLoading);
    expect(result.current).toHaveProperty('error', mockMetadataPanelResult.error);
    expect(result.current).toHaveProperty('setTags');
    expect(result.current).toHaveProperty('addTag', mockMetadataPanelResult.handleAddTag);
    expect(result.current).toHaveProperty('removeTag', mockMetadataPanelResult.handleDeleteTag);
    expect(result.current).toHaveProperty('refreshTags');
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

  test('refreshTags returns a promise and calls handleRefresh', async () => {
    // Mock setTimeout to resolve immediately
    vi.useFakeTimers();
    
    const contentId = 'content-123';
    const { result } = renderHook(() => useMetadataContext(contentId));
    
    const refreshPromise = result.current.refreshTags();
    
    // Verify handleRefresh was called
    expect(mockMetadataPanelResult.handleRefresh).toHaveBeenCalledTimes(1);
    
    // Fast-forward timers to resolve the promise
    vi.advanceTimersByTime(100);
    
    // Wait for the promise to resolve
    await refreshPromise;
    
    // Clean up
    vi.useRealTimers();
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
