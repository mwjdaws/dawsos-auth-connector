
import { supabase } from "@/integrations/supabase/client";

export type SaveTagsResult = string | false;

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
