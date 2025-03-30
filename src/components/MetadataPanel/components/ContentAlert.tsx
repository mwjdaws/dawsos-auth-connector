
/**
 * ContentAlert Component
 * 
 * Displays appropriate alert messages based on content ID validation results
 * and existence status.
 */
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { ContentIdValidationResult } from "@/utils/content-validation";

interface ContentAlertProps {
  contentValidationResult: ContentIdValidationResult;
  contentExists: boolean;
}

export const ContentAlert: React.FC<ContentAlertProps> = ({
  contentValidationResult,
  contentExists
}) => {
  switch (contentValidationResult) {
    case ContentIdValidationResult.MISSING:
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No content ID provided. Metadata cannot be loaded.
          </AlertDescription>
        </Alert>
      );
    case ContentIdValidationResult.TEMPORARY:
      return (
        <Alert variant="warning" className="border-yellow-400 dark:border-yellow-600">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Save the note before editing metadata. This is a temporary note.
          </AlertDescription>
        </Alert>
      );
    case ContentIdValidationResult.INVALID:
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Invalid content ID format. Metadata cannot be loaded.
          </AlertDescription>
        </Alert>
      );
    default:
      if (!contentExists) {
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Content not found in database. Please save the note first.
            </AlertDescription>
          </Alert>
        );
      }
      return null;
  }
};

export default ContentAlert;
