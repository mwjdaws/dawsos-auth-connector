
import { useDocumentVersioning } from './useDocumentVersioning';
import { useSaveDraftHandler } from './handlers/useSaveDraftHandler';
import { usePublishHandler } from './handlers/usePublishHandler';
import { DocumentOperationHandlerProps } from './types';

export const useDocumentOperationHandlers = (props: DocumentOperationHandlerProps) => {
  const {
    title,
    content,
    templateId,
    externalSourceUrl,
    documentId,
    sourceId,
    saveDraft,
    publishDocument,
    setLastSavedTitle,
    setLastSavedContent,
    setLastSavedExternalSourceUrl,
    setIsDirty,
    onSaveDraft,
    onPublish
  } = props;
  
  const { createVersion } = useDocumentVersioning();
  
  // Use the save draft handler module
  const { 
    handleSaveDraft, 
    isSavingManually 
  } = useSaveDraftHandler({
    title,
    content,
    templateId,
    externalSourceUrl,
    documentId,
    sourceId,
    saveDraft,
    setLastSavedTitle,
    setLastSavedContent,
    setLastSavedExternalSourceUrl,
    setIsDirty,
    onSaveDraft,
    createVersion
  });
  
  // Use the publish handler module
  const { 
    handlePublish 
  } = usePublishHandler({
    title,
    content,
    templateId,
    externalSourceUrl,
    saveDraft: handleSaveDraft,
    publishDocument,
    onPublish,
    createVersion
  });
  
  return {
    handleSaveDraft,
    handlePublish,
    isSavingManually
  };
};
