import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, Edit } from "lucide-react";

interface InlineEditableFieldProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  placeholder?: string;
  editable?: boolean;
  label?: string;
  className?: string;
}

export const InlineEditableField: React.FC<InlineEditableFieldProps> = ({
  value,
  onSave,
  placeholder = "Enter a value...",
  editable = true,
  label,
  className = ""
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  
  useEffect(() => {
    // Update local state when the external value changes
    setInputValue(value || "");
  }, [value]);
  
  const handleEdit = () => {
    if (editable) {
      setIsEditing(true);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setInputValue(value || "");
  };
  
  const handleSave = async () => {
    if (inputValue.trim() === value) {
      setIsEditing(false);
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave(inputValue.trim());
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving value:", error);
      // Keep editing mode active on error
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };
  
  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      
      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            disabled={isSaving}
            className="flex-1"
          />
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleSave}
            disabled={isSaving}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleCancel}
            disabled={isSaving}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          className={`flex items-center rounded-md border px-3 py-2 text-sm ${
            editable ? 'hover:bg-accent hover:text-accent-foreground cursor-pointer' : ''
          }`}
          onClick={handleEdit}
        >
          <span className="flex-1 truncate">
            {value || <span className="text-muted-foreground">{placeholder}</span>}
          </span>
          {editable && (
            <Edit className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      )}
    </div>
  );
}
