
import { useState, useEffect } from 'react';
import { useMetadataContext } from './useMetadataContext';

/**
 * Hook for managing the panel content state
 * 
 * @param initialCollapsed Whether the panel should start collapsed
 * @returns State and handlers for the panel content
 */
export function usePanelContent(initialCollapsed = false) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [newTag, setNewTag] = useState("");
  
  // Get metadata context
  const {
    contentId,
    tags,
    isLoading,
    error,
    sourceMetadata
  } = useMetadataContext();
  
  // Reset state when content ID changes
  useEffect(() => {
    setNewTag("");
  }, [contentId]);
  
  // Extract external source info
  const externalSourceUrl = 
    sourceMetadata?.external_source_url || 
    ('externalSource' in (sourceMetadata || {}) ? sourceMetadata?.externalSource : null);
    
  const needsExternalReview = 
    ('needs_external_review' in (sourceMetadata || {})) 
      ? sourceMetadata?.needs_external_review 
      : ('needsExternalReview' in (sourceMetadata || {}))
        ? sourceMetadata?.needsExternalReview 
        : false;
        
  const lastCheckedAt = 
    ('external_source_checked_at' in (sourceMetadata || {}))
      ? sourceMetadata?.external_source_checked_at
      : ('lastCheckedAt' in (sourceMetadata || {}))
        ? sourceMetadata?.lastCheckedAt
        : null;
  
  return {
    isCollapsed,
    setIsCollapsed,
    newTag,
    setNewTag,
    tags,
    isLoading,
    error,
    externalSourceUrl,
    needsExternalReview,
    lastCheckedAt,
    sourceMetadata
  };
}
