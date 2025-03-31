
import React from 'react';
import { ExternalLink, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ExternalSourceInfoProps {
  url: string | null;
  lastCheckedAt: string | null;
  needsReview?: boolean;
}

export function ExternalSourceInfo({ url, lastCheckedAt, needsReview = false }: ExternalSourceInfoProps) {
  if (!url) return null;
  
  // Format the last checked date
  const formattedLastChecked = lastCheckedAt 
    ? format(new Date(lastCheckedAt), 'MMM d, yyyy h:mm a')
    : null;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm flex items-center gap-1 text-primary hover:underline max-w-[90%] truncate"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          <span className="truncate">{url}</span>
        </a>
        
        {needsReview && (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Needs Review
          </Badge>
        )}
      </div>
      
      {formattedLastChecked && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <span>Last checked: {formattedLastChecked}</span>
        </div>
      )}
    </div>
  );
}
