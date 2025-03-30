
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

interface TagCardsEmptyProps {
  onRefresh?: () => void;
  message?: string;
}

export function TagCardsEmpty({ onRefresh, message = "No tags found. Generate and save some tags to see them here." }: TagCardsEmptyProps) {
  return (
    <div className="space-y-4">
      {onRefresh && (
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh} 
            className="flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      )}
      <Card className="mt-2">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4 py-4">
            <p className="text-center text-muted-foreground">
              {message}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
