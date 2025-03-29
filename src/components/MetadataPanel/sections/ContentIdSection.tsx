
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
