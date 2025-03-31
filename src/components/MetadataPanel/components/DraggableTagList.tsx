
import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tag } from '../hooks/tag-operations/types';

interface DraggableTagListProps {
  tags: Tag[];
  editable: boolean;
  onDeleteTag: (tagId: string) => void;
  onReorderTags: (tags: Tag[]) => void;
}

export const DraggableTagList: React.FC<DraggableTagListProps> = ({
  tags,
  editable,
  onDeleteTag,
  onReorderTags
}) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(tags);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onReorderTags(items);
  };
  
  if (tags.length === 0) {
    return <div className="text-sm text-muted-foreground mb-2">No tags</div>;
  }
  
  const renderTag = (tag: Tag, index: number) => {
    if (!tag) return null; // Guard against undefined tags
    
    return (
      <Draggable key={tag.id} draggableId={tag.id} index={index} isDragDisabled={!editable}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="inline-block mr-2 mb-2"
          >
            <Badge 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground py-1 px-2 flex items-center"
            >
              {tag.name}
              {editable && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                  onClick={() => onDeleteTag(tag.id)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove tag</span>
                </Button>
              )}
            </Badge>
          </div>
        )}
      </Draggable>
    );
  };
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tags" direction="horizontal">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-wrap"
          >
            {tags.map((tag, index) => tag ? renderTag(tag, index) : null)}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableTagList;
