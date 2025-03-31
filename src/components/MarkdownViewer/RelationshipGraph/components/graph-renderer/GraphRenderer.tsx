
/**
 * GraphRenderer Component
 * 
 * Core component that renders the graph visualization using ForceGraph.
 * Wraps the force-directed graph library with React-specific behavior.
 */
import React, { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { 
  GraphNode, 
  GraphLink, 
  GraphData, 
  GraphRendererProps 
} from './GraphRendererTypes';
import { useNodeRenderer } from './useNodeRenderer';
import { useLinkRenderer } from './useLinkRenderer';
import { getNodeStyle } from '../../utils/graphUtils';

// Extended ForceGraph node type
interface NodeObject<T> {
  id: string;
  __force: any;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  [key: string]: any;
}

// Extended ForceGraph link type
interface LinkObject<N, T> {
  source: N;
  target: N;
  [key: string]: any;
}

const GraphRenderer = forwardRef<any, GraphRendererProps>(({ 
  graphData, 
  width, 
  height, 
  highlightedNodeId = null,
  zoom = 1
}, ref) => {
  const graphRef = useRef<any>(null);
  const nodeRenderer = useNodeRenderer();
  const linkRenderer = useLinkRenderer();
  
  // Configure the ref to expose methods to the parent
  useImperativeHandle(ref, () => ({
    centerOnNode: (nodeId: string) => {
      const node = graphData.nodes.find(n => n.id === nodeId);
      if (node && graphRef.current) {
        graphRef.current.centerAt(10, 10, 1000);
        setTimeout(() => {
          graphRef.current.centerAt(0, 0, 1000);
        }, 50);
      }
    },
    
    zoomToFit: (duration = 1000) => {
      if (graphRef.current) {
        graphRef.current.zoomToFit(duration);
      }
    },
    
    resetZoom: () => {
      if (graphRef.current) {
        graphRef.current.zoomToFit(400);
      }
    },
    
    setZoom: (zoomLevel: number) => {
      if (graphRef.current) {
        // Convert zoom level to d3 zoom
        graphRef.current.zoom(zoomLevel, 500);
      }
    }
  }), [graphData]);
  
  // Handle node click
  const handleNodeClick = useCallback((node: NodeObject<GraphNode>) => {
    if (node && graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 1000);
    }
  }, []);
  
  // Handle node tooltip content
  const getNodeTooltip = useCallback((node: GraphNode) => {
    if (!node) return '';
    
    return `
      <div style="font-family: system-ui, sans-serif; padding: 5px;">
        <div style="font-weight: bold;">${node.title || node.name || node.id}</div>
        ${node.type ? `<div style="font-size: 0.8em; color: #666;">Type: ${node.type}</div>` : ''}
        ${node.domain ? `<div style="font-size: 0.8em; color: #666;">Domain: ${node.domain}</div>` : ''}
      </div>
    `;
  }, []);
  
  // Handle link tooltip content
  const getLinkTooltip = useCallback((link: GraphLink) => {
    if (!link) return '';
    
    return `
      <div style="font-family: system-ui, sans-serif; padding: 5px;">
        <div style="font-weight: bold;">${linkRenderer.getLinkLabel(link)}</div>
      </div>
    `;
  }, [linkRenderer]);
  
  return (
    <ForceGraph2D
      ref={graphRef}
      graphData={graphData}
      width={width}
      height={height}
      nodeLabel={getNodeTooltip}
      linkLabel={getLinkTooltip}
      nodeColor={nodeRenderer.getNodeColor}
      nodeRelSize={6}
      linkColor={linkRenderer.getLinkColor}
      linkWidth={linkRenderer.getLinkWidth}
      linkDirectionalArrowLength={4}
      linkDirectionalArrowRelPos={0.8}
      linkAutoColorBy="type"
      onNodeClick={handleNodeClick}
      cooldownTicks={100}
      nodeCanvasObject={(node, ctx, globalScale) => {
        const { x, y } = node;
        if (x === undefined || y === undefined) return;
        
        const size = nodeRenderer.getNodeSize(node);
        const color = nodeRenderer.getNodeColor(node);
        
        // Check if this node is highlighted
        const isHighlighted = highlightedNodeId !== null && node.id === highlightedNodeId;
        
        // Draw the node
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        
        // Add a border
        ctx.strokeStyle = isHighlighted ? '#ffffff' : '#f8fafc';
        ctx.lineWidth = isHighlighted ? 2 : 1;
        ctx.stroke();
        
        // Add a glow for highlighted nodes
        if (isHighlighted) {
          ctx.beginPath();
          ctx.arc(x, y, size + 3, 0, 2 * Math.PI);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        
        // Add labels when zoomed in enough
        const label = node.title || node.name || node.id;
        if (globalScale >= 1.5 && label) {
          ctx.font = `${isHighlighted ? 'bold ' : ''}${10 / globalScale}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#ffffff';
          
          // Draw text background for readability
          const textWidth = ctx.measureText(label).width;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
          ctx.fillRect(
            x - textWidth / 2 - 2,
            y + size + 2,
            textWidth + 4,
            14 / globalScale
          );
          
          // Draw text
          ctx.fillStyle = '#ffffff';
          ctx.fillText(label, x, y + size + 8 / globalScale);
        }
      }}
    />
  );
});

GraphRenderer.displayName = 'GraphRenderer';

export { GraphRenderer };
