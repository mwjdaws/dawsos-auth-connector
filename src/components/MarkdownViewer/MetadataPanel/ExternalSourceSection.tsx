
import React from "react";
import { ExternalLink, Clock } from "lucide-react";
import { format } from "date-fns";

interface ExternalSourceSectionProps {
  externalSourceUrl: string | null;
  lastCheckedAt: string | null;
}

export function ExternalSourceSection({ externalSourceUrl, lastCheckedAt }: ExternalSourceSectionProps) {
  if (!externalSourceUrl) return null;
  
  // Format the last checked date
  const formattedLastChecked = lastCheckedAt 
    ? format(new Date(lastCheckedAt), 'MMM d, yyyy h:mm a')
    : null;

  return (
    <div>
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
}
