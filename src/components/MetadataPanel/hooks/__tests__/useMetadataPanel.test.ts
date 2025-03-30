
// Import your testing utilities
import { renderHook } from '@testing-library/react';
import { useMetadataPanel } from '../useMetadataPanel';
import { MetadataPanelProps } from '../../types';

// Mock the hooks that useMetadataPanel depends on
jest.mock('../useSourceMetadata', () => ({
  useSourceMetadata: jest.fn(() => ({
    externalSourceUrl: 'https://example.com',
    needsExternalReview: false,
    lastCheckedAt: '2023-01-01',
    isLoading: false,
    error: null,
    data: { title: 'Test Document' },
    fetchSourceMetadata: jest.fn(),
    updateSourceMetadataState: jest.fn()
  }))
}));

jest.mock('../tag-operations/useTagOperations', () => ({
  useTagOperations: jest.fn(() => ({
    tags: [{ id: '1', name: 'tag1' }],
    isLoading: false,
    error: null,
    newTag: '',
    setNewTag: jest.fn(),
    handleAddTag: jest.fn(),
    handleDeleteTag: jest.fn(),
    handleUpdateTagOrder: jest.fn(),
    handleRefresh: jest.fn()
  }))
}));

jest.mock('../usePanelState', () => ({
  usePanelState: jest.fn(() => ({
    isLoading: false,
    error: '',
    isPending: false,
    startTransition: jest.fn(),
    isCollapsed: false,
    setIsCollapsed: jest.fn(),
    validationResult: { isValid: true, contentExists: true },
    isValidContent: true,
    contentValidationResult: 'valid',
    contentExists: true
  }))
}));

jest.mock('../usePanelContent', () => ({
  usePanelContent: jest.fn(() => ({
    externalSourceUrl: 'https://example.com',
    needsExternalReview: false,
    lastCheckedAt: '2023-01-01',
    contentExists: true,
    metadata: { title: 'Test Document' },
    tags: [{ id: '1', name: 'tag1' }],
    ontologyTerms: [],
    isLoading: false,
    error: null,
    handleRefresh: jest.fn()
  }))
}));

describe('useMetadataPanel', () => {
  const mockProps: MetadataPanelProps = {
    contentId: '123-456',
    onMetadataChange: jest.fn(),
    user: { id: 'user123' } as any
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return source metadata properties', () => {
    const { result } = renderHook(() => useMetadataPanel(mockProps));
    
    expect(result.current.externalSourceUrl).toBeDefined();
    expect(result.current.needsExternalReview).toBeDefined();
    expect(result.current.lastCheckedAt).toBeDefined();
  });

  it('should return tag operations properties', () => {
    const { result } = renderHook(() => useMetadataPanel(mockProps));
    
    expect(result.current.tags).toEqual([{ id: '1', name: 'tag1' }]);
    expect(result.current.newTag).toBeDefined();
    expect(result.current.setNewTag).toBeDefined();
    expect(result.current.handleAddTag).toBeDefined();
    expect(result.current.handleDeleteTag).toBeDefined();
    expect(result.current.handleUpdateTagOrder).toBeDefined();
  });

  it('should return panel state properties', () => {
    const { result } = renderHook(() => useMetadataPanel(mockProps));
    
    expect(result.current.isLoading).toBeDefined();
    expect(result.current.error).toBeDefined();
    expect(result.current.isPending).toBeDefined();
    expect(result.current.isCollapsed).toBeDefined();
    expect(result.current.setIsCollapsed).toBeDefined();
  });

  it('should call onMetadataChange when data changes', () => {
    renderHook(() => useMetadataPanel(mockProps));
    expect(mockProps.onMetadataChange).toHaveBeenCalled();
  });

  it('should not call onMetadataChange if not provided', () => {
    const propsWithoutChange: MetadataPanelProps = {
      contentId: '123-456',
      user: { id: 'user123' } as any
    };
    
    renderHook(() => useMetadataPanel(propsWithoutChange));
    // No assertion needed, test would fail if it tried to call the undefined function
  });
});
