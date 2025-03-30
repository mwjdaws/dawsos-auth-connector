
import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { GraphNode } from '../../types';
import { ensureString, ensureNumber } from '@/utils/compatibility';

export function useNodeRenderer() {
  const renderNode = ({ data, isConnectable }: NodeProps<GraphNode>) => {
    // Ensure we have valid data with fallbacks
    const title = ensureString(data?.title);
    const color = ensureString(data?.color || '#CCCCCC');
    const size = ensureNumber(data?.size || 1);
    const type = ensureString(data?.type || 'default');
    
    // Scale size between min and max values
    const scaledSize = 30 + (size * 10);
    
    // Style with fallback for undefined values
    const nodeStyle = {
      background: color,
      width: `${scaledSize}px`,
      height: `${scaledSize}px`,
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'rgba(0,0,0,0.2)',
      fontSize: `${14 + (size * 2)}px`,
      fontWeight: type === 'central' ? 'bold' : 'normal',
      color: '#FFF',
      boxShadow: type === 'central' ? '0 0 10px rgba(0,0,0,0.3)' : 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      userSelect: 'none'
    };
    
    // Hover style to be applied with CSS
    const hoverClass = 'hover:shadow-lg hover:z-10';
    
    return (
      <div style={nodeStyle} className={hoverClass}>
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          style={{ background: '#555' }}
        />
        <div className="truncate max-w-full px-2" title={title}>
          {title.substring(0, 1).toUpperCase()}
        </div>
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          style={{ background: '#555' }}
        />
      </div>
    );
  };
  
  return { renderNode };
}
