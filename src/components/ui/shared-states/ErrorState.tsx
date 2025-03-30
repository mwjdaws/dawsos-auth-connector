
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: Error | string | null;
  title?: string;
  retry?: () => void;
  className?: string;
}

/**
 * Unified error state component that can be used across the application
 * Supports retry functionality and customizable error messages
 */
export function ErrorState({ 
  error, 
  title = "An error occurred", 
  retry,
  className = ""
}: ErrorStateProps) {
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string' 
      ? error 
      : "Unknown error";

  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        {errorMessage}
        
        {retry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={retry} 
            className="ml-auto mt-2 block"
          >
            Try again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
