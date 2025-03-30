
import { supabase } from "@/integrations/supabase/client";

// Update the SaveTagsResult type to be compatible with both implementations
export type SaveTagsResult = string | boolean | { success: boolean; contentId?: string; message?: string };

export interface SaveTagsOptions {
  contentId?: string;
  skipGenerateFunction?: boolean;
  maxRetries?: number;
}

// Cache data structure
export interface PreviousData {
  options: SaveTagsOptions;
  tags: string[];
  result: SaveTagsResult;
}

export interface BatchInsertResult {
  success: boolean;
  count: number;
  error?: any;
}
