
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
 * 
 * @example
 * ```tsx
 * <ContentIdSection contentId="ks-123456" className="mt-4 text-xs" />
 * ```
 * 
 * @remarks
 * - Simple display component showing the content ID in muted text
 * - Can be styled with optional className prop
 * - Useful for debugging and reference purposes
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
