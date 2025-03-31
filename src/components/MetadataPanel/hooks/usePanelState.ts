
import { useState } from "react";

/**
 * Props for the usePanelState hook
 */
export interface UsePanelStateProps {
  contentId: string;
  onMetadataChange: (() => void) | null;
  isCollapsible?: boolean;
  initialCollapsed?: boolean;
  contentExists?: boolean;
}

/**
 * Custom hook to manage panel state (collapsed/expanded)
 */
export const usePanelState = ({
  contentId,
  onMetadataChange,
  isCollapsible = true,
  initialCollapsed = false,
  contentExists = false
}: UsePanelStateProps) => {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed && isCollapsible);

  return {
    contentId,
    isCollapsed,
    setIsCollapsed,
    isCollapsible,
    onMetadataChange,
    contentExists
  };
};
