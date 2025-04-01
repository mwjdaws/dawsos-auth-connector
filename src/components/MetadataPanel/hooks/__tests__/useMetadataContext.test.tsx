
import { renderHook } from '@testing-library/react-hooks';
import { MetadataProvider, useMetadataContext } from '../useMetadataContext';
import { ValidationResult } from '@/utils/validation/types';
import { Tag } from '@/types/tag';
import { OntologyTerm } from '@/types/ontology';
import React from 'react';

// Mock data
const mockContentId = 'test-content-id';
const mockTags: Tag[] = [{ 
  id: '1', 
  name: 'tag1', 
  content_id: mockContentId, 
  display_order: 0,
  type_id: null 
}];
const mockValidationResult: ValidationResult = { 
  isValid: true, 
  errorMessage: null, 
  message: 'Valid content',
  resultType: 'generic'
};

describe('useMetadataContext', () => {
  // Original console methods
  const originalError = console.error;
  const originalWarn = console.warn;
  
  beforeEach(() => {
    // Mock console methods to suppress expected errors during testing
    console.error = jest.fn();
    console.warn = jest.fn();
  });
  
  afterEach(() => {
    // Restore original console methods
    console.error = originalError;
    console.warn = originalWarn;
  });
  
  test('throws error when used outside of MetadataProvider', () => {
    expect(() => {
      renderHook(() => useMetadataContext());
    }).toThrow('useMetadataContext must be used within a MetadataProvider');
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
      <MetadataProvider value={contextValue}>
        {children}
      </MetadataProvider>
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
    // Prepare context values with tags array
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
      <MetadataProvider value={contextValue}>
        {children}
      </MetadataProvider>
    );
    
    // Render hook with different contentId
    renderHook(() => useMetadataContext('different-content-id'), { wrapper });
    
    // Assert warning was logged
    expect(console.warn).toHaveBeenCalled();
  });
});
