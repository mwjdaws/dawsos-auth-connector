
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, RefreshCw, Check, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export interface ExternalSourceSectionProps {
  contentId: string;
  externalSource?: {
    external_source_url: string | null;
    needs_external_review: boolean;
    external_source_checked_at: string | null;
  };
  editable: boolean;
  isLoading?: boolean;
  onUpdateExternalSourceUrl?: (url: string) => Promise<any>;
  onCheckExternalSource?: () => Promise<any>;
}

export function ExternalSourceSection({
  contentId,
  externalSource,
  editable,
  isLoading = false,
  onUpdateExternalSourceUrl,
  onCheckExternalSource
}: ExternalSourceSectionProps) {
  const [newUrl, setNewUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isCheckingSource, setIsCheckingSource] = useState(false);
  const [isUpdatingUrl, setIsUpdatingUrl] = useState(false);

  const externalSourceUrl = externalSource?.external_source_url || '';
  const needsExternalReview = externalSource?.needs_external_review || false;
  const lastCheckedAt = externalSource?.external_source_checked_at || null;

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUrl(e.target.value);
  };

  const handleSaveUrl = async () => {
    if (!onUpdateExternalSourceUrl) return;
    
    setIsUpdatingUrl(true);
    try {
      await onUpdateExternalSourceUrl(newUrl);
      setIsEditing(false);
    } finally {
      setIsUpdatingUrl(false);
    }
  };

  const handleCheckExternalSource = async () => {
    if (!onCheckExternalSource) return;
    
    setIsCheckingSource(true);
    try {
      await onCheckExternalSource();
    } finally {
      setIsCheckingSource(false);
    }
  };

  const handleStartEdit = () => {
    setNewUrl(externalSourceUrl || '');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">External Source</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-8 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">External Source</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-2">
            <Input
              placeholder="Enter external source URL"
              value={newUrl}
              onChange={handleUrlChange}
              disabled={isUpdatingUrl}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSaveUrl}
                disabled={isUpdatingUrl}
              >
                {isUpdatingUrl ? "Saving..." : "Save"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelEdit}
                disabled={isUpdatingUrl}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : externalSourceUrl ? (
          <>
            <div className="text-sm mb-2 break-all flex items-start gap-2">
              <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <a
                href={externalSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {externalSourceUrl}
              </a>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {editable && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleStartEdit}
                >
                  Edit URL
                </Button>
              )}
              {editable && onCheckExternalSource && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCheckExternalSource}
                  disabled={isCheckingSource}
                >
                  {isCheckingSource ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Check for Updates
                </Button>
              )}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {lastCheckedAt ? (
                <>
                  Last checked: {formatDistanceToNow(new Date(lastCheckedAt), { addSuffix: true })}
                  {needsExternalReview && (
                    <Badge className="ml-2 bg-amber-500">Updates Available</Badge>
                  )}
                </>
              ) : (
                "Not checked yet"
              )}
            </div>
          </>
        ) : (
          <>
            <div className="text-sm text-muted-foreground mb-3">
              No external source URL specified
            </div>
            {editable && (
              <Button size="sm" variant="outline" onClick={handleStartEdit}>
                Add URL
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
