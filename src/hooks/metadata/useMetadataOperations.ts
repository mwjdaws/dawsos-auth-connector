
/**
 * Combined hook for metadata operations
 * 
 * This is a refactored version of the original useMetadataOperations hook
 * that combines several smaller, focused hooks while maintaining the same API.
 */
import { useEffect } from "react";
import { useMetadataBase } from "./useMetadataBase";
import { useFetchMetadata } from "./useFetchMetadata";
import { useTagOperations } from "./useTagOperations";
import { useOntologyTermOperations } from "./useOntologyTermOperations";
import { useExternalSourceOperations } from "./useExternalSourceOperations";
import { safeCallback } from "@/utils/compatibility";

export function useMetadataOperations(contentId?: string) {
  // Base state management
  const {
    state,
    setTags,
    setOntologyTerms,
    setExternalSource,
    setLoading,
    setError
  } = useMetadataBase();

  // Fetch operations
  const {
    fetchAllMetadata,
    fetchTags,
    fetchOntologyTerms,
    fetchExternalSource
  } = useFetchMetadata({
    contentId,
    setTags,
    setOntologyTerms,
    setExternalSource,
    setLoading,
    setError
  });

  // Tag operations
  const { addTag, deleteTag } = useTagOperations({
    contentId,
    tags: state.tags,
    setTags
  });

  // Ontology term operations
  const { assignOntologyTerm, removeOntologyTerm } = useOntologyTermOperations({
    contentId,
    ontologyTerms: state.ontologyTerms,
    setOntologyTerms
  });

  // External source operations
  const { updateExternalSource, markExternalSourceChecked } = useExternalSourceOperations({
    contentId,
    externalSource: state.externalSource,
    setExternalSource
  });

  // Initialize data on mount
  useEffect(() => {
    if (contentId) {
      fetchAllMetadata();
    }
  }, [contentId, fetchAllMetadata]);

  // Return the combined API with the same interface as the original hook
  return {
    // State from useMetadataBase
    ...state,
    
    // Fetch operations
    fetchAllMetadata,
    fetchTags,
    fetchOntologyTerms,
    fetchExternalSource,
    
    // Tag operations
    addTag,
    deleteTag,
    
    // Ontology term operations
    assignOntologyTerm,
    removeOntologyTerm,
    
    // External source operations
    updateExternalSource,
    markExternalSourceChecked: markExternalSourceChecked
  };
}

// Re-export for backward compatibility
export type { 
  MetadataState, 
  ExternalSourceMetadata 
} from "./useMetadataBase";
export type { Tag } from "@/types/tag";
export type { OntologyTerm } from "@/components/MetadataPanel/types";

// Default export for backward compatibility
export default useMetadataOperations;
