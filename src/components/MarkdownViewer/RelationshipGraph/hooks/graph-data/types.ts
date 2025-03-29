
/**
 * Graph Data Types
 * 
 * Type definitions for graph data hooks
 */
import { GraphData } from '../../types';

export interface GraphFetchOptions {
  throttleDelay?: number;
  maxRetries?: number;
}

export interface FetchResult {
  sources?: any[];
  links?: any[];
  terms?: any[];
  termRelationships?: any[];
  sourceTerms?: any[];
}

export interface UseGraphStateReturn {
  graphData: GraphData;
  loading: boolean;
  error: string | null;
  setGraphData: (data: GraphData) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}
