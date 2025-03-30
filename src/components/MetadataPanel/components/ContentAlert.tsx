
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';
import { ContentIdValidationResult } from '@/utils/validation';

interface ContentAlertProps {
  contentId: string;
  validationResult: ContentIdValidationResult;
}

export const ContentAlert: React.FC<ContentAlertProps> = ({ contentId, validationResult }) => {
  if (validationResult === ContentIdValidationResult.VALID) {
    return null;
  }

  if (validationResult === ContentIdValidationResult.TEMPORARY) {
    return (
      <Alert variant="warning" className="mb-4">
        <Info className="h-4 w-4" />
        <AlertTitle>Temporary Content</AlertTitle>
        <AlertDescription>
          This content has a temporary ID ({contentId}). It will be assigned a permanent ID when saved.
        </AlertDescription>
      </Alert>
    );
  }

  if (validationResult === ContentIdValidationResult.MISSING) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Missing Content ID</AlertTitle>
        <AlertDescription>
          No content ID was provided. Metadata operations are disabled.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Invalid Content ID</AlertTitle>
      <AlertDescription>
        The content ID ({contentId}) is invalid. Metadata operations are disabled.
      </AlertDescription>
    </Alert>
  );
};
