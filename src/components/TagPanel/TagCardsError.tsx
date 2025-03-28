
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

interface TagCardsErrorProps {
  error: string;
  onRetry: () => void;
}

export function TagCardsError({ error, onRetry }: TagCardsErrorProps) {
  return (
    <div className="space-y-4">
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
      <Card className="mt-2">
        <CardContent className="p-6">
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    </div>
  );
}
