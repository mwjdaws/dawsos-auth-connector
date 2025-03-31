
import { useState, useCallback, useEffect } from 'react';

export interface UsePanelStateProps {
  contentId: string;
  onMetadataChange?: (() => void) | null;
  isCollapsible?: boolean;
  initialCollapsed?: boolean;
  contentExists?: boolean;
}

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
  
  return {
    isCollapsed,
    setIsCollapsed,
    isCollapsible,
    onMetadataChange: handleMetadataChange,
    contentExists
  };
}
