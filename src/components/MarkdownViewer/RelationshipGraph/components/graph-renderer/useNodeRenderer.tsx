import React from 'react';
import { GraphNode } from './GraphRendererTypes';

interface NodeRendererOptions {
  highlightedNodeId: string | null;
}

interface NodeRendererResult {
  getNodeSize: (node: GraphNode) => number;
  getNodeColor: (node: GraphNode) => string;
  nodeCanvasRenderer: (node: GraphNode & { x?: number; y?: number; }, ctx: CanvasRenderingContext2D, globalScale: number) => void;
}

export function useNodeRenderer({ highlightedNodeId }: NodeRendererOptions): NodeRendererResult {
  // Return node size based on type and highlighting
  const getNodeSize = (node: GraphNode): number => {
    const isHighlighted = node.id === highlightedNodeId;
    const baseSize = getBaseSizeForNodeType(node.type || 'document');
    return isHighlighted ? baseSize * 1.3 : baseSize;
  };
  
  // Get base size for different node types
  const getBaseSizeForNodeType = (type: string): number => {
    const sizeMap: Record<string, number> = {
      'document': 5,
      'term': 4,
      'entity': 3.5,
      'concept': 4,
      'default': 4
    };
    
    return sizeMap[type] || sizeMap.default;
  };
  
  // Return node color based on type and highlighting
  const getNodeColor = (node: GraphNode): string => {
    if (node.id === highlightedNodeId) {
      return '#ff3e00'; // Highlight color
    }
    
    return getColorForNodeType(node.type || 'document', node.domain);
  };
  
  // Get color for different node types
  const getColorForNodeType = (type: string, domain?: string): string => {
    // First check if it's a domain-specific node
    if (domain) {
      const domainColorMap: Record<string, string> = {
        'medical': '#0ea5e9',  // sky blue
        'technology': '#8b5cf6', // violet
        'business': '#f59e0b',  // amber
        'science': '#10b981',   // emerald
        'default': '#6b7280'    // gray
      };
      
      return domainColorMap[domain] || domainColorMap.default;
    }
    
    // Otherwise, color by type
    const colorMap: Record<string, string> = {
      'document': '#3b82f6',  // blue
      'term': '#10b981',     // green
      'entity': '#f59e0b',   // amber
      'concept': '#8b5cf6',  // violet
      'default': '#6b7280'   // gray
    };
    
    return colorMap[type] || colorMap.default;
  };
  
  // Custom node renderer function
  const nodeCanvasRenderer = (
    node: GraphNode & { x?: number; y?: number; },
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ) => {
    const { title, name, id, type = 'document' } = node;
    
    // Extract node coordinates safely
    const x = node.x || 0;
    const y = node.y || 0;
    
    // Determine node display attributes
    const size = getNodeSize(node);
    const color = getNodeColor(node);
    const fontSize = Math.max(8, size * 1.5 / globalScale);
    const isHighlighted = node.id === highlightedNodeId;
    const displayText = title || name || id || 'Unknown';
    
    // Begin drawing
    ctx.beginPath();
    
    // Draw the node circle
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    
    // Add highlight ring if this node is highlighted
    if (isHighlighted) {
      ctx.beginPath();
      ctx.arc(x, y, size + 2, 0, 2 * Math.PI);
      ctx.strokeStyle = '#ff3e00';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    
    // Add text label (only if we're zoomed in enough)
    if (globalScale > 0.6) {
      ctx.font = `${fontSize}px Sans-Serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      
      // Add a background for text readability
      const textWidth = ctx.measureText(displayText).width;
      const textHeight = fontSize;
      
      // Draw text background 
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(x - textWidth/2, y + size + 2, textWidth, textHeight);
      
      // Draw the text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(displayText, x, y + size + textHeight/2 + 2);
    }
  };
  
  return {
    getNodeSize,
    getNodeColor,
    nodeCanvasRenderer
  };
}
