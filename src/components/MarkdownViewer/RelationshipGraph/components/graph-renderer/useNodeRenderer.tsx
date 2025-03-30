
import { useCallback, useMemo } from 'react';
import { GraphNode } from '../../types';
import { ensureNumber } from '../../compatibility';

export interface UseNodeRendererProps {
  highlightedNodeId: string | null | undefined;
}

export function useNodeRenderer({ highlightedNodeId }: UseNodeRendererProps) {
  // Node size calculation
  const getNodeSize = useCallback((node: GraphNode): number => {
    // Default node size if not specified
    if (!node || node.val === undefined) return 7;
    
    // Allow for dynamic node sizing based on the val property
    const baseSize = 5;
    const sizeMultiplier = 2;
    return baseSize + (node.val * sizeMultiplier);
  }, []);

  // Node color calculation
  const getNodeColor = useCallback((node: GraphNode): string => {
    // Predefined type-based colors
    const typeColors: Record<string, string> = {
      source: '#3b82f6', // blue
      document: '#3b82f6', // blue
      term: '#10b981', // green
      'ontology-term': '#10b981', // green
      tag: '#f59e0b', // amber
      default: '#6b7280', // gray
    };

    // Check if the node is highlighted
    const isHighlighted = highlightedNodeId && node.id === highlightedNodeId;
    
    // Use node's color if specified, otherwise use type-based color
    const baseColor = node.color || typeColors[node.type] || typeColors.default;
    
    // Highlight the node if needed
    return isHighlighted ? '#ef4444' : baseColor;
  }, [highlightedNodeId]);

  // Node renderer function for canvas drawing
  const nodeCanvasRenderer = useCallback((
    node: GraphNode & { x?: number; y?: number; },
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ) => {
    // Safety checks for node properties
    if (!node) return;

    // Ensure we have valid x and y coordinates
    const x = ensureNumber(node.x, 0);
    const y = ensureNumber(node.y, 0);
    
    // Calculate size and color
    const size = getNodeSize(node);
    const color = getNodeColor(node);

    // Draw the node
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();

    // Add a border if highlighted
    if (highlightedNodeId && node.id === highlightedNodeId) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    }

    // Draw the node label if scale is adequate
    if (globalScale > 1.5) {
      ctx.font = '4px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(node.name || node.title || 'Unnamed', x, y);
    }
  }, [getNodeSize, getNodeColor, highlightedNodeId]);

  return useMemo(() => ({
    getNodeSize,
    getNodeColor,
    nodeCanvasRenderer
  }), [getNodeSize, getNodeColor, nodeCanvasRenderer]);
}
