
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { MetadataProvider, useMetadataContext } from '../useMetadataContext';
import { createValidResult } from '@/utils/validation/types';
import { Tag } from '@/types/tag';

// Mock data
const mockContentId = 'test-content-id';
const mockTags: Tag[] = [{ 
  id: '1', 
  name: 'tag1', 
  content_id: mockContentId, 
  display_order: 0,
  type_id: null 
}];
const mockValidationResult = createValidResult('Valid content');

describe('useMetadataContext', () => {
  test('throws error when used outside of MetadataProvider', () => {
    // Suppress console.error during this test to avoid noisy output
    const originalError = console.error;
    console.error = jest.fn();
    
    expect(() => {
      renderHook(() => useMetadataContext());
    }).toThrow('useMetadataContext must be used within a MetadataProvider');
    
    // Restore console.error
    console.error = originalError;
  });
  
  test('returns context values when used within MetadataProvider', () => {
    // Prepare context values
    const contextValue = {
      contentId: mockContentId,
      tags: mockTags,
      validationResult: mockValidationResult,
      isEditable: true,
      isLoading: false,
      error: null
    };
    
    // Create wrapper with provider
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(MetadataProvider, { value: contextValue }, children)
    );
    
    // Render hook with provider wrapper
    const { result } = renderHook(() => useMetadataContext(), { wrapper });
    
    // Assert context values are correctly provided
    expect(result.current.contentId).toBe(mockContentId);
    expect(result.current.tags).toEqual(mockTags);
    expect(result.current.validationResult).toEqual(mockValidationResult);
    expect(result.current.isEditable).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
  
  test('warns when contentId does not match context contentId', () => {
    // Mock console.warn
    const originalWarn = console.warn;
    console.warn = jest.fn();
    
    // Prepare context values
    const contextValue = {
      contentId: mockContentId,
      validationResult: mockValidationResult,
      isEditable: true,
      isLoading: false,
      error: null
    };
    
    // Create wrapper with provider
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(MetadataProvider, { value: contextValue }, children)
    );
    
    // Render hook with different contentId
    renderHook(() => useMetadataContext('different-content-id'), { wrapper });
    
    // Assert warning was logged
    expect(console.warn).toHaveBeenCalled();
    
    // Restore console.warn
    console.warn = originalWarn;
  });
});
