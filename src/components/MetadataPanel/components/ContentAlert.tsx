
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon, InfoCircledIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { ContentIdValidationResultType } from '@/utils/validation/types';
import { validateContentId } from '@/utils/validation/contentIdValidation';

export interface ContentAlertProps {
  contentId: string;
  isValidContent: boolean;
  contentExists: boolean;
  validationResult?: string;
}

export const ContentAlert: React.FC<ContentAlertProps> = ({
  contentId,
  isValidContent,
  contentExists,
  validationResult
}) => {
  const result = validateContentId(contentId);
  
  if (result.result === ContentIdValidationResultType.Temporary || 
      result.resultType === ContentIdValidationResultType.Temporary) {
    return (
      <Alert className="mb-4 bg-amber-50 text-amber-800 border-amber-200">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Temporary Content</AlertTitle>
        <AlertDescription>
          This content is temporary and will not be saved permanently. You need to save or publish to create permanent content.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (result.result === ContentIdValidationResultType.Missing || 
      result.resultType === ContentIdValidationResultType.Missing) {
    return (
      <Alert className="mb-4 bg-red-50 text-red-800 border-red-200">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Missing Content ID</AlertTitle>
        <AlertDescription>
          No content ID was provided. Please specify a valid content ID.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!isValidContent || 
      result.result === ContentIdValidationResultType.Invalid || 
      result.resultType === ContentIdValidationResultType.Invalid) {
    return (
      <Alert className="mb-4 bg-red-50 text-red-800 border-red-200">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Invalid Content ID</AlertTitle>
        <AlertDescription>
          The content ID provided is invalid or malformed.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!contentExists) {
    return (
      <Alert className="mb-4 bg-amber-50 text-amber-800 border-amber-200">
        <InfoCircledIcon className="h-4 w-4" />
        <AlertTitle>Content Not Found</AlertTitle>
        <AlertDescription>
          No content was found with the provided ID.
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

export default ContentAlert;
