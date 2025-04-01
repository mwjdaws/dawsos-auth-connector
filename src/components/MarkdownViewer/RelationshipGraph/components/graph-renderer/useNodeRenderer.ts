
/**
 * useNodeRenderer hook
 * 
 * This hook provides functions for rendering nodes in the graph
 */
import { useCallback } from 'react';
import { GraphNode } from '../../types';

interface UseNodeRendererProps {
  nodeColorMap?: Record<string, string>;
  defaultNodeColor?: string;
  nodeSizeRange?: [number, number];
  defaultNodeSize?: number;
}

export function useNodeRenderer({
  nodeColorMap = {},
  defaultNodeColor = '#aaaaaa',
  nodeSizeRange = [4, 12],
  defaultNodeSize = 6
}: UseNodeRendererProps = {}) {
  
  // Get node color based on type
  const getNodeColor = useCallback((node: GraphNode): string => {
    if (node.color) return node.color;
    
    if (node.type && nodeColorMap[node.type]) {
      return nodeColorMap[node.type];
    }
    
    return defaultNodeColor;
  }, [nodeColorMap, defaultNodeColor]);
  
  // Get node size based on weight
  const getNodeSize = useCallback((node: GraphNode): number => {
    if (node.size !== undefined) return node.size;
    
    const weight = node.weight || 1;
    const [min, max] = nodeSizeRange;
    
    // Normalize size between min and max
    return Math.max(min, Math.min(max, defaultNodeSize * weight));
  }, [nodeSizeRange, defaultNodeSize]);
  
  return {
    getNodeColor,
    getNodeSize
  };
}
