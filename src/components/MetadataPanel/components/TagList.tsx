
import React from 'react';
import { cn } from '@/lib/utils';
import { Tag } from '@/types/tag';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface TagItemProps {
  tag: Tag;
  editable: boolean;
  onDelete: (tagId: string) => void;
}

export function TagItem({ tag, editable, onDelete }: TagItemProps) {
  const { id, name } = tag;
  
  return (
    <Badge className="mr-2 mb-2" variant="secondary">
      {name}
      {editable && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(id)}
          className="h-4 w-4 ml-1 p-0 hover:bg-transparent"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </Badge>
  );
}

export interface SortableTagItemProps extends TagItemProps {
  id: string;
}

export function SortableTagItem({ tag, editable, onDelete }: SortableTagItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: tag.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style}
      {...attributes} 
      {...listeners}
      className="inline-block"
    >
      <TagItem tag={tag} editable={editable} onDelete={onDelete} />
    </div>
  );
}

export interface TagListProps {
  tags: Tag[];
  editable: boolean;
  onDeleteTag: (tagId: string) => void;
  onReorderTags?: (tags: Tag[]) => Promise<void>;
  className?: string;
}

export function TagList({ 
  tags, 
  editable, 
  onDeleteTag,
  onReorderTags,
  className 
}: TagListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id && onReorderTags) {
      const activeIndex = tags.findIndex(tag => tag.id === active.id);
      const overIndex = tags.findIndex(tag => tag.id === over.id);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        const newTags = arrayMove(tags, activeIndex, overIndex);
        onReorderTags(newTags);
      }
    }
  };
  
  if (!tags || tags.length === 0) {
    return (
      <div className={cn("text-sm text-muted-foreground mt-1", className)}>
        No tags added yet
      </div>
    );
  }
  
  if (editable && onReorderTags) {
    return (
      <div className={cn("flex flex-wrap", className)}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tags.map(tag => tag.id)}
            strategy={verticalListSortingStrategy}
          >
            {tags.map(tag => (
              <SortableTagItem
                key={tag.id}
                id={tag.id}
                tag={tag}
                editable={editable}
                onDelete={onDeleteTag}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    );
  }
  
  return (
    <div className={cn("flex flex-wrap", className)}>
      {tags.map(tag => (
        <TagItem 
          key={tag.id} 
          tag={tag} 
          editable={editable}
          onDelete={onDeleteTag}
        />
      ))}
    </div>
  );
}
