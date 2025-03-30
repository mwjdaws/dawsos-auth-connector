
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon, InformationCircleIcon } from "@radix-ui/react-icons";
import { ContentIdValidationResult } from "@/utils/validation";

interface ContentAlertProps {
  contentId: string;
  validationResult: ContentIdValidationResult;
  contentExists: boolean;
}

export const ContentAlert: React.FC<ContentAlertProps> = ({
  contentId,
  validationResult,
  contentExists
}) => {
  if (!contentId) {
    return (
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>No Content ID</AlertTitle>
        <AlertDescription>
          No content ID was provided. Please specify a valid content ID.
        </AlertDescription>
      </Alert>
    );
  }

  if (!validationResult.isValid) {
    return (
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Invalid Content ID</AlertTitle>
        <AlertDescription>
          {validationResult.message || "The provided content ID is not valid."}
        </AlertDescription>
      </Alert>
    );
  }

  if (!contentExists) {
    return (
      <Alert>
        <InformationCircleIcon className="h-4 w-4" />
        <AlertTitle>Content Not Found</AlertTitle>
        <AlertDescription>
          Content with ID "{contentId}" does not exist in the database.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
