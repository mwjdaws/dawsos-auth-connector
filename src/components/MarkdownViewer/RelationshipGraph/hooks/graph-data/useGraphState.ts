
/**
 * useGraphState Hook
 * 
 * Manages the state for graph data, loading status, and errors
 */
import { useState, useRef } from 'react';
import { GraphData } from '../../types';
import { UseGraphStateReturn } from './types';

export function useGraphState(): UseGraphStateReturn {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  return {
    graphData,
    loading,
    error,
    setGraphData,
    setLoading,
    setError
  };
}
