
/**
 * TagsSection Component
 * 
 * This is a wrapper component that maintains compatibility with the old API
 * while leveraging the new component from sections/TagsSection.tsx
 */
import React from "react";
import { TagsSection as TagsSectionCore } from "./sections/TagsSection";
import { Tag } from "@/types/tag";

export interface TagsSectionProps {
  tags: Tag[];
  contentId: string;
  editable: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: (typeId?: string | null) => Promise<void>;
  onDeleteTag: (tagId: string) => Promise<void>;
  onMetadataChange?: () => void;
  className?: string;
}

export const TagsSection: React.FC<TagsSectionProps> = (props) => {
  return <TagsSectionCore {...props} />;
};

export default TagsSection;
