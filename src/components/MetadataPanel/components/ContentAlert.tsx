
import React from 'react';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ContentAlertProps {
  contentId: string;
  isValidContent: boolean;
  contentExists: boolean;
}

/**
 * Displays an appropriate alert message based on content validation status
 */
export const ContentAlert: React.FC<ContentAlertProps> = ({
  contentId,
  isValidContent,
  contentExists
}) => {
  // Invalid content ID format
  if (!isValidContent) {
    return (
      <Alert variant="destructive" className="mt-2">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Invalid Content ID</AlertTitle>
        <AlertDescription>
          The content ID "{contentId}" is not in a valid format.
        </AlertDescription>
      </Alert>
    );
  }
  
  // Valid format but content doesn't exist
  if (!contentExists) {
    return (
      <Alert variant="warning" className="mt-2">
        <Info className="h-4 w-4" />
        <AlertTitle>Content Not Found</AlertTitle>
        <AlertDescription>
          The content with ID "{contentId}" was not found in the database.
        </AlertDescription>
      </Alert>
    );
  }
  
  // If both valid and exists, no alert needed
  return null;
};
