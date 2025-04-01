
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useTagValidator } from '../hooks/useTagValidator';
import { toast } from '@/hooks/use-toast';
import { Tag } from '@/types/tag';

interface ManualTagCreatorProps {
  contentId: string;
  onTagCreated: () => void;
  isAdding?: boolean;
  existingTags?: Tag[];
  isValidContent?: boolean;
}

export function ManualTagCreator({
  contentId,
  onTagCreated,
  isAdding = false,
  existingTags = [],
  isValidContent = true
}: ManualTagCreatorProps) {
  const [newTag, setNewTag] = useState('');
  const { validateTag } = useTagValidator();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTag.trim()) {
      return;
    }
    
    if (!isValidContent) {
      toast({
        title: "Cannot Add Tag",
        description: "You need to save the content first before adding tags",
        variant: "destructive",
      });
      return;
    }
    
    const validation = validateTag(newTag, {
      minLength: 1,
      maxLength: 50
    });
    
    if (!validation.isValid) {
      toast({
        title: "Invalid Tag",
        description: validation.errorMessage || "Invalid tag format",
        variant: "destructive",
      });
      return;
    }
    
    // Check for duplicates if existingTags is provided
    if (existingTags && existingTags.length > 0) {
      const isDuplicate = existingTags.some(
        tag => tag.name.toLowerCase() === newTag.trim().toLowerCase()
      );
      
      if (isDuplicate) {
        toast({
          title: "Duplicate Tag",
          description: "This tag already exists for this content",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Proceed with tag creation (handled by parent through onCreateTag)
    onTagCreated();
    setNewTag('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <Input
        type="text"
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        placeholder="Add a new tag..."
        className="flex-1"
        disabled={isAdding || !isValidContent}
      />
      <Button 
        type="submit" 
        size="sm" 
        variant="default"
        disabled={isAdding || !newTag.trim() || !isValidContent}
      >
        {isAdding ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <PlusCircle className="h-4 w-4 mr-1" />
        )}
        Add
      </Button>
    </form>
  );
}
