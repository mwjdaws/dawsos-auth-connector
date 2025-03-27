
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface TagSaveButtonProps {
  isSaving: boolean;
  tags: string[];
  isUserLoggedIn: boolean;
  onSaveTags: () => void;
}

export function TagSaveButton({ 
  isSaving, 
  tags, 
  isUserLoggedIn, 
  onSaveTags 
}: TagSaveButtonProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <Button
      onClick={onSaveTags}
      disabled={isSaving || tags.length === 0 || !isUserLoggedIn}
      variant="outline"
    >
      {isSaving ? "Saving..." : (
        <span className="flex items-center gap-1">
          <Save className="h-4 w-4" />
          Save Tags
        </span>
      )}
    </Button>
  );
}
