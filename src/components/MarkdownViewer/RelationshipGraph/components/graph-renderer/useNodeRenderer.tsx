
/**
 * Custom hook for rendering nodes in the graph
 */
import React from 'react';
import { GraphNode } from '../../components/graph-renderer/GraphRendererTypes';

interface NodeRendererConfig {
  getNodeSize: (node: GraphNode) => number;
  getNodeColor: (node: GraphNode) => string;
  nodeCanvasRenderer: (node: GraphNode) => any;
  renderNode: ({ data, isConnectable }: { data: GraphNode, isConnectable: boolean }) => JSX.Element;
}

export function useNodeRenderer(): NodeRendererConfig {
  // Get node size based on node type and importance
  const getNodeSize = (node: GraphNode): number => {
    const defaultSize = 8;
    
    // Check for explicitly set size
    if (node.size !== undefined) {
      return Number(node.size);
    }
    
    // Different sizes based on node type
    const nodeSizes: Record<string, number> = {
      document: 10,
      term: 7,
      concept: 9,
      entity: 8,
      topic: 8
    };
    
    return nodeSizes[node.type || ''] || defaultSize;
  };
  
  // Get node color based on node type and domain
  const getNodeColor = (node: GraphNode): string => {
    // Default color
    let defaultColor = '#6b7280'; // gray-500
    
    // Colors for different types
    const typeColors: Record<string, string> = {
      document: '#2563eb', // blue-600
      term: '#059669', // emerald-600
      concept: '#7c3aed', // violet-600
      entity: '#db2777', // pink-600
      topic: '#ea580c', // orange-600
      person: '#ef4444', // red-500
      organization: '#f59e0b' // amber-500
    };
    
    // If node has a type, use the corresponding color
    const nodeType = (node.type || '').toLowerCase();
    defaultColor = typeColors[nodeType] || defaultColor;
    
    // If color is explicitly set, use that
    return node.color || defaultColor;
  };
  
  // Canvas renderer for the node (optimized rendering)
  const nodeCanvasRenderer = (node: GraphNode) => {
    // Implementation for canvas rendering
    return (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = getNodeColor(node);
      ctx.fill();
      
      // Add a border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };
  };
  
  // React component for the node (used in detailed view)
  const renderNode = ({ data, isConnectable }: { data: GraphNode, isConnectable: boolean }) => {
    const nodeSize = getNodeSize(data);
    const color = getNodeColor(data);
    
    return (
      <div
        style={{
          width: `${nodeSize * 2}px`,
          height: `${nodeSize * 2}px`,
          borderRadius: '50%',
          backgroundColor: color,
          border: '2px solid white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {data.icon && (
          <span style={{ color: 'white', fontSize: '0.7em' }}>
            {data.icon}
          </span>
        )}
      </div>
    );
  };
  
  return {
    getNodeSize,
    getNodeColor,
    nodeCanvasRenderer,
    renderNode
  };
}
