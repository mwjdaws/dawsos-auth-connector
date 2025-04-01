
import React from 'react';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { ExternalLink, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { ExternalSourceMetadata, SourceMetadata } from '../types';

interface ExternalSourceSectionProps {
  externalSource: SourceMetadata | ExternalSourceMetadata | null;
  contentId: string;
  editable: boolean;
  onMetadataChange?: () => void;
  className?: string;
}

/**
 * ExternalSourceSection Component
 * 
 * Displays and manages external source information
 */
export function ExternalSourceSection({
  externalSource,
  contentId,
  editable,
  onMetadataChange,
  className = ''
}: ExternalSourceSectionProps) {
  // Check if we have a valid external source URL
  const hasExternalSource = externalSource && 
    ('externalSource' in externalSource 
      ? !!externalSource.externalSource
      : !!externalSource.external_source_url);
  
  // Get the URL (handle both formats)
  const sourceUrl = externalSource && 
    ('externalSource' in externalSource 
      ? externalSource.externalSource 
      : externalSource.external_source_url);
  
  // Get the last checked time
  const lastChecked = externalSource && 
    ('lastCheckedAt' in externalSource 
      ? externalSource.lastCheckedAt 
      : externalSource.external_source_checked_at);
  
  // Get the needs review flag
  const needsReview = externalSource && 
    ('needsExternalReview' in externalSource 
      ? externalSource.needsExternalReview
      : externalSource.needs_external_review);
  
  // Format the last checked time
  const formatLastChecked = (timestamp: string | null) => {
    if (!timestamp) return 'Never checked';
    return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
  };
  
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-sm font-medium flex items-center gap-1.5">
        <ExternalLink className="h-4 w-4" />
        External Source
      </h3>
      
      {hasExternalSource ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <a
              href={sourceUrl || '#'}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline truncate max-w-[80%]"
            >
              {truncateUrl(sourceUrl || '')}
            </a>
            
            <CopyButton value={sourceUrl || ''} />
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>
                Last checked: {formatLastChecked(lastChecked)}
              </span>
              
              {needsReview && (
                <div className="inline-flex items-center text-amber-600 gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Needs review</span>
                </div>
              )}
              
              {!needsReview && lastChecked && (
                <div className="inline-flex items-center text-green-600 gap-1">
                  <Check className="h-3 w-3" />
                  <span>Valid</span>
                </div>
              )}
            </div>
            
            {editable && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={onMetadataChange}
              >
                <RefreshCw className="h-3 w-3" />
                <span className="sr-only">Refresh</span>
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          <p>No external source linked to this content</p>
        </div>
      )}
    </div>
  );
}

// Helper function to truncate long URLs
function truncateUrl(url: string, maxLength: number = 50): string {
  if (!url) return '';
  if (url.length <= maxLength) return url;
  
  // Remove protocol
  let trimmed = url.replace(/^https?:\/\//, '');
  
  // If still too long, truncate the middle
  if (trimmed.length > maxLength) {
    const start = trimmed.substring(0, maxLength / 2 - 2);
    const end = trimmed.substring(trimmed.length - maxLength / 2 + 2);
    trimmed = `${start}...${end}`;
  }
  
  return trimmed;
}
