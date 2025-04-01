
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalSourceInfo } from '../components/ExternalSourceInfo';
import { ExternalSourceControls } from '../components/ExternalSourceControls';

export interface ExternalSourceSectionProps {
  externalSourceUrl: string | null;
  lastCheckedAt?: string | null;
  needsExternalReview?: boolean;
  editable: boolean;
  isLoading?: boolean;
  contentId: string;
  onValidateSource?: () => void;
  onToggleReviewFlag?: () => void;
  onMetadataChange?: () => void;
}

export function ExternalSourceSection({
  externalSourceUrl,
  lastCheckedAt = null,
  needsExternalReview = false,
  editable,
  isLoading = false,
  contentId,
  onValidateSource,
  onToggleReviewFlag,
  onMetadataChange
}: ExternalSourceSectionProps) {
  if (isLoading) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">External Source</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (!externalSourceUrl) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">External Source</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No external source linked</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">External Source</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <ExternalSourceInfo 
          url={externalSourceUrl}
          lastCheckedAt={lastCheckedAt}
          needsReview={needsExternalReview}
        />
        
        {editable && (
          <ExternalSourceControls
            contentId={contentId}
            onValidate={() => {
              if (onValidateSource) onValidateSource();
              if (onMetadataChange) onMetadataChange();
            }}
            onToggleReviewFlag={() => {
              if (onToggleReviewFlag) onToggleReviewFlag();
              if (onMetadataChange) onMetadataChange();
            }}
            needsReview={needsExternalReview}
          />
        )}
      </CardContent>
    </Card>
  );
}
