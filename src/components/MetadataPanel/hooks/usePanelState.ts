
import { useState, useEffect } from 'react';
import { isValidContentId } from '@/utils/validation/contentIdValidation';

export interface UsePanelStateProps {
  contentId: string;
  onMetadataChange?: (() => void) | undefined;
  isCollapsible?: boolean | undefined;
  initialCollapsed?: boolean | undefined;
}

export const usePanelState = ({
  contentId,
  onMetadataChange,
  isCollapsible = false,
  initialCollapsed = false
}: UsePanelStateProps) => {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed || false);
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
