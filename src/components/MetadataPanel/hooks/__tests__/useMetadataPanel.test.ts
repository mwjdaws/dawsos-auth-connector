
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useMetadataPanel } from '../useMetadataPanel';
import { useTagOperations } from '../useTagOperations';
import { useSourceMetadata } from '../useSourceMetadata';
import { usePanelState } from '../usePanelState';
import { useAuth } from '@/hooks/useAuth';

// Mock dependent hooks
vi.mock('../useTagOperations', () => ({
  useTagOperations: vi.fn()
}));

vi.mock('../useSourceMetadata', () => ({
  useSourceMetadata: vi.fn()
}));

vi.mock('../usePanelState', () => ({
  usePanelState: vi.fn()
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn()
}));

describe('useMetadataPanel', () => {
  // Mock implementations
  const mockUser = { id: 'user-1', email: 'user@example.com' };
  const mockTags = [{ id: '1', name: 'React', content_id: 'content-123' }];
  const mockNewTag = '';
  const mockSetNewTag = vi.fn();
  const mockHandleAddTag = vi.fn();
  const mockHandleDeleteTag = vi.fn();
  const mockFetchTags = vi.fn().mockResolvedValue(mockTags);
  const mockSetTags = vi.fn();
  
  const mockSourceMetadata = {
    externalSourceUrl: 'https://example.com',
    needsExternalReview: false,
    lastCheckedAt: '2023-01-01T00:00:00Z',
    fetchSourceMetadata: vi.fn().mockResolvedValue({
      external_source_url: 'https://example.com',
      needs_external_review: false,
      external_source_checked_at: '2023-01-01T00:00:00Z'
    }),
    updateSourceMetadataState: vi.fn()
  };
  
  const mockPanelState = {
    isLoading: false,
    error: null,
    isPending: false,
    startTransition: vi.fn((callback) => callback()),
    isCollapsed: false,
    setIsCollapsed: vi.fn(),
    toggleCollapsed: vi.fn(),
    isMounted: { current: true },
    validateContentId: vi.fn().mockReturnValue(true),
    startLoading: vi.fn(),
    finishLoading: vi.fn()
  };

  // Setup the mock implementations
  beforeEach(() => {
    vi.clearAllMocks();
    
    (useAuth as any).mockReturnValue({ user: mockUser });
    
    (useTagOperations as any).mockReturnValue({
      tags: mockTags,
      setTags: mockSetTags,
      newTag: mockNewTag,
      setNewTag: mockSetNewTag,
      fetchTags: mockFetchTags,
      handleAddTag: mockHandleAddTag,
      handleDeleteTag: mockHandleDeleteTag
    });
    
    (useSourceMetadata as any).mockReturnValue(mockSourceMetadata);
    
    (usePanelState as any).mockReturnValue(mockPanelState);
  });

  test('fetches metadata when contentId is provided', async () => {
    const contentId = 'content-123';
    const onMetadataChange = vi.fn();
    
    renderHook(() => useMetadataPanel(contentId, onMetadataChange));
    
    // Should validate the contentId
    expect(mockPanelState.validateContentId).toHaveBeenCalled();
    
    // Should start loading
    expect(mockPanelState.startLoading).toHaveBeenCalled();
    
    // Should fetch tags and source metadata
    expect(mockFetchTags).toHaveBeenCalled();
    expect(mockSourceMetadata.fetchSourceMetadata).toHaveBeenCalled();
    
    // Should update states
    await vi.runAllTimersAsync();
    expect(mockSetTags).toHaveBeenCalledWith(mockTags);
    expect(mockSourceMetadata.updateSourceMetadataState).toHaveBeenCalled();
    
    // Should finish loading
    expect(mockPanelState.finishLoading).toHaveBeenCalledWith(true);
  });

  test('handles refresh action correctly', async () => {
    const contentId = 'content-123';
    const { result } = renderHook(() => useMetadataPanel(contentId));
    
    // Reset mocks to check refresh action
    vi.clearAllMocks();
    
    // Call handleRefresh
    act(() => {
      result.current.handleRefresh();
    });
    
    // Should validate the contentId
    expect(mockPanelState.validateContentId).toHaveBeenCalled();
    
    // Should start loading
    expect(mockPanelState.startLoading).toHaveBeenCalled();
    
    // Should fetch tags and source metadata again
    expect(mockFetchTags).toHaveBeenCalled();
    expect(mockSourceMetadata.fetchSourceMetadata).toHaveBeenCalled();
  });

  test('handles fetch error correctly', async () => {
    const contentId = 'content-123';
    const error = new Error('Fetch error');
    
    // Mock a fetch error
    mockFetchTags.mockRejectedValueOnce(error);
    
    renderHook(() => useMetadataPanel(contentId));
    
    // Should start loading
    expect(mockPanelState.startLoading).toHaveBeenCalled();
    
    // Should try to fetch
    expect(mockFetchTags).toHaveBeenCalled();
    
    // Should handle error
    await vi.runAllTimersAsync();
    expect(mockPanelState.finishLoading).toHaveBeenCalledWith(false, error.message);
  });

  test('does not fetch if contentId is invalid', () => {
    const contentId = 'content-123';
    
    // Mock validateContentId to return false
    mockPanelState.validateContentId.mockReturnValueOnce(false);
    
    renderHook(() => useMetadataPanel(contentId));
    
    // Should validate the contentId
    expect(mockPanelState.validateContentId).toHaveBeenCalled();
    
    // Should not proceed with fetching
    expect(mockPanelState.startLoading).not.toHaveBeenCalled();
    expect(mockFetchTags).not.toHaveBeenCalled();
    expect(mockSourceMetadata.fetchSourceMetadata).not.toHaveBeenCalled();
  });

  test('returns all expected properties', () => {
    const contentId = 'content-123';
    const { result } = renderHook(() => useMetadataPanel(contentId));
    
    // Check that all expected properties are returned
    expect(result.current).toHaveProperty('tags', mockTags);
    expect(result.current).toHaveProperty('isLoading', false);
    expect(result.current).toHaveProperty('error', null);
    expect(result.current).toHaveProperty('isPending', false);
    expect(result.current).toHaveProperty('newTag', mockNewTag);
    expect(result.current).toHaveProperty('setNewTag', mockSetNewTag);
    expect(result.current).toHaveProperty('user', mockUser);
    expect(result.current).toHaveProperty('externalSourceUrl', 'https://example.com');
    expect(result.current).toHaveProperty('needsExternalReview', false);
    expect(result.current).toHaveProperty('lastCheckedAt', '2023-01-01T00:00:00Z');
    expect(result.current).toHaveProperty('isCollapsed', false);
    expect(result.current).toHaveProperty('setIsCollapsed', mockPanelState.setIsCollapsed);
    expect(result.current).toHaveProperty('handleRefresh');
    expect(result.current).toHaveProperty('handleAddTag', mockHandleAddTag);
    expect(result.current).toHaveProperty('handleDeleteTag', mockHandleDeleteTag);
  });
});
