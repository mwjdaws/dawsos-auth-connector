/**
 * useGraphData Hook
 * 
 * This custom hook is responsible for fetching and constructing the graph data
 * from multiple Supabase tables. It combines useGraphState and useFetchGraphData
 * to provide a complete graph data management solution.
 */
import { useCallback, useEffect, useRef, useMemo } from 'react';
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
  const requestCache = useRef<Map<string, { timestamp: number, data: GraphData }>>(new Map());
  const maxRetries = 3;
  const cacheTimeoutMs = 5 * 60 * 1000; // 5 minutes cache validity
  
  // Create a stable cache key for the current request
  const cacheKey = useMemo(() => `graph-${startingNodeId || 'all'}`, [startingNodeId]);
  
  /**
   * Check if there's valid cached data
   */
  const getValidCachedData = useCallback(() => {
    const cached = requestCache.current.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheTimeoutMs) {
      return cached.data;
    }
    return null;
  }, [cacheKey]);
  
  /**
   * Fetches graph data from Supabase and constructs the graph structure
   * This function aggregates data from multiple tables to build a complete
   * representation of the knowledge network.
   */
  const fetchGraphData = useCallback(async (skipCache = false) => {
    // Prevent excessive re-fetching and double fetches
    const now = Date.now();
    if (now - lastFetchTime.current < 2000) return; // Throttle to prevent rapid re-fetches
    
    // Check cache first (unless skipping cache)
    if (!skipCache) {
      const cachedData = getValidCachedData();
      if (cachedData) {
        console.log('Using cached graph data for:', cacheKey);
        setGraphData(cachedData);
        setLoading(false);
        return;
      }
    }
    
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
        // Cache successful responses
        requestCache.current.set(cacheKey, {
          timestamp: Date.now(),
          data
        });
        
        // Clean up old cached data
        for (const [key, value] of requestCache.current.entries()) {
          if (Date.now() - value.timestamp > cacheTimeoutMs) {
            requestCache.current.delete(key);
          }
        }
        
        setGraphData(data);
      }
    } catch (err) {
      console.error('Error in fetchGraphData:', err);
      
      if (isMounted.current) {
        // Categorize the error for better user feedback
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'An unexpected error occurred while fetching graph data';
          
        const isNetworkError = errorMessage.toLowerCase().includes('network') || 
          errorMessage.toLowerCase().includes('fetch') || 
          errorMessage.toLowerCase().includes('abort');
          
        setError(isNetworkError 
          ? 'Network error: Please check your connection and try again' 
          : errorMessage
        );
        
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
              fetchGraphData(true); // Skip cache on retry
            }
          }, Math.min(1000 * Math.pow(2, fetchAttempts.current - 1), 8000));
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [startingNodeId, fetchAndProcessGraphData, setLoading, setError, setGraphData, cacheKey, getValidCachedData]);
  
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
    withErrorHandling(fetchGraphData, {
      errorMessage: "Failed to refresh graph data",
      level: "error"
    })(true); // Skip cache on manual refresh
  }, [fetchGraphData]);

  return {
    graphData,
    loading,
    error,
    fetchGraphData: fetchGraphDataSafely
  };
}
