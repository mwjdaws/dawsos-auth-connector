
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { X, GripVertical } from "lucide-react";
import { Tag } from "../hooks/tag-operations/types";

interface DraggableTagListProps {
  tags: Tag[];
  editable: boolean;
  onDeleteTag: (tagId: string) => void;
  onReorderTags: (tags: Tag[]) => void;
  className?: string;
}

export const DraggableTagList: React.FC<DraggableTagListProps> = ({
  tags,
  editable,
  onDeleteTag,
  onReorderTags,
  className = ""
}) => {
  const [draggedTag, setDraggedTag] = useState<Tag | null>(null);
  
  if (tags.length === 0) {
    return <p className="text-sm text-muted-foreground">No tags available</p>;
  }
  
  const handleDragStart = (e: React.DragEvent, tag: Tag) => {
    setDraggedTag(tag);
    // Set a ghost drag image
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', tag.id);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = (e: React.DragEvent, targetTag: Tag) => {
    e.preventDefault();
    
    if (!draggedTag || draggedTag.id === targetTag.id) {
      return;
    }
    
    // Create a new array with reordered tags
    const reorderedTags = [...tags];
    const draggedTagIndex = reorderedTags.findIndex(t => t.id === draggedTag.id);
    const targetTagIndex = reorderedTags.findIndex(t => t.id === targetTag.id);
    
    // Remove the dragged tag from its position
    const [removed] = reorderedTags.splice(draggedTagIndex, 1);
    
    // Insert it at the target position
    reorderedTags.splice(targetTagIndex, 0, removed);
    
    // Update the state
    onReorderTags(reorderedTags);
    setDraggedTag(null);
  };
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <Badge 
          key={tag.id} 
          variant="secondary"
          className={`flex items-center gap-1 transition-colors ${
            draggedTag?.id === tag.id ? 'bg-primary/20' : ''
          }`}
          draggable={editable}
          onDragStart={(e) => editable && handleDragStart(e, tag)}
          onDragOver={(e) => editable && handleDragOver(e)}
          onDrop={(e) => editable && handleDrop(e, tag)}
          onDragEnd={() => setDraggedTag(null)}
        >
          {editable && (
            <span className="cursor-grab mr-1">
              <GripVertical className="h-3 w-3 text-muted-foreground" />
            </span>
          )}
          {tag.name}
          {editable && (
            <button 
              onClick={() => onDeleteTag(tag.id)}
              className="text-muted-foreground hover:text-foreground ml-1"
              aria-label={`Remove tag ${tag.name}`}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </Badge>
      ))}
    </div>
  );
}
