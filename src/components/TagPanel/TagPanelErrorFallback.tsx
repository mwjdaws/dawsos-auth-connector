
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface TagPanelErrorFallbackProps {
  error?: Error;
  onRetry?: () => void;
}

export function TagPanelErrorFallback({
  error,
  onRetry
}: TagPanelErrorFallbackProps) {
  return (
    <Card className="w-full border-destructive/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-4 w-4" />
          Tag Management Error
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {error?.message || "An error occurred while loading tags. Please try again."}
        </p>
      </CardContent>
      {onRetry && (
        <CardFooter>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            className="w-full"
          >
            Retry
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
