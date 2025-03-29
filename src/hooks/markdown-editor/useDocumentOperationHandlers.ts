
import { useDocumentVersioning } from './useDocumentVersioning';
import { useSaveDraftHandler } from './handlers/useSaveDraftHandler';
import { usePublishHandler } from './handlers/usePublishHandler';
import { DocumentOperationHandlerProps } from './types';
import { useOntologyEnrichment } from './useOntologyEnrichment';

/**
 * Hook that provides handlers for document operations with proper lifecycle management
 * 
 * This is a composition hook that combines:
 * - Save draft functionality with versioning
 * - Publish functionality with enrichment
 * - Status tracking for UI feedback
 * 
 * @param props All document data and callback functions needed for operations
 * @returns Object containing handler functions and status indicators
 */
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
  
  // Get the document versioning utilities
  const { createVersion } = useDocumentVersioning();
  
  // Get the ontology enrichment utilities
  const { enrichContentWithOntology } = useOntologyEnrichment();
  
  // Use the save draft handler with lifecycle hooks
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
    createVersion,
    enrichContentWithOntology
  });
  
  // Use the publish handler with lifecycle hooks
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
    createVersion,
    enrichContentWithOntology
  });
  
  return {
    handleSaveDraft,
    handlePublish,
    isSavingManually
  };
};
