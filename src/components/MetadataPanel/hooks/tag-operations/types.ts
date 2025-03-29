
import { PostgrestError } from "@supabase/supabase-js";

export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string;
}

export interface TagOperationsProps {
  contentId: string;
  user: any;
  onMetadataChange?: () => void;
}

export interface UseTagStateResult {
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  newTag: string;
  setNewTag: (value: string) => void;
}

export interface UseTagFetchResult {
  fetchTags: () => Promise<Tag[]>;
  isLoading: boolean;
  error: PostgrestError | Error | null;
}

export interface UseTagMutationsResult {
  handleAddTag: () => Promise<void>;
  handleDeleteTag: (tagId: string) => Promise<void>;
}
