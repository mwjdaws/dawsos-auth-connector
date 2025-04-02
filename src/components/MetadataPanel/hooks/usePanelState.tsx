
import { useState, useCallback, useEffect } from 'react';

export interface UsePanelStateProps {
  contentId: string;
  onMetadataChange?: (() => void) | null;
  isCollapsible?: boolean;
  initialCollapsed?: boolean;
  contentExists?: boolean;
}

/**
 * Hook for managing panel state in metadata components
 * 
 * @param props Configuration options
 * @returns State and handlers for the panel
 */
export function usePanelState({
  contentId,
  onMetadataChange = null,
  isCollapsible = false,
  initialCollapsed = false,
  contentExists = true
}: UsePanelStateProps) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed && isCollapsible);
  
  // Reset collapsed state when content ID changes
  useEffect(() => {
    if (isCollapsible) {
      setIsCollapsed(initialCollapsed);
    }
  }, [contentId, initialCollapsed, isCollapsible]);
  
  // Handle metadata changes safely
  const handleMetadataChange = useCallback(() => {
    if (onMetadataChange) {
      onMetadataChange();
    }
  }, [onMetadataChange]);

  // Toggle collapsed state
  const toggleCollapsed = useCallback(() => {
    if (isCollapsible) {
      setIsCollapsed(prev => !prev);
    }
  }, [isCollapsible]);
  
  return {
    isCollapsed,
    setIsCollapsed,
    toggleCollapsed,
    isCollapsible,
    onMetadataChange: handleMetadataChange,
    contentExists
  };
}

export default usePanelState;
