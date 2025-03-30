
// Import testing utilities
import { renderHook } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { useMetadataPanel } from '../useMetadataPanel';
import { MetadataPanelProps } from '../../types';

// Mock the hooks that useMetadataPanel depends on
vi.mock('../useSourceMetadata', () => ({
  useSourceMetadata: vi.fn(() => ({
    externalSourceUrl: 'https://example.com',
    needsExternalReview: false,
    lastCheckedAt: '2023-01-01',
    isLoading: false,
    error: null,
    data: { title: 'Test Document' },
    fetchSourceMetadata: vi.fn(),
    updateSourceMetadataState: vi.fn(),
    setExternalSourceUrl: vi.fn(),
    setNeedsExternalReview: vi.fn(),
    setLastCheckedAt: vi.fn()
  }))
}));

vi.mock('../tag-operations/useTagOperations', () => ({
  useTagOperations: vi.fn(() => ({
    tags: [{ id: '1', name: 'tag1' }],
    isLoading: false,
    error: null,
    newTag: '',
    setNewTag: vi.fn(),
    handleAddTag: vi.fn(),
    handleDeleteTag: vi.fn(),
    handleUpdateTagOrder: vi.fn(),
    handleRefresh: vi.fn(),
    isPending: false
  }))
}));

vi.mock('../usePanelState', () => ({
  usePanelState: vi.fn(() => ({
    isLoading: false,
    error: '',
    isPending: false,
    startTransition: vi.fn(),
    isCollapsed: false,
    setIsCollapsed: vi.fn(),
    validationResult: { isValid: true, contentExists: true },
    isValidContent: true,
    contentValidationResult: 'valid',
    contentExists: true,
    toggleCollapsed: vi.fn(),
    isMounted: { current: true },
    validateContentId: vi.fn(() => true),
    startLoading: vi.fn(),
    finishLoading: vi.fn()
  }))
}));

describe('useMetadataPanel', () => {
  const mockProps: MetadataPanelProps = {
    contentId: '123-456',
    onMetadataChange: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should return source metadata properties', () => {
    const { result } = renderHook(() => useMetadataPanel(mockProps));
    
    expect(result.current.externalSourceUrl).toBeDefined();
    expect(result.current.needsExternalReview).toBeDefined();
    expect(result.current.lastCheckedAt).toBeDefined();
  });

  test('should return tag operations properties', () => {
    const { result } = renderHook(() => useMetadataPanel(mockProps));
    
    expect(result.current.tags).toEqual([{ id: '1', name: 'tag1' }]);
    expect(result.current.newTag).toBeDefined();
    expect(result.current.setNewTag).toBeDefined();
    expect(result.current.handleAddTag).toBeDefined();
    expect(result.current.handleDeleteTag).toBeDefined();
    expect(result.current.handleUpdateTagOrder).toBeDefined();
  });

  test('should return panel state properties', () => {
    const { result } = renderHook(() => useMetadataPanel(mockProps));
    
    expect(result.current.isLoading).toBeDefined();
    expect(result.current.error).toBeDefined();
    expect(result.current.isPending).toBeDefined();
    expect(result.current.isCollapsed).toBeDefined();
    expect(result.current.setIsCollapsed).toBeDefined();
  });

  test('should call onMetadataChange when data changes', () => {
    renderHook(() => useMetadataPanel(mockProps));
    expect(mockProps.onMetadataChange).toHaveBeenCalled();
  });

  test('should not call onMetadataChange if not provided', () => {
    const propsWithoutChange: MetadataPanelProps = {
      contentId: '123-456'
    };
    
    renderHook(() => useMetadataPanel(propsWithoutChange));
    // No assertion needed, test would fail if it tried to call the undefined function
  });
});
