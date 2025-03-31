
import { renderHook, act } from '@testing-library/react-hooks';
import { MetadataProvider, useMetadataContext } from '../useMetadataContext';
import { mockMetadataContext } from './setup/test-types';
import { ValidationResult } from '@/utils/validation/types';
import React from 'react';

describe('useMetadataContext', () => {
  // Test that the hook throws an error when used outside a provider
  test('throws error when used outside MetadataProvider', () => {
    // Prevent console.error from cluttering test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useMetadataContext());
    }).toThrow('useMetadataContext must be used within a MetadataProvider');
    
    // Restore console.error
    jest.restoreAllMocks();
  });

  // Test that the hook returns the context values correctly
  test('returns context when used within MetadataProvider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MetadataProvider value={mockMetadataContext}>
        {children}
      </MetadataProvider>
    );

    const { result } = renderHook(() => useMetadataContext(), { wrapper });
    
    expect(result.current).toBe(mockMetadataContext);
  });

  // Test that the hook warns when contentId doesn't match
  test('warns when contentId does not match context contentId', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MetadataProvider value={mockMetadataContext}>
        {children}
      </MetadataProvider>
    );

    renderHook(() => useMetadataContext('different-content-id'), { wrapper });
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('requested contentId different-content-id doesn\'t match context contentId')
    );
    
    consoleSpy.mockRestore();
  });

  // Test that validation results are properly passed
  test('passes validation results through context', () => {
    const mockValidation: ValidationResult = {
      isValid: false,
      message: null,
      errorMessage: 'Test validation error'
    };
    
    const contextWithValidation = {
      ...mockMetadataContext,
      validationResult: mockValidation
    };
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MetadataProvider value={contextWithValidation}>
        {children}
      </MetadataProvider>
    );

    const { result } = renderHook(() => useMetadataContext(), { wrapper });
    
    expect(result.current.validationResult).toEqual(mockValidation);
  });
});
