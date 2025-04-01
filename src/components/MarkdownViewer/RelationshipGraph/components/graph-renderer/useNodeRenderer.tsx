
/**
 * useNodeRenderer hook
 * 
 * This hook provides a customized node renderer for the force graph
 */
import { useCallback, useMemo } from 'react';
import { GraphNode } from '../../types';

interface UseNodeRendererProps {
  highlightedNodeId: string | null;
  onNodeClick?: (nodeId: string) => void;
}

export function useNodeRenderer({ 
  highlightedNodeId,
  onNodeClick
}: UseNodeRendererProps) {
  // Determine if a node is highlighted
  const isNodeHighlighted = useCallback((node: GraphNode): boolean => {
    return highlightedNodeId === node.id;
  }, [highlightedNodeId]);
  
  // Get node color based on type and highlight status
  const getNodeColor = useCallback((node: GraphNode): string => {
    if (node.color) return node.color;
    
    if (isNodeHighlighted(node)) {
      return '#ff6b6b';
    }
    
    // Color based on node type
    switch (node.type) {
      case 'source':
        return '#4ecdc4';
      case 'ontology':
        return '#f9c74f';
      default:
        return '#aaa';
    }
  }, [isNodeHighlighted]);
  
  // Get node size based on weight and highlight status
  const getNodeSize = useCallback((node: GraphNode): number => {
    const baseSize = node.size || 6;
    const weightMultiplier = node.weight || 1;
    
    return isNodeHighlighted(node)
      ? baseSize * weightMultiplier * 1.5
      : baseSize * weightMultiplier;
  }, [isNodeHighlighted]);
  
  // Handle node click
  const handleNodeClick = useCallback((node: GraphNode) => {
    if (onNodeClick) {
      onNodeClick(node.id);
    }
  }, [onNodeClick]);
  
  // Custom node object with paint method
  const nodeObject = useMemo(() => ({
    color: getNodeColor,
    size: getNodeSize
  }), [getNodeColor, getNodeSize]);
  
  return { 
    nodeObject,
    handleNodeClick
  };
}
