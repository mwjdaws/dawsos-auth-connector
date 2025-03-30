
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, InfoIcon } from 'lucide-react';

export interface ContentAlertProps {
  contentId: string;
  isValidContent: boolean;
  contentExists: boolean;
}

export function ContentAlert({ contentId, isValidContent, contentExists }: ContentAlertProps) {
  // If the content ID is not valid, show an error
  if (!isValidContent) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Invalid Content ID</AlertTitle>
        <AlertDescription>
          The provided content ID is not valid. Please check the ID and try again.
        </AlertDescription>
      </Alert>
    );
  }

  // If the content does not exist, show a warning
  if (!contentExists) {
    return (
      <Alert variant="warning">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Content Not Found</AlertTitle>
        <AlertDescription>
          The requested content could not be found. It may have been deleted or moved.
        </AlertDescription>
      </Alert>
    );
  }

  // Content is valid and exists, no alert needed
  return null;
}
