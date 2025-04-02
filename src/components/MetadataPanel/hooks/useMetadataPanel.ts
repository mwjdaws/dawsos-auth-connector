
import { useState, useCallback, useEffect } from 'react';
import { useMetadataContext } from './useMetadataContext';

export interface UseMetadataPanelProps {
  contentId?: string;
  onMetadataChange?: (() => void) | null;
  isCollapsible?: boolean;
  initialCollapsed?: boolean;
}

/**
 * Hook for managing the state and behavior of the metadata panel
 */
export function useMetadataPanel({
  contentId,
  onMetadataChange = null,
  isCollapsible = false,
  initialCollapsed = false
}: UseMetadataPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed && isCollapsible);
  
  // Get metadata state from context
  const { isLoading, error, tags, ontologyTerms, externalSource } = useMetadataContext();
  
  // Reset collapsed state when content ID changes
  useEffect(() => {
    if (isCollapsible) {
      setIsCollapsed(initialCollapsed);
    }
  }, [contentId, initialCollapsed, isCollapsible]);
  
  // Handle refresh button click
  const handleRefresh = useCallback(() => {
    // Call onMetadataChange if needed
    if (onMetadataChange) {
      onMetadataChange();
    }
  }, [onMetadataChange]);
  
  return {
    isCollapsed,
    setIsCollapsed,
    isCollapsible,
    isLoading,
    error,
    contentId,
    tags,
    ontologyTerms,
    externalSource,
    handleRefresh
  };
}
