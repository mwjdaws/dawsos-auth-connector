
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
  contentId: string;
  externalSourceUrl: string | null;
  lastCheckedAt: string | null;
  editable?: boolean;
  className?: string;
  onMetadataChange?: () => void;
}

export const ExternalSourceSection: React.FC<ExternalSourceSectionProps> = ({
  contentId,
  externalSourceUrl,
  lastCheckedAt,
  editable = false,
  className = "",
  onMetadataChange
}) => {
  const { updateExternalSourceUrl, isUpdating } = useInlineMetadataEdit({ 
    contentId, 
    onMetadataChange 
  });
  
  return (
    <div className={className}>
      <h3 className="text-sm font-medium mb-2">External Source</h3>
      
      <InlineEditableField
        value={externalSourceUrl || ""}
        onSave={updateExternalSourceUrl}
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
