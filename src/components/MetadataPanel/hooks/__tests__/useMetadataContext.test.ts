
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMetadataContext } from '../../useMetadataContext';
import { useMetadataPanel } from '../../useMetadataPanel';

// Mock the hooks we're importing
vi.mock('../../useMetadataPanel', () => ({
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
    const { result } = renderHook(() => useMetadataContext());
    
    // Test that the context values are provided correctly
    expect(result.current.contentId).toBe(mockMetadata.contentId);
    expect(result.current.title).toBe(mockMetadata.title);
    expect(result.current.tags).toEqual(mockMetadata.tags);
    expect(result.current.domains).toEqual(mockMetadata.domains);
    expect(result.current.externalSource).toBe(mockMetadata.externalSource);
    expect(result.current.ontologyTerms).toEqual(mockMetadata.ontologyTerms);
    expect(result.current.loading).toBe(mockMetadata.loading);
    expect(result.current.error).toBe(mockMetadata.error);
    expect(typeof result.current.setTags).toBe('function');
    expect(typeof result.current.addTag).toBe('function');
    expect(typeof result.current.removeTag).toBe('function');
    expect(typeof result.current.refreshTags).toBe('function');
  });

  test('should call setTags when invoked', () => {
    const { result } = renderHook(() => useMetadataContext());
    const newTags = ['new-tag1', 'new-tag2'];
    
    act(() => {
      result.current.setTags(newTags);
    });
    
    expect(useMetadataPanel().setTags).toHaveBeenCalledWith(newTags);
  });

  test('should call addTag when invoked', () => {
    const { result } = renderHook(() => useMetadataContext());
    const newTag = 'new-tag';
    
    act(() => {
      result.current.addTag(newTag);
    });
    
    expect(useMetadataPanel().addTag).toHaveBeenCalledWith(newTag);
  });

  test('should call removeTag when invoked', () => {
    const { result } = renderHook(() => useMetadataContext());
    const tagToRemove = 'tag1';
    
    act(() => {
      result.current.removeTag(tagToRemove);
    });
    
    expect(useMetadataPanel().removeTag).toHaveBeenCalledWith(tagToRemove);
  });

  test('should call refreshTags when invoked', () => {
    const { result } = renderHook(() => useMetadataContext());
    
    act(() => {
      result.current.refreshTags();
    });
    
    expect(useMetadataPanel().refreshTags).toHaveBeenCalled();
  });
});
