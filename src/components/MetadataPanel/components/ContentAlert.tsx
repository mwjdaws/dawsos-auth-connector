
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ContentAlertProps {
  contentId: string;
  isValidContent: boolean;
  contentExists?: boolean;
}

/**
 * Alerts shown when content is invalid or missing
 */
export function ContentAlert({ contentId, isValidContent, contentExists = false }: ContentAlertProps) {
  if (isValidContent && contentExists) {
    return null;
  }
  
  // Temporary ID case
  const isTempId = contentId?.startsWith('temp-');
  
  // Content not found case
  const isValidButNotFound = isValidContent && !contentExists && !isTempId;
  
  // Invalid content ID case
  const isInvalidContentId = !isValidContent && !isTempId;
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>
        {isTempId ? "Temporary Content" : isValidButNotFound ? "Content Not Found" : "Invalid Content ID"}
      </AlertTitle>
      <AlertDescription className="mt-2">
        {isTempId ? (
          <div className="space-y-2">
            <p>This is temporary content that hasn't been saved yet.</p>
            <p>Save your content to access all features.</p>
          </div>
        ) : isValidButNotFound ? (
          <div className="space-y-2">
            <p>The content with ID <code className="text-xs p-1 bg-muted">{contentId}</code> was not found.</p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/">Return Home</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/content/create">Create New</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p>Invalid content ID format: <code className="text-xs p-1 bg-muted">{contentId}</code></p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/">Return Home</Link>
              </Button>
            </div>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
