
/**
 * Type definitions for tag generation functionality
 */

export interface TagGenerationOptions {
  maxRetries?: number;
  retryDelay?: number;
}

export interface TagGenerationState {
  tags: string[];
  isLoading: boolean;
  contentId: string;
  retryCount: number;
}

export interface TagGenerationAPI extends TagGenerationState {
  setTags: (tags: string[]) => void;
  setContentId: (id: string) => void;
  handleGenerateTags: (text: string) => Promise<string | undefined>;
  resetRetryCount: () => void;
}

export interface CachedTagResult {
  text: string;
  contentId: string;
  tags: string[];
}
