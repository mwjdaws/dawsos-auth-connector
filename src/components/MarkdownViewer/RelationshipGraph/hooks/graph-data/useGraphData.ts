
/**
 * useGraphData Hook
 * 
 * This custom hook is responsible for fetching and constructing the graph data
 * from multiple Supabase tables. It combines useGraphState and useFetchGraphData
 * to provide a complete graph data management solution.
 * 
 * Performance optimizations:
 * - Debounced fetching
 * - Cache validation
 * - Error categorization
 */
import { useCallback, useEffect, useRef } from 'react';
import { GraphData } from '../../types';
import { withErrorHandling } from '@/utils/errors';
import { toast } from '@/hooks/use-toast';
import { useGraphState } from './useGraphState';
import { useFetchGraphData } from './useFetchGraphData';

export function useGraphData(startingNodeId?: string) {
  const { graphData, loading, error, setGraphData, setLoading, setError } = useGraphState();
  const { fetchAndProcessGraphData } = useFetchGraphData();
  const isMounted = useRef(true);
  const lastFetchTime = useRef<number>(0);
  const fetchAttempts = useRef<number>(0);
  const maxRetries = 3;
  
  /**
   * Fetches graph data from Supabase and constructs the graph structure
   * This function aggregates data from multiple tables to build a complete
   * representation of the knowledge network.
   */
  const fetchGraphData = useCallback(async () => {
    // Prevent excessive re-fetching and double fetches
    const now = Date.now();
    if (now - lastFetchTime.current < 2000) return; // Throttle to prevent rapid re-fetches
    
    lastFetchTime.current = now;
    setLoading(true);
    setError(null);
    
    try {
      fetchAttempts.current += 1;
      
      const { data, error: fetchError } = await fetchAndProcessGraphData(startingNodeId);
      
      // Check for component unmount before updating state
      if (!isMounted.current) {
        console.log("Component unmounted, skipping state update");
        return;
      }
      
      // Reset fetch attempts on successful fetch
      fetchAttempts.current = 0;
      
      if (fetchError) {
        setError(fetchError);
        setGraphData({ nodes: [], links: [] });
      } else if (data) {
        setGraphData(data);
      }
    } catch (err) {
      console.error('Error in fetchGraphData:', err);
      
      if (isMounted.current) {
        setError('An unexpected error occurred while fetching graph data');
        
        // Retry automatically if below max attempts
        if (fetchAttempts.current <= maxRetries) {
          console.log(`Retry attempt ${fetchAttempts.current} of ${maxRetries}`);
          toast({
            title: "Loading graph data failed",
            description: "Retrying automatically...",
            variant: "destructive",
          });
          
          // Retry with exponential backoff
          setTimeout(() => {
            if (isMounted.current) {
              fetchGraphData();
            }
          }, Math.min(1000 * Math.pow(2, fetchAttempts.current - 1), 8000));
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [startingNodeId, fetchAndProcessGraphData, setLoading, setError, setGraphData]);
  
  // Handle component unmounting
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Fetch data when the component mounts or startingNodeId changes
  useEffect(() => {
    fetchAttempts.current = 0;
    fetchGraphData();
  }, [fetchGraphData, startingNodeId]);
  
  // Safe wrapper for the fetch function that handles errors properly
  const fetchGraphDataSafely = useCallback(() => {
    fetchAttempts.current = 0;
    withErrorHandling(
      fetchGraphData,
      "Failed to refresh graph data"
    );
  }, [fetchGraphData]);
  
  return {
    graphData,
    loading,
    error,
    fetchGraphData: fetchGraphDataSafely
  };
}
