
import { useCallback, useRef } from 'react';
import { GraphNode, NodeRendererOptions } from './GraphRendererTypes';

export function useNodeRenderer(options?: Partial<NodeRendererOptions>) {
  const hoveredNodeRef = useRef<GraphNode | null>(null);

  const handleNodeClick = useCallback((node: GraphNode) => {
    if (options?.onNodeClick) {
      options.onNodeClick(node.id);
    }
  }, [options]);

  const renderNodes = useCallback((
    context: CanvasRenderingContext2D, 
    nodes: GraphNode[], 
    transform: any,
    highlightedNodeId?: string | null
  ) => {
    context.save();
    
    // Apply zoom transform
    context.translate(transform.x, transform.y);
    context.scale(transform.k, transform.k);
    
    // Draw nodes
    nodes.forEach(node => {
      if (!node?.x || !node?.y) return;
      
      const isHighlighted = highlightedNodeId === node.id;
      const isHovered = hoveredNodeRef.current === node;
      const nodeSize = node.val || 10;
      
      // Draw node circle
      context.beginPath();
      context.arc(node.x, node.y, isHighlighted ? nodeSize * 1.2 : nodeSize, 0, Math.PI * 2);
      
      // Fill with node color or default
      context.fillStyle = node.color || (isHighlighted ? '#ff5500' : '#1e88e5');
      
      // Add highlight or hover effects
      if (isHighlighted) {
        context.shadowColor = 'rgba(255, 85, 0, 0.6)';
        context.shadowBlur = 15;
      } else if (isHovered) {
        context.shadowColor = 'rgba(30, 136, 229, 0.6)';
        context.shadowBlur = 10;
      }
      
      context.fill();
      context.shadowBlur = 0;
      
      // Add border
      context.strokeStyle = isHighlighted ? '#ff3300' : '#0066cc';
      context.lineWidth = isHighlighted ? 2 : 1;
      context.stroke();
      
      // Add node label
      if (node.name || node.title) {
        context.font = isHighlighted ? 'bold 12px Arial' : '12px Arial';
        context.fillStyle = '#333';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(node.title || node.name || node.id, node.x, node.y + nodeSize + 12);
      }
    });
    
    context.restore();
  }, []);

  const hitTest = useCallback((
    x: number, 
    y: number, 
    nodes: GraphNode[], 
    transform: any
  ): GraphNode | null => {
    // Convert screen coordinates to graph coordinates
    const graphX = (x - transform.x) / transform.k;
    const graphY = (y - transform.y) / transform.k;
    
    // Check if any node contains the point
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      if (!node?.x || !node?.y) continue;
      
      const nodeSize = node.val || 10;
      const dx = graphX - node.x;
      const dy = graphY - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= nodeSize) {
        return node;
      }
    }
    
    return null;
  }, []);

  return {
    handleNodeClick,
    renderNodes,
    hitTest,
    hoveredNodeRef
  };
}
