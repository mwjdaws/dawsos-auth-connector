
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Tag } from "@/types/tag";

interface ManualTagTabProps {
  contentId: string;
  existingTags: Tag[];
  isLoadingTags: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  handleAddManualTag: () => void;
  handleDeleteTag: (tagId: string) => void;
  isAddingTag: boolean;
  isDeletingTag: boolean;
  isValidContent: boolean;
  editable: boolean;
  refreshTrigger: number;
  handleTagClick: (tag: string) => void;
}

export function ManualTagTab({
  contentId,
  existingTags,
  isLoadingTags,
  newTag,
  setNewTag,
  handleAddManualTag,
  handleDeleteTag,
  isAddingTag,
  isDeletingTag,
  isValidContent,
  editable,
  refreshTrigger,
  handleTagClick
}: ManualTagTabProps) {
  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Add Tag</h3>
        
        <div className="flex gap-2">
          <input
            type="text"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter tag name..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            disabled={!isValidContent || isAddingTag}
            onKeyDown={(e) => e.key === 'Enter' && handleAddManualTag()}
          />
          
          <Button 
            onClick={handleAddManualTag}
            disabled={!newTag.trim() || !isValidContent || isAddingTag}
          >
            Add Tag
          </Button>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Tags for this Content</h3>
        
        {isLoadingTags ? (
          <div className="animate-pulse space-y-2">
            <div className="h-6 w-24 bg-muted rounded"></div>
            <div className="h-6 w-32 bg-muted rounded"></div>
          </div>
        ) : existingTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {existingTags.map(tag => (
              <Badge 
                key={tag.id} 
                variant="secondary"
                className="flex items-center gap-1"
                onClick={() => handleTagClick(tag.name)}
              >
                {tag.name}
                {editable && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTag(tag.id);
                    }}
                    disabled={isDeletingTag}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No tags for this content yet</p>
        )}
      </div>
    </div>
  );
}
