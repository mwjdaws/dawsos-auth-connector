
/**
 * ContentIdSection Component
 * 
 * Displays the content ID of the current knowledge source or document.
 * This is typically shown at the bottom of the metadata panel for reference purposes.
 * 
 * @example
 * ```tsx
 * <ContentIdSection contentId="ks-123456" />
 * ```
 */
import React from "react";
import { ContentIdSectionProps } from "../types";

export const ContentIdSection: React.FC<ContentIdSectionProps> = ({ 
  contentId,
  className 
}) => {
  return (
    <div className={`text-xs text-muted-foreground ${className || ''}`}>
      Content ID: {contentId}
    </div>
  );
};
