
import React from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus } from "lucide-react";
import { DraggableTagList } from '../components/DraggableTagList';
import { ValidationResult, TagPosition } from '@/utils/validation/types';

// Define the Tag interface here if it's not imported
interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string | null;
}

interface TagsSectionProps {
  tags: Tag[];
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: () => void;
  onDeleteTag: (id: string) => void;
  isAddingTag: boolean;
  isDeletingTag: boolean;
  isReordering: boolean;
  editable?: boolean;
  error?: Error | null;
  handleReorderTags?: (positions: TagPosition[]) => Promise<void>;
}

export const TagsSection: React.FC<TagsSectionProps> = ({
  tags,
  newTag,
  setNewTag,
  onAddTag,
  onDeleteTag,
  isAddingTag,
  isDeletingTag,
  isReordering,
  editable = false,
  error = null,
  handleReorderTags
}) => {
  // Add tag on Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddTag();
    }
  };

  // Create a wrapper for the tag reordering function that adapts the interface
  const handleReorder = handleReorderTags ? (updatedTags: Tag[]) => {
    // Convert Tags array to TagPosition array
    const positions: TagPosition[] = updatedTags.map((tag, index) => ({
      id: tag.id,
      position: index
    }));
    
    return handleReorderTags(positions);
  } : undefined;

  const renderError = () => {
    if (!error) return null;
    
    return (
      <Alert variant="destructive" className="mt-2">
        <AlertDescription>
          {error.message}
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-sm">Tags</h3>
      
      {editable && (
        <div className="flex space-x-2 mb-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a tag..."
              className="w-full px-3 py-2 border rounded-md text-sm"
              disabled={isAddingTag}
            />
            {isAddingTag && (
              <div className="absolute right-2 top-2">
                <Spinner size="sm" />
              </div>
            )}
          </div>
          <button
            onClick={onAddTag}
            disabled={isAddingTag || !newTag.trim()}
            className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {renderError()}
      
      <DraggableTagList
        tags={tags}
        onDelete={onDeleteTag}
        onReorder={handleReorder}
        isDraggable={editable && !isReordering}
        isDeleting={isDeletingTag}
      />
    </div>
  );
};
