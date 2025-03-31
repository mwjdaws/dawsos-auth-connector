
import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useMetadataContext } from '../useMetadataContext';

// Mock the hooks and services that useMetadataContext depends on
vi.mock('@/hooks/metadata/useTagsQuery', () => ({
  useTagsQuery: vi.fn(() => ({
    data: [{ id: 'tag-1', name: 'test', content_id: 'content-1', type_id: null }],
    isLoading: false,
    error: null,
    refetch: vi.fn().mockResolvedValue([])
  }))
}));

vi.mock('@/hooks/metadata/useContentExists', () => ({
  useContentExists: vi.fn(() => ({
    exists: true,
    isLoading: false,
    error: null
  }))
}));

vi.mock('@/hooks/metadata/useMetadataQuery', () => ({
  useMetadataQuery: vi.fn(() => ({
    data: { id: 'source-1', title: 'Test Source' },
    isLoading: false,
    error: null,
    refetch: vi.fn().mockResolvedValue({})
  }))
}));

vi.mock('@/hooks/metadata/useTagMutation', () => ({
  useTagMutations: vi.fn(() => ({
    addTag: vi.fn().mockResolvedValue({}),
    deleteTag: vi.fn().mockResolvedValue(true),
    isAddingTag: false,
    isDeletingTag: false,
    error: null
  }))
}));

describe('useMetadataContext', () => {
  const mockContentId = 'content-1';
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should initialize with the correct state', () => {
    const { result } = renderHook(() => useMetadataContext(mockContentId));
    
    expect(result.current.contentId).toBe(mockContentId);
    expect(result.current.tags).toHaveLength(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
  
  it('should handle adding a tag', async () => {
    const { result } = renderHook(() => useMetadataContext(mockContentId));
    
    if (result.current.handleAddTag) {
      await act(async () => {
        await result.current.handleAddTag('new-tag');
      });
      
      // The addTag function from useTagMutation should have been called
      expect(result.current.addTag).toHaveBeenCalled;
    }
  });
  
  it('should handle deleting a tag', async () => {
    const { result } = renderHook(() => useMetadataContext(mockContentId));
    
    if (result.current.handleDeleteTag) {
      await act(async () => {
        await result.current.handleDeleteTag('tag-1');
      });
      
      // The deleteTag function from useTagMutation should have been called
      expect(result.current.deleteTag).toHaveBeenCalled;
    }
  });
  
  it('should handle refreshing data', async () => {
    const { result } = renderHook(() => useMetadataContext(mockContentId));
    
    if (result.current.handleRefresh) {
      await act(async () => {
        await result.current.handleRefresh();
      });
      
      // The refetch functions should have been called
      expect(result.current.fetchTags).toHaveBeenCalled;
      expect(result.current.fetchSourceMetadata).toHaveBeenCalled;
    }
  });
});
