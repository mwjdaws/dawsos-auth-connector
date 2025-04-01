
import { useState, useCallback } from 'react';

interface UseMetadataPanelProps {
  contentId: string;
  onMetadataChange: (() => void) | null;
  isCollapsible?: boolean;
  initialCollapsed?: boolean;
}

/**
 * Hook for managing the metadata panel state
 */
export function useMetadataPanel({
  contentId,
  onMetadataChange,
  isCollapsible = false,
  initialCollapsed = false
}: UseMetadataPanelProps) {
  // State
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Refresh metadata
  const handleRefresh = useCallback(() => {
    // This would trigger a refresh of the metadata
    // Currently handled by the MetadataQueryProvider
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
    handleRefresh
  };
}
