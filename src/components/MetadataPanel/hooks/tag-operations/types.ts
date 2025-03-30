
import { User } from '@supabase/supabase-js';

export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  type_name?: string | null;
}

export interface TagType {
  id: string;
  name: string;
}

export interface TagPosition {
  id: string;
  position: number;
}

export interface TagOperationsProps {
  contentId: string;
  user?: User | null;
  onMetadataChange?: () => void;
}

export interface UseTagStateResult {
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  newTag: string;
  setNewTag: React.Dispatch<React.SetStateAction<string>>;
}

export interface UseTagFetchResult {
  fetchTags: () => Promise<Tag[]>;
  isLoading: boolean;
  error: Error | null;
}

export interface UseTagMutationsResult {
  handleAddTag: (typeId?: string | null) => Promise<void>;
  handleDeleteTag: (tagId: string) => Promise<void>;
  isAdding: boolean;
  isDeleting: boolean;
}
