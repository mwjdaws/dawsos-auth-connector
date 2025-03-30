
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function TemporaryContentAlert() {
  return (
    <Alert className="border-yellow-400 dark:border-yellow-600 mb-4">
      <Info className="h-4 w-4" />
      <AlertDescription>
        Save the note before adding tags. This is a temporary note.
      </AlertDescription>
    </Alert>
  );
}
