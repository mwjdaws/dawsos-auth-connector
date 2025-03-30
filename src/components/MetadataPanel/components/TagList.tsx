
/**
 * TagList Component
 * 
 * Displays a list of tags with the ability to delete them if editable.
 * Supports drag-and-drop functionality for reordering tags.
 */
import React from "react";
import { DraggableTagList } from "./DraggableTagList";
import { Tag } from "../hooks/tag-operations/types";

interface TagListProps {
  tags: Tag[];
  editable: boolean;
  onDeleteTag: (tagId: string) => void;
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
  return (
    <DraggableTagList
      tags={tags}
      editable={editable}
      onDeleteTag={onDeleteTag}
      onReorderTags={onReorderTags}
      className={className}
    />
  );
};
