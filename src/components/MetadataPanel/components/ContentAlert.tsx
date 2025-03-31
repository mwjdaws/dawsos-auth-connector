
import React from 'react';
import { AlertCircle, FileWarning } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ContentAlertProps {
  contentId: string;
  isValidContent: boolean;
  contentExists: boolean;
}

/**
 * Displays an alert if the content ID is invalid or the content doesn't exist
 */
export const ContentAlert: React.FC<ContentAlertProps> = ({
  contentId,
  isValidContent,
  contentExists
}) => {
  // If content ID is valid and content exists, don't show alert
  if (isValidContent && contentExists) {
    return null;
  }
  
  // Invalid content ID
  if (!isValidContent) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Invalid Content ID</AlertTitle>
        <AlertDescription>
          The content ID "{contentId}" is not valid. Please provide a valid UUID.
        </AlertDescription>
      </Alert>
    );
  }
  
  // Valid content ID but content doesn't exist
  return (
    <Alert variant="warning" className="mb-4">
      <FileWarning className="h-4 w-4" />
      <AlertTitle>Content Not Found</AlertTitle>
      <AlertDescription>
        No content was found with ID "{contentId}". The content may have been deleted or may not exist.
      </AlertDescription>
    </Alert>
  );
};
