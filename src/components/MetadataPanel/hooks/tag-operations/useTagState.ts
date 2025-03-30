
import { useState } from 'react';
import type { Tag } from '@/types';

export interface UseTagStateResult {
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}

export const useTagState = (): UseTagStateResult => {
  const [tags, setTags] = useState<Tag[]>([]);

  return {
    tags,
    setTags
  };
};
