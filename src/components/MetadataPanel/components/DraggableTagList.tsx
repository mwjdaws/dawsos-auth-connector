
import React from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Tag } from "@/components/MetadataPanel/hooks/tag-operations/types";

interface DraggableTagListProps {
  tags: Tag[];
  onDeleteTag?: (id: string) => Promise<void>;
  onReorderTags?: (reorderedTags: Tag[]) => void;
  editable?: boolean;
}

export const DraggableTagList: React.FC<DraggableTagListProps> = ({
  tags,
  onDeleteTag,
  onReorderTags,
  editable = false,
}) => {
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("tagIndex", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    const dragIndex = parseInt(e.dataTransfer.getData("tagIndex"), 10);
    
    if (dragIndex === dropIndex) return;
    
    const reorderedTags = [...tags];
    const draggedItem = reorderedTags[dragIndex];
    
    // Remove the dragged item and insert it at the drop index
    reorderedTags.splice(dragIndex, 1);
    reorderedTags.splice(dropIndex, 0, draggedItem);
    
    if (onReorderTags) {
      onReorderTags(reorderedTags);
    }
  };

  const handleDelete = async (tagId: string) => {
    if (onDeleteTag) {
      await onDeleteTag(tagId);
    }
  };

  // Safely handle tag access
  const safeRenderTag = (tag: Tag | undefined, index: number) => {
    if (!tag) return null;
    
    return (
      <div
        key={tag.id}
        draggable={editable}
        onDragStart={(e) => handleDragStart(e, index)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, index)}
        className={`inline-block mb-2 mr-2 ${editable ? "cursor-grab" : ""}`}
      >
        <Badge variant="outline" className="px-3 py-1 select-none bg-muted/40">
          {tag.name}
          {editable && onDeleteTag && (
            <button
              type="button"
              onClick={() => handleDelete(tag.id)}
              className="ml-2 text-muted-foreground hover:text-destructive transition-colors focus:outline-none"
              aria-label={`Delete ${tag.name} tag`}
            >
              <X size={14} />
            </button>
          )}
        </Badge>
      </div>
    );
  };

  if (!tags.length) {
    return (
      <p className="text-sm text-muted-foreground">No tags available</p>
    );
  }

  return (
    <div className="flex flex-wrap">
      {tags.map((tag, index) => safeRenderTag(tag, index))}
    </div>
  );
};
