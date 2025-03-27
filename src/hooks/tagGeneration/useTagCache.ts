
import { useRef, useCallback } from "react";
import { CachedTagResult } from "./types";

/**
 * Hook for caching tag generation results
 */
export function useTagCache() {
  const previousResultRef = useRef<CachedTagResult | null>(null);

  const checkCache = useCallback((text: string): CachedTagResult | null => {
    // Check cache for the exact same text
    if (previousResultRef.current && previousResultRef.current.text === text) {
      return previousResultRef.current;
    }
    return null;
  }, []);

  const updateCache = useCallback((text: string, contentId: string, tags: string[]): void => {
    // Store in cache
    previousResultRef.current = {
      text,
      contentId,
      tags
    };
  }, []);

  const clearCache = useCallback((): void => {
    previousResultRef.current = null;
  }, []);

  return { 
    checkCache, 
    updateCache,
    clearCache 
  };
}
