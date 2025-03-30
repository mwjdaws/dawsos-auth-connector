
import React from 'react';
import { GraphNode } from './GraphRendererTypes';

interface NodeProps {
  data: GraphNode;
  isConnectable: boolean;
}

export function useNodeRenderer() {
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

  return {
    renderNode
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
