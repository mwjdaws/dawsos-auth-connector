
/**
 * ExternalSourceSection Component
 * 
 * Displays information about an external source including its URL and when it was last checked.
 * Returns null if no external source URL is provided.
 * 
 * @example
 * ```tsx
 * <ExternalSourceSection
 *   externalSourceUrl="https://example.com/source"
 *   lastCheckedAt="2023-06-15T12:30:45Z"
 * />
 * ```
 */
import React from "react";
import { ExternalLink, Clock } from "lucide-react";
import { format } from "date-fns";
import { ExternalSourceSectionProps } from "../types";

export const ExternalSourceSection: React.FC<ExternalSourceSectionProps> = ({
  externalSourceUrl,
  lastCheckedAt,
  className
}) => {
  if (!externalSourceUrl) return null;
  
  // Format the last checked date
  const formattedLastChecked = lastCheckedAt 
    ? format(new Date(lastCheckedAt), 'MMM d, yyyy h:mm a')
    : null;

  return (
    <div className={className}>
      <h3 className="text-sm font-medium mb-2">External Source</h3>
      <div className="mb-2">
        <a
          href={externalSourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
        >
          <ExternalLink className="h-4 w-4" /> View Source
        </a>
      </div>
      
      {lastCheckedAt && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <span>Last checked: {formattedLastChecked}</span>
        </div>
      )}
    </div>
  );
};
