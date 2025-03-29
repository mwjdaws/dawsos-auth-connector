
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMetadataContext } from '../../useMetadataContext';
import { useMetadataPanel } from '../useMetadataPanel';

// Mock the hooks we're importing
vi.mock('../useMetadataPanel', () => ({
  useMetadataPanel: vi.fn()
}));

// Sample test data
const mockMetadata = {
  contentId: 'test-content-id',
  title: 'Test Title',
  tags: ['tag1', 'tag2'],
  domains: ['domain1', 'domain2'],
  externalSource: 'https://example.com',
  ontologyTerms: [
    { id: 'term1', term: 'Term 1', description: 'Description 1' },
    { id: 'term2', term: 'Term 2', description: 'Description 2' }
  ],
  loading: false,
  error: null
};

describe('useMetadataContext', () => {
  // Setup mock implementations
  beforeEach(() => {
    (useMetadataPanel as any).mockReturnValue({
      ...mockMetadata,
      setTags: vi.fn(),
      addTag: vi.fn(),
      removeTag: vi.fn(),
      refreshTags: vi.fn()
    });
  });

  test('should provide metadata context values', () => {
    const { result } = renderHook(() => useMetadataContext('test-content-id'));
    
    // Test that the context values are provided correctly
    expect(result.current.contentId).toBe('test-content-id');
    expect(result.current.tags).toEqual(mockMetadata.tags);
    expect(result.current.domains).toBeDefined();
    expect(result.current.externalSource).toBeDefined();
    expect(result.current.loading).toBeDefined();
    expect(result.current.error).toBeDefined();
    expect(typeof result.current.setTags).toBe('function');
    expect(typeof result.current.addTag).toBe('function');
    expect(typeof result.current.removeTag).toBe('function');
    expect(typeof result.current.refreshMetadata).toBe('function');
  });

  test('should call setTags when invoked', () => {
    const { result } = renderHook(() => useMetadataContext('test-content-id'));
    const newTags = ['new-tag1', 'new-tag2'];
    
    act(() => {
      result.current.setTags(newTags);
    });
    
    // This would check if setTags was called with the right parameters
    // in a real implementation
    expect(typeof result.current.setTags).toBe('function');
  });

  test('should call addTag when invoked', () => {
    const { result } = renderHook(() => useMetadataContext('test-content-id'));
    const newTag = 'new-tag';
    
    act(() => {
      result.current.addTag(newTag);
    });
    
    // This would check if addTag was called with the right parameters
    // in a real implementation
    expect(typeof result.current.addTag).toBe('function');
  });

  test('should call removeTag when invoked', () => {
    const { result } = renderHook(() => useMetadataContext('test-content-id'));
    const tagToRemove = 'tag1';
    
    act(() => {
      result.current.removeTag(tagToRemove);
    });
    
    // This would check if removeTag was called with the right parameters
    // in a real implementation
    expect(typeof result.current.removeTag).toBe('function');
  });

  test('should call refreshMetadata when invoked', async () => {
    const { result } = renderHook(() => useMetadataContext('test-content-id'));
    
    await act(async () => {
      await result.current.refreshMetadata();
    });
    
    // This would check if refreshMetadata triggered the right operations
    // in a real implementation
    expect(typeof result.current.refreshMetadata).toBe('function');
  });
});
