
import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ExternalSourceInfoProps {
  url: string | null;
  lastCheckedAt: string | null;
  needsReview: boolean;
}

/**
 * Displays information about an external source
 */
export const ExternalSourceInfo: React.FC<ExternalSourceInfoProps> = ({
  url,
  lastCheckedAt,
  needsReview
}) => {
  if (!url) {
    return (
      <div className="text-sm text-muted-foreground">
        No external source information available
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-medium mb-1">Source URL</p>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center"
        >
          {url}
          <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </div>
      
      <div>
        <p className="text-sm font-medium mb-1">Last Checked</p>
        <p className="text-sm text-muted-foreground">
          {lastCheckedAt 
            ? formatDistanceToNow(new Date(lastCheckedAt), { addSuffix: true }) 
            : 'Never checked'}
        </p>
      </div>
      
      {needsReview && (
        <div className="bg-yellow-50 border border-yellow-200 p-2 rounded-md flex gap-2 items-center text-yellow-800">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <p className="text-xs">
            This source may have changed since it was last checked. Please review the external content.
          </p>
        </div>
      )}
    </div>
  );
};
