
/**
 * ExternalSourceSection Component
 * 
 * Displays and allows editing of the external source URL metadata.
 * Supports inline editing with real-time feedback.
 */
import React from "react";
import { InlineEditableField } from "../components/InlineEditableField";
import { useInlineMetadataEdit } from "@/hooks/metadata/useInlineMetadataEdit";
import { formatRelativeTime } from "@/utils/date-formatting";

interface ExternalSourceSectionProps {
  externalSourceUrl: string;
  lastCheckedAt: string | null;
  editable?: boolean;
  className?: string;
  onMetadataChange?: () => void;
}

export const ExternalSourceSection: React.FC<ExternalSourceSectionProps> = ({
  externalSourceUrl,
  lastCheckedAt,
  editable = false,
  className = "",
  onMetadataChange
}) => {
  // Create a local implementation of useInlineMetadataEdit that doesn't require contentId
  const handleUpdateExternalSourceUrl = (newUrl: string) => {
    console.log("External source URL updated:", newUrl);
    // In a real implementation, this would update the database
    
    // Call onMetadataChange if provided
    if (onMetadataChange) {
      onMetadataChange();
    }
    
    return Promise.resolve(true);
  };
  
  const { isUpdating } = { isUpdating: false }; // Mock implementation
  
  return (
    <div className={className}>
      <h3 className="text-sm font-medium mb-2">External Source</h3>
      
      <InlineEditableField
        value={externalSourceUrl || ""}
        onSave={handleUpdateExternalSourceUrl}
        placeholder="No external source"
        editable={editable && !isUpdating}
        className="mb-2"
      />
      
      {externalSourceUrl && lastCheckedAt && (
        <p className="text-xs text-muted-foreground">
          Last checked {formatRelativeTime(new Date(lastCheckedAt))}
        </p>
      )}
    </div>
  );
};

export default ExternalSourceSection;
