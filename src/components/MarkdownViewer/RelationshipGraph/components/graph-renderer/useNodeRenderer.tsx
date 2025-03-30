
/**
 * useNodeRenderer Hook
 * 
 * Custom hook for rendering nodes in the graph visualization.
 * Encapsulates the node canvas object rendering logic and appearance.
 */
import { useCallback, useMemo } from 'react';
import { GraphNode } from '../../types';

interface UseNodeRendererProps {
  highlightedNodeId: string | null | undefined;
}

export function useNodeRenderer({ highlightedNodeId }: UseNodeRendererProps) {
  // Memoize node and link colors to prevent recalculations
  const colors = useMemo(() => {
    return {
      nodes: {
        source: '#4299e1', // blue
        term: '#68d391',   // green
        highlighted: '#f56565' // red for highlighted nodes
      }
    };
  }, []);
  
  // Memoized node canvas object renderer
  const nodeCanvasObject = useCallback((node: GraphNode & { x?: number, y?: number }, ctx: CanvasRenderingContext2D, globalScale: number) => {
    // Ensure we have x and y coordinates (these are added by force-graph during rendering)
    const x = typeof node.x === 'number' ? node.x : 0;
    const y = typeof node.y === 'number' ? node.y : 0;
    
    // Custom node rendering with text labels
    const label = node.name || node.title || 'Unnamed';
    const fontSize = 12/globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);
    
    // Determine if this node is highlighted
    const isHighlighted = highlightedNodeId === node.id;
    
    // Get node color based on type, with fallbacks
    const nodeTypeColor = node.type && colors.nodes[node.type as keyof typeof colors.nodes];
    
    // Node circle - use highlighted color if this is the highlighted node
    ctx.fillStyle = isHighlighted 
      ? colors.nodes.highlighted 
      : (node.color as string || nodeTypeColor || colors.nodes.source);
    
    const nodeSize = isHighlighted 
      ? ((node.val || 2) * 2.5) // Make highlighted nodes bigger
      : ((node.val || 2) * 2);
      
    ctx.beginPath();
    ctx.arc(x, y, nodeSize, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add a stroke for highlighted nodes
    if (isHighlighted) {
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2/globalScale;
      ctx.stroke();
    }
    
    // Only render text if we're zoomed in enough for it to be readable
    if (globalScale > 0.7) {
      // Text background
      ctx.fillStyle = isHighlighted 
        ? 'rgba(255, 240, 240, 0.9)' // Slightly red tint for highlighted nodes
        : 'rgba(255, 255, 255, 0.8)';
        
      ctx.fillRect(
        x - bckgDimensions[0] / 2,
        y + 6,
        bckgDimensions[0],
        bckgDimensions[1]
      );
      
      // Text
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isHighlighted ? '#e53e3e' : '#222';
      ctx.fillText(label, x, y + 6 + fontSize / 2);
    }
  }, [highlightedNodeId, colors.nodes]);

  return {
    nodeCanvasObject
  };
}
