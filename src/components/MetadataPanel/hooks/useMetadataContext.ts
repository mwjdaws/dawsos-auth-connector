
import { createContext, useContext } from 'react';
import { ContentIdValidationResult } from '@/utils/validation/contentIdValidation';

interface MetadataContextProps {
  contentId?: string;
  title?: string;
  description?: string;
  contentType?: string;
  sourceUrl?: string;
  validationResult: ContentIdValidationResult;
  isEditable: boolean;
  isLoading: boolean;
  error: string | null;
  onTitleChange?: (newTitle: string) => void;
  onDescriptionChange?: (newDescription: string) => void;
  onContentTypeChange?: (newContentType: string) => void;
  onSourceUrlChange?: (newSourceUrl: string) => void;
  refreshMetadata?: () => void;
  // Add tag operations that are expected in the tests
  addTag?: (tag: string) => void;
  removeTag?: (tagId: string) => void;
  refreshTags?: () => Promise<void>;
}

const MetadataContext = createContext<MetadataContextProps | undefined>(undefined);

export const MetadataProvider = MetadataContext.Provider;

export function useMetadataContext(contentId?: string) {
  const context = useContext(MetadataContext);
  
  if (!context) {
    throw new Error('useMetadataContext must be used within a MetadataProvider');
  }
  
  return context;
}
