
import { useState } from 'react';
import { Tag } from './types';

export function useTagState() {
  const [tags, setTags] = useState<Tag[]>([]);
  
  return {
    tags,
    setTags
  };
}
