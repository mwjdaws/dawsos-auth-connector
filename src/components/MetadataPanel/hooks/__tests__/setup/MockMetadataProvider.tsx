
import React from 'react';
import { MetadataProvider, MetadataContextProps } from '../../useMetadataContext';
import { Tag } from '@/types/tag';
import { createValidResult } from '@/utils/validation/types';

// Default mock values for the MetadataContext
export const DEFAULT_MOCK_METADATA_CONTEXT: MetadataContextProps = {
  contentId: 'test-content-id',
  tags: [],
  validationResult: createValidResult('Test validation result'),
  isEditable: true,
  isLoading: false,
  error: null,
  refreshMetadata: jest.fn().mockResolvedValue(undefined),
  fetchTags: jest.fn().mockResolvedValue([]),
  handleAddTag: jest.fn().mockResolvedValue(undefined),
  handleDeleteTag: jest.fn().mockResolvedValue(undefined)
};

interface MockMetadataProviderProps {
  contentId?: string;
  tags?: Tag[];
  isEditable?: boolean;
  isLoading?: boolean;
  error?: Error | null;
  children: React.ReactNode;
  customValue?: Partial<MetadataContextProps>;
}

/**
 * A mock MetadataProvider for testing
 * 
 * @param props Provider props including test data
 * @returns MockMetadataProvider component
 */
export const MockMetadataProvider: React.FC<MockMetadataProviderProps> = ({
  contentId = DEFAULT_MOCK_METADATA_CONTEXT.contentId,
  tags = DEFAULT_MOCK_METADATA_CONTEXT.tags,
  isEditable = DEFAULT_MOCK_METADATA_CONTEXT.isEditable,
  isLoading = DEFAULT_MOCK_METADATA_CONTEXT.isLoading,
  error = DEFAULT_MOCK_METADATA_CONTEXT.error,
  children,
  customValue = {}
}) => {
  // Merge default mock with any custom values
  const contextValue: MetadataContextProps = {
    ...DEFAULT_MOCK_METADATA_CONTEXT,
    contentId,
    tags,
    isEditable,
    isLoading,
    error,
    ...customValue
  };

  return (
    <MetadataProvider value={contextValue}>
      {children}
    </MetadataProvider>
  );
};

export default MockMetadataProvider;
