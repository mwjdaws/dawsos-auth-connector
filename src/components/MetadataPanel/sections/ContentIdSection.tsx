
import React from "react";

interface ContentIdSectionProps {
  contentId: string;
}

export const ContentIdSection: React.FC<ContentIdSectionProps> = ({ contentId }) => {
  return (
    <div className="text-xs text-muted-foreground">
      Content ID: {contentId}
    </div>
  );
};
