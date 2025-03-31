
/**
 * TagList Component
 * 
 * Displays a list of tags with the ability to delete them if editable.
 * Supports drag-and-drop functionality for reordering tags.
 */
import React from "react";
import { DraggableTagList } from "./DraggableTagList";
import { Tag } from "@/types/tag";

interface TagListProps {
  tags: Tag[];
  editable: boolean;
  onDeleteTag: (tagId: string) => Promise<void> | void;
  onReorderTags?: (tags: Tag[]) => void;
  className?: string;
}

export const TagList: React.FC<TagListProps> = ({
  tags,
  editable,
  onDeleteTag,
  onReorderTags = () => {},
  className = ""
}) => {
  // Create a Promise-compatible wrapper for onDeleteTag
  const handleDeleteTag = async (tagId: string): Promise<void> => {
    const result = onDeleteTag(tagId);
    if (result instanceof Promise) {
      return result;
    }
    return Promise.resolve();
  };

  return (
    <DraggableTagList
      tags={tags}
      editable={editable}
      onDeleteTag={handleDeleteTag}
      onReorderTags={onReorderTags}
      className={className}
    />
  );
};
