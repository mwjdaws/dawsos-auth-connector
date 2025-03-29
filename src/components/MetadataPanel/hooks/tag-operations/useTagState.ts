
import { useState } from "react";
import { Tag, UseTagStateResult } from "./types";

export function useTagState(): UseTagStateResult {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState("");

  return {
    tags,
    setTags,
    newTag,
    setNewTag
  };
}
