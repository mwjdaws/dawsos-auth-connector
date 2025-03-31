
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Tag } from "@/types/tag";

interface SortableTagProps {
  tag: Tag;
  onDelete: (id: string) => void;
  editable: boolean;
}

const SortableTag: React.FC<SortableTagProps> = ({ tag, onDelete, editable }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: tag.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Badge variant="secondary" className="m-1 px-3 py-1.5">
        {tag.name}
        {editable && (
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-2 hover:bg-destructive/10 hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(tag.id);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </Badge>
    </div>
  );
};

interface DraggableTagListProps {
  tags: Tag[];
  editable: boolean;
  onDeleteTag: (id: string) => Promise<void>;
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
  // Safe handling of non-existent tags
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = tags.findIndex(tag => tag.id === active.id);
      const newIndex = tags.findIndex(tag => tag.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newTags = arrayMove(tags, oldIndex, newIndex);
        onReorderTags(newTags);
      }
    }
  };

  if (tags.length === 0) {
    return <div className="text-sm text-muted-foreground">No tags</div>;
  }

  return (
    <div className={`flex flex-wrap ${className}`}>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tags.map(tag => tag.id)} strategy={verticalListSortingStrategy}>
          {tags.map(tag => (
            <SortableTag key={tag.id} tag={tag} onDelete={onDeleteTag} editable={editable} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};
