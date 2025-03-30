
import React from 'react';
import { GraphNode } from './GraphRendererTypes';

interface NodeProps {
  data: GraphNode;
  isConnectable: boolean;
}

interface NodeRendererResult {
  renderNode: ({ data, isConnectable }: NodeProps) => JSX.Element;
  getNodeSize: (node: GraphNode) => number;
  getNodeColor: (node: GraphNode) => string;
  nodeCanvasRenderer: (node: GraphNode & { x?: number; y?: number; }, ctx: CanvasRenderingContext2D, globalScale: number) => void;
}

export function useNodeRenderer({ highlightedNodeId }: { highlightedNodeId?: string | null } = {}): NodeRendererResult {
  // Function to render the node component
  const renderNode = ({ data, isConnectable }: NodeProps) => {
    const nodeType = data.type || 'default';
    const nodeColor = getNodeColor(data);
    
    return (
      <div
        style={{
          background: nodeColor,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: '#ffffff',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          fontSize: '12px',
          color: '#ffffff',
          fontWeight: 'bold',
          userSelect: 'none'
        }}
      >
        {data.name?.substring(0, 8) || data.title?.substring(0, 8) || ''}
      </div>
    );
  };

  // Node canvas renderer for force-graph
  const nodeCanvasRenderer = (node: GraphNode & { x?: number; y?: number; }, ctx: CanvasRenderingContext2D, globalScale: number) => {
    if (!node || typeof node.x !== 'number' || typeof node.y !== 'number') return;
    
    const size = getNodeSize(node);
    const color = getNodeColor(node);
    const isHighlighted = highlightedNodeId === node.id;
    
    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    
    // Draw border for highlighted nodes
    if (isHighlighted) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    // Draw label if zoomed in enough
    if (globalScale > 1) {
      const label = node.name || node.title || node.id || '';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(label.substring(0, 10), node.x, node.y);
    }
  };

  return {
    renderNode,
    getNodeSize,
    getNodeColor,
    nodeCanvasRenderer
  };
}

// Helper function to determine node color based on type
function getNodeColor(node: GraphNode): string {
  const type = node.type || 'default';
  
  const colorMap: Record<string, string> = {
    source: '#3b82f6', // blue
    term: '#10b981',   // green
    category: '#f59e0b', // amber
    default: '#6b7280'  // gray
  };
  
  return colorMap[type] || colorMap.default;
}

// Helper function to determine node size based on properties
function getNodeSize(node: GraphNode): number {
  // Base size
  let size = 5;
  
  // Adjust size based on node type
  if (node.type === 'source') {
    size += 3;
  } else if (node.type === 'term') {
    size += 1;
  }
  
  // Use explicitly defined size if available
  if (typeof node.size === 'number') {
    return node.size;
  }
  
  return size;
}
