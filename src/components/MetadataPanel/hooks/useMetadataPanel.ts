
import { useState, useCallback, useEffect } from 'react';
import { useMetadataContext } from './useMetadataContext';

export interface UseMetadataPanelProps {
  contentId?: string;
  onMetadataChange?: () => void;
  isCollapsible?: boolean;
  initialCollapsed?: boolean;
}

/**
 * Hook for managing the state and behavior of the metadata panel
 */
export function useMetadataPanel({
  contentId,
  onMetadataChange = () => {},
  isCollapsible = false,
  initialCollapsed = false
}: UseMetadataPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed && isCollapsible);
  
  // Get metadata state from context
  const { isLoading, error, fetchAllMetadata } = useMetadataContext();
  
  // Reset collapsed state when content ID changes
  useEffect(() => {
    if (isCollapsible) {
      setIsCollapsed(initialCollapsed);
    }
  }, [contentId, initialCollapsed, isCollapsible]);
  
  // Handle refresh button click
  const handleRefresh = useCallback(() => {
    // Refetch all metadata
    fetchAllMetadata();
    
    // Notify parent if needed
    onMetadataChange();
  }, [fetchAllMetadata, onMetadataChange]);
  
  return {
    isCollapsed,
    setIsCollapsed,
    isCollapsible,
    isLoading,
    error,
    handleRefresh
  };
}
