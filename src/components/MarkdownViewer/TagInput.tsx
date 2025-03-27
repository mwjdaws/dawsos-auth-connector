
import React, { KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TagInputProps {
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: () => void;
}

export function TagInput({ newTag, setNewTag, onAddTag }: TagInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      onAddTag();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a tag..."
        className="flex-1"
      />
      <Button 
        onClick={onAddTag} 
        disabled={!newTag.trim()} 
        size="sm"
        variant="outline"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
