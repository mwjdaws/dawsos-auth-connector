
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, AlertTriangleIcon } from 'lucide-react';
import { ContentIdValidationResultType } from '@/utils/validation/types';

interface ContentAlertProps {
  validationResult: ContentIdValidationResultType;
  contentExists?: boolean;
}

export const ContentAlert: React.FC<ContentAlertProps> = ({ 
  validationResult,
  contentExists = true 
}) => {
  if (validationResult === ContentIdValidationResultType.VALID) {
    return null;
  }

  if (validationResult === ContentIdValidationResultType.TEMPORARY) {
    return (
      <Alert className="mb-4">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Temporary Content</AlertTitle>
        <AlertDescription>
          This is a temporary content item. Changes will be lost unless you save it.
        </AlertDescription>
      </Alert>
    );
  }

  if (validationResult === ContentIdValidationResultType.MISSING) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangleIcon className="h-4 w-4" />
        <AlertTitle>Missing Content ID</AlertTitle>
        <AlertDescription>
          No content ID provided. Metadata editing is disabled.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangleIcon className="h-4 w-4" />
      <AlertTitle>Invalid Content ID</AlertTitle>
      <AlertDescription>
        The content ID provided is invalid. Metadata editing is disabled.
      </AlertDescription>
    </Alert>
  );
};
