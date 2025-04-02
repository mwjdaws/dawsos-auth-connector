
import { useState, useCallback, useEffect } from 'react';
import { useMetadataContext } from './useMetadataContext';
import { UseMetadataPanelProps } from '../types';

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
  const { isLoading, error, refetchAll } = useMetadataContext();
  
  // Reset collapsed state when content ID changes
  useEffect(() => {
    if (isCollapsible) {
      setIsCollapsed(initialCollapsed);
    }
  }, [contentId, initialCollapsed, isCollapsible]);
  
  // Handle refresh button click
  const handleRefresh = useCallback(() => {
    // Refetch all metadata
    refetchAll();
    
    // Notify parent if needed
    if (onMetadataChange) {
      onMetadataChange();
    }
  }, [refetchAll, onMetadataChange]);
  
  return {
    isCollapsed,
    setIsCollapsed,
    isCollapsible,
    isLoading,
    error,
    handleRefresh
  };
}
