
import { renderHook, act } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { useMetadataContext } from '../useMetadataContext';
import { useMetadataPanel } from '../useMetadataPanel';

// Mock the useMetadataPanel hook
vi.mock('../useMetadataPanel', () => ({
  useMetadataPanel: vi.fn()
}));

describe('useMetadataContext', () => {
  // Mock implementations
  const mockTags = [{ id: '1', name: 'React', content_id: 'content-123' }];
  const mockHandleAddTag = vi.fn();
  const mockHandleDeleteTag = vi.fn();
  const mockHandleRefresh = vi.fn();
  const mockSetNewTag = vi.fn();
  
  // Setup the mock implementation
  beforeEach(() => {
    vi.clearAllMocks();
    
    (useMetadataPanel as any).mockReturnValue({
      tags: mockTags,
      isLoading: false,
      error: null,
      isPending: false,
      newTag: '',
      setNewTag: mockSetNewTag,
      user: { id: 'user-1' },
      externalSourceUrl: 'https://example.com',
      needsExternalReview: false,
      lastCheckedAt: '2023-01-01T00:00:00Z',
      isCollapsed: false,
      setIsCollapsed: vi.fn(),
      handleRefresh: mockHandleRefresh,
      handleAddTag: mockHandleAddTag,
      handleDeleteTag: mockHandleDeleteTag
    });
  });

  test('returns metadata context state with all expected properties', () => {
    const contentId = 'content-123';
    const { result } = renderHook(() => useMetadataContext(contentId));
    
    // Check that all expected properties are returned
    expect(result.current).toHaveProperty('contentId', contentId);
    expect(result.current).toHaveProperty('tags', mockTags);
    expect(result.current).toHaveProperty('domains', []);
    expect(result.current).toHaveProperty('externalSource', 'https://example.com');
    expect(result.current).toHaveProperty('ontologyTerms', []);
    expect(result.current).toHaveProperty('loading', false);
    expect(result.current).toHaveProperty('error', null);
    expect(result.current).toHaveProperty('setTags');
    expect(result.current).toHaveProperty('addTag');
    expect(result.current).toHaveProperty('removeTag');
    expect(result.current).toHaveProperty('refreshTags');
  });

  test('addTag calls setNewTag and handleAddTag', () => {
    const contentId = 'content-123';
    const { result } = renderHook(() => useMetadataContext(contentId));
    
    // Call addTag
    act(() => {
      result.current.addTag('NewTag');
    });
    
    // Should call setNewTag with the tag name
    expect(mockSetNewTag).toHaveBeenCalledWith('NewTag');
    
    // Should call handleAddTag
    expect(mockHandleAddTag).toHaveBeenCalled();
  });

  test('removeTag calls handleDeleteTag', () => {
    const contentId = 'content-123';
    const { result } = renderHook(() => useMetadataContext(contentId));
    
    // Call removeTag
    act(() => {
      result.current.removeTag('1');
    });
    
    // Should call handleDeleteTag with the tag ID
    expect(mockHandleDeleteTag).toHaveBeenCalledWith('1');
  });

  test('refreshTags calls handleRefresh', async () => {
    const contentId = 'content-123';
    const { result } = renderHook(() => useMetadataContext(contentId));
    
    // Call refreshTags
    let promise;
    act(() => {
      promise = result.current.refreshTags();
    });
    
    // Should call handleRefresh
    expect(mockHandleRefresh).toHaveBeenCalled();
    
    // Should return a promise
    expect(promise).toBeInstanceOf(Promise);
    
    // Wait for the promise to resolve
    await promise;
  });
});
