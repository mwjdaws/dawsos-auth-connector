
import { useState, useEffect } from 'react';
import { isValidContentId } from '@/utils/validation/contentIdValidation';

export interface UsePanelStateProps {
  contentId: string;
  onMetadataChange?: (() => void) | null;
  isCollapsible?: boolean;
  initialCollapsed?: boolean;
}

/**
 * Hook for managing panel state
 * 
 * Handles collapsible panel state and content validation
 * 
 * @param props - Panel state props
 * @returns Panel state and methods
 */
export const usePanelState = ({
  contentId,
  onMetadataChange,
  isCollapsible = false,
  initialCollapsed = false
}: UsePanelStateProps) => {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [contentExists, setContentExists] = useState(true);

  // Check if the content ID is valid
  useEffect(() => {
    if (!isValidContentId(contentId)) {
      setContentExists(false);
    } else {
      // We could check if the content exists in the database here
      // For now, we'll assume it does if the ID is valid
      setContentExists(true);
    }
  }, [contentId]);

  // Handle metadata changes
  const handleMetadataChange = () => {
    if (onMetadataChange) {
      onMetadataChange();
    }
  };

  return {
    isCollapsed,
    setIsCollapsed,
    contentExists,
    handleMetadataChange
  };
};
