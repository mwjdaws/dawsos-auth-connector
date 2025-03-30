
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

export interface TagCardsErrorProps {
  error?: string;
  message?: string;
  onRetry?: () => void;
}

export function TagCardsError({ error, message, onRetry }: TagCardsErrorProps) {
  const displayMessage = message || error || "An error occurred while loading tags";
  
  return (
    <div className="space-y-4">
      {onRetry && (
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry} 
            className="flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      )}
      <Card className="mt-2">
        <CardContent className="p-6">
          <div className="text-red-500">{displayMessage}</div>
        </CardContent>
      </Card>
    </div>
  );
}
