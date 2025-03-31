
import { useState, useCallback } from 'react';
import { 
  DragStartEvent, 
  DragEndEvent,
  DragOverEvent,
  useDndMonitor
} from '@dnd-kit/core';
import { Tag } from '@/types/tag';
import { arrayMove } from '@dnd-kit/sortable';

/**
 * Custom hook for managing tag drag-and-drop reordering
 */
export const useTagReordering = (
  tags: Tag[], 
  onReorder: (tags: Tag[]) => void
) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);
  
  // When drag starts, set the active tag ID
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setReordering(true);
  }, []);
  
  // When drag ends, update the tag order
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Find the indices of the tags being dragged
      const activeIndex = tags.findIndex(tag => tag.id === active.id);
      const overIndex = tags.findIndex(tag => tag.id === over.id);
      
      // Only proceed if both tags were found
      if (activeIndex !== -1 && overIndex !== -1) {
        // Create a new array with the updated order
        const newTags = arrayMove(tags, activeIndex, overIndex);
        
        // Update display_order to match the array index
        const reorderedTags = newTags.map((tag, index) => {
          if (tag) {
            return { ...tag, display_order: index };
          }
          return tag;
        }).filter((tag): tag is Tag => tag !== undefined);
        
        // Call the onReorder callback with the new order
        onReorder(reorderedTags);
      }
    }
    
    setActiveId(null);
    setReordering(false);
  }, [tags, onReorder]);
  
  // Set up monitors for drag events
  useDndMonitor({
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd
  });
  
  return {
    activeId,
    reordering
  };
};
