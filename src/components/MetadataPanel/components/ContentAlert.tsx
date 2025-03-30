
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { getContentIdValidationResult, ContentIdValidationResultType } from "@/utils/validation/contentIdValidation";

interface ContentAlertProps {
  contentId: string;
  className?: string;
}

export const ContentAlert: React.FC<ContentAlertProps> = ({ contentId, className }) => {
  const validationResult = getContentIdValidationResult(contentId);
  
  if (validationResult.resultType === ContentIdValidationResultType.TEMPORARY) {
    return (
      <Alert variant="warning" className={className}>
        <InfoCircledIcon className="h-4 w-4" />
        <AlertTitle>Temporary Content</AlertTitle>
        <AlertDescription>
          This content has a temporary ID and might not be permanently stored.
          Save or publish to create a permanent record.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (validationResult.resultType === ContentIdValidationResultType.INVALID) {
    return (
      <Alert variant="destructive" className={className}>
        <InfoCircledIcon className="h-4 w-4" />
        <AlertTitle>Invalid Content ID</AlertTitle>
        <AlertDescription>
          The content ID is invalid. Some features may not work correctly.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (validationResult.resultType === ContentIdValidationResultType.MISSING) {
    return (
      <Alert variant="destructive" className={className}>
        <InfoCircledIcon className="h-4 w-4" />
        <AlertTitle>Missing Content ID</AlertTitle>
        <AlertDescription>
          The content ID is missing. Some features may not work correctly.
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

export default ContentAlert;
