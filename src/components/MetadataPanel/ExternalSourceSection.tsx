
import React from "react";
import { ExternalLink, Clock } from "lucide-react";
import { format } from "date-fns";

interface ExternalSourceSectionProps {
  externalSourceUrl: string | null;
  lastCheckedAt: string | null;
}

export const ExternalSourceSection: React.FC<ExternalSourceSectionProps> = ({
  externalSourceUrl,
  lastCheckedAt
}) => {
  // Format the last checked date
  const formattedLastChecked = lastCheckedAt 
    ? format(new Date(lastCheckedAt), 'MMM d, yyyy h:mm a')
    : null;

  if (!externalSourceUrl) return null;

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">External Source</h3>
      <div className="flex items-center gap-2 mb-2">
        <a 
          href={externalSourceUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ExternalLink className="h-4 w-4" />
          {externalSourceUrl.length > 40 
            ? `${externalSourceUrl.substring(0, 40)}...` 
            : externalSourceUrl}
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
