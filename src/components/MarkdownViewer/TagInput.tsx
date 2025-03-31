
import React, { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface TagInputProps {
  onAddTag: () => void;
  newTag: string;
  setNewTag: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
}

export function TagInput({
  onAddTag,
  newTag,
  setNewTag,
  placeholder = "Add a tag",
  maxLength = 50,
  disabled = false,
  "aria-label": ariaLabel = "Add a tag",
  className = ""
}: TagInputProps) {
  // Handle enter key to add tag
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim() !== '' && !disabled) {
      e.preventDefault();
      onAddTag();
    }
  };

  // Handle add tag button click
  const handleAddClick = () => {
    if (newTag.trim() !== '' && !disabled) {
      onAddTag();
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Input
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        disabled={disabled}
        className="flex-1"
      />
      <Button 
        onClick={handleAddClick} 
        size="sm" 
        disabled={newTag.trim() === '' || disabled}
        variant="outline"
        type="button"
        aria-label="Add tag"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
