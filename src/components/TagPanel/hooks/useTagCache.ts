
import { useRef, useCallback } from "react";
import { isEqual } from "lodash";
import { PreviousData, SaveTagsOptions, SaveTagsResult } from "./types";

export function useTagCache() {
  const previousData = useRef<PreviousData | null>(null);

  const checkCache = useCallback((
    tags: string[],
    options: SaveTagsOptions
  ): SaveTagsResult | null => {
    // Enhanced memoization with deep equality check to prevent unnecessary API calls
    if (
      previousData.current && 
      isEqual(previousData.current.options, options) &&
      isEqual(previousData.current.tags, tags)
    ) {
      console.log('Using cached result from previous identical call');
      return previousData.current.result;
    }
    
    return null;
  }, []);

  const updateCache = useCallback((
    tags: string[],
    options: SaveTagsOptions,
    result: SaveTagsResult
  ): void => {
    // Store result for memoization with defensive copying to avoid reference issues
    previousData.current = {
      options: { ...options },
      tags: [...tags],
      result
    };
  }, []);

  return { 
    checkCache, 
    updateCache,
    clearCache: () => { previousData.current = null; }
  };
}
