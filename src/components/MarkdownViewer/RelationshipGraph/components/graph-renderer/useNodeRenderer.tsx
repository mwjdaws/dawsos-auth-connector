import { useCallback, useMemo } from 'react';
import { GraphNode } from '../../types';

interface UseNodeRendererProps {
  nodeColorMap?: Record<string, string>;
  defaultNodeColor?: string;
  nodeSizeRange?: [number, number];
  defaultNodeSize?: number;
}

export function useNodeRenderer({
  nodeColorMap = {},
  defaultNodeColor = '#1f77b4',
  nodeSizeRange = [4, 12],
  defaultNodeSize = 8
}: UseNodeRendererProps = {}) {
  /**
   * Get node color based on type or default
   */
  const getNodeColor = useCallback((node: GraphNode): string => {
    // Use explicit color if provided
    if (node.color) return node.color;
    
    // Otherwise map by type
    const nodeType = node.type || 'default';
    return nodeColorMap[nodeType] || defaultNodeColor;
  }, [nodeColorMap, defaultNodeColor]);

  /**
   * Get node size based on weight or default
   */
  const getNodeSize = useCallback((node: GraphNode): number => {
    // Use explicit size if provided
    if (typeof node.size === 'number') return node.size;
    
    // Otherwise calculate based on weight
    const weight = typeof node.weight === 'number' ? node.weight : 0.5;
    const [min, max] = nodeSizeRange;
    
    if (weight <= 0) return min;
    if (weight >= 1) return max;
    
    // Linear interpolation between min and max
    return min + weight * (max - min);
  }, [nodeSizeRange]);

  /**
   * Custom node renderer for canvas
   */
  const nodeCanvasRenderer = useCallback((ctx: CanvasRenderingContext2D, node: GraphNode) => {
    const color = getNodeColor(node);
    const size = getNodeSize(node);
    
    // Draw circle
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, size, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    
    // Draw border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
    
    // Draw label if node has a name or title
    const label = node.name || node.title || '';
    if (label && typeof label === 'string') {
      ctx.font = '4px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      
      // Position text slightly below node
      ctx.fillText(label, node.x || 0, (node.y || 0) + size + 4);
    }
  }, [getNodeColor, getNodeSize]);

  return useMemo(() => ({
    getNodeColor,
    getNodeSize,
    nodeCanvasRenderer,
    renderNode: ({ data }: { data: GraphNode }) => null // Placeholder for custom Node component
  }), [getNodeColor, getNodeSize, nodeCanvasRenderer]);
}
