
import { useState } from "react";
import { Tag } from "../types";
import { TagPosition } from "@/utils/validation/types";

interface UseTagReorderingProps {
  tags: Tag[];
  onSaveOrder?: (positions: TagPosition[]) => Promise<void>;
}

export function useTagReordering({ tags, onSaveOrder }: UseTagReorderingProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [orderedTags, setOrderedTags] = useState<Tag[]>(tags);

  // Reset orderedTags when tags prop changes
  if (tags !== orderedTags && !isSaving) {
    setOrderedTags(tags);
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }
    
    const oldIndex = orderedTags.findIndex(tag => tag.id === active.id);
    const newIndex = orderedTags.findIndex(tag => tag.id === over.id);
    
    if (oldIndex === -1 || newIndex === -1) {
      return;
    }
    
    const newOrderedTags = [...orderedTags];
    const [removed] = newOrderedTags.splice(oldIndex, 1);
    newOrderedTags.splice(newIndex, 0, removed);
    
    setOrderedTags(newOrderedTags);
  };
  
  const saveOrder = async () => {
    if (!onSaveOrder) return;
    
    const positions: TagPosition[] = orderedTags.map((tag, index) => ({
      id: tag.id,
      position: index
    }));
    
    setIsSaving(true);
    try {
      await onSaveOrder(positions);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleReorderComplete = () => {
    if (onSaveOrder) {
      saveOrder();
    }
  };
  
  return {
    orderedTags,
    setOrderedTags,
    handleDragEnd,
    handleReorderComplete,
    isSaving
  };
}

export default useTagReordering;
