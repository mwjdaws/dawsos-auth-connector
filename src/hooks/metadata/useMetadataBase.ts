
/**
 * Base hook for metadata operations
 */
import { useState } from "react";
import { Tag } from "@/types/tag";
import { OntologyTerm } from "@/components/MetadataPanel/types";

export interface ExternalSourceMetadata {
  external_source_url: string | null;
  needs_external_review: boolean;
  external_source_checked_at: string | null;
}

export interface MetadataState {
  tags: Tag[];
  ontologyTerms: OntologyTerm[];
  externalSource: ExternalSourceMetadata | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Base hook for metadata operations
 * @returns Base metadata state
 */
export function useMetadataBase() {
  const [state, setState] = useState<MetadataState>({
    tags: [],
    ontologyTerms: [],
    externalSource: null,
    isLoading: false,
    error: null
  });

  const setLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  };

  const setError = (error: Error | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const setTags = (tags: Tag[]) => {
    setState(prev => ({ ...prev, tags }));
  };

  const setOntologyTerms = (ontologyTerms: OntologyTerm[]) => {
    setState(prev => ({ ...prev, ontologyTerms }));
  };

  const setExternalSource = (externalSource: ExternalSourceMetadata | null) => {
    setState(prev => ({ ...prev, externalSource }));
  };

  return {
    state,
    setState,
    setLoading,
    setError,
    setTags,
    setOntologyTerms,
    setExternalSource
  };
}
