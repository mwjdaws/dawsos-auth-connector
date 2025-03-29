
/**
 * useGraphRenderStyles Hook
 * 
 * Custom hook for managing graph rendering styles.
 * Provides consistent styling for the force-directed graph.
 */
import { useMemo } from 'react';

export function useGraphRenderStyles() {
  const graphStyles = useMemo(() => {
    return {
      emptyStateStyle: "flex items-center justify-center h-[300px]",
      emptyStateText: "text-muted-foreground"
    };
  }, []);
  
  return graphStyles;
}
