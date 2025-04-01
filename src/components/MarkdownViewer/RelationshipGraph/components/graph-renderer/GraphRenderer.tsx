
import React, { useRef, useImperativeHandle, useState, useCallback, forwardRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { GraphData, GraphNode, GraphLink, GraphRendererRef } from '../../types';
import { useNodeRenderer } from './useNodeRenderer';
import { useLinkRenderer } from './useLinkRenderer';

// Constants for node and link colors
const DEFAULT_NODE_COLOR_MAP = {
  source: '#4ecdc4',
  ontology: '#f9c74f',
  document: '#6b7280',
  term: '#a0aec0'
};

const DEFAULT_LINK_COLOR_MAP = {
  wikilink: '#63b3ed',
  manual: '#9f7aea',
  'AI-suggested': '#f6ad55',
  'has_term': '#cbd5e0',
  'is_a': '#a0aec0',
  'part_of': '#e53e3e',
  'related_to': '#d69e2e'
};

interface GraphRendererProps {
  graphData: GraphData;
  width: number;
  height: number;
  highlightedNodeId?: string | null;
  zoom?: number;
  onNodeClick?: (nodeId: string) => void;
  onLinkClick?: (source: string, target: string) => void;
}

export const GraphRenderer = forwardRef<GraphRendererRef, GraphRendererProps>(({
  graphData,
  width,
  height,
  highlightedNodeId = null,
  zoom = 1,
  onNodeClick,
  onLinkClick
}, ref) => {
  const graphRef = useRef<any>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  // Use node and link renderer hooks
  const nodeRenderer = useNodeRenderer({
    nodeColorMap: DEFAULT_NODE_COLOR_MAP,
    defaultNodeColor: '#6b7280',
    nodeSizeRange: [4, 12],
    defaultNodeSize: 8
  });
  
  const linkRenderer = useLinkRenderer({
    linkColorMap: DEFAULT_LINK_COLOR_MAP,
    defaultLinkColor: '#d1d5db',
    linkWidthRange: [1, 3],
    defaultLinkWidth: 1.5
  });
  
  // Create safe graph data to prevent errors
  const safeGraphData: GraphData = {
    nodes: Array.isArray(graphData?.nodes) ? graphData.nodes : [],
    links: Array.isArray(graphData?.links) ? graphData.links : []
  };
  
  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    centerOnNode: (nodeId: string) => {
      if (graphRef.current && nodeId) {
        const node = safeGraphData.nodes.find(n => n.id === nodeId);
        if (node) {
          graphRef.current.centerAt(node.x, node.y, 1000);
          graphRef.current.zoom(2, 1000);
        }
      }
    },
    centerAt: (x: number, y: number, duration = 1000) => {
      if (graphRef.current) {
        graphRef.current.centerAt(x, y, duration);
      }
    },
    zoomToFit: (duration = 1000) => {
      if (graphRef.current) {
        graphRef.current.zoomToFit(duration);
      }
    },
    setZoom: (zoomLevel: number) => {
      if (graphRef.current) {
        graphRef.current.zoom(zoomLevel, 500);
      }
    },
    getGraphData: () => safeGraphData
  }));
  
  // Handler for node clicks
  const handleNodeClick = useCallback((node: any) => {
    if (node && onNodeClick) {
      onNodeClick(node.id);
    }
  }, [onNodeClick]);
  
  // Handler for link clicks
  const handleLinkClick = useCallback((link: any) => {
    if (link && onLinkClick) {
      const source = typeof link.source === 'object' ? link.source.id : link.source;
      const target = typeof link.target === 'object' ? link.target.id : link.target;
      onLinkClick(source, target);
    }
  }, [onLinkClick]);
  
  // Get extra props for nodes (color, etc)
  const getNodeColor = useCallback((node: GraphNode) => {
    if (highlightedNodeId && node.id === highlightedNodeId) {
      return '#2563eb'; // bright blue for highlighted node
    }
    
    if (hoveredNode && node.id === hoveredNode) {
      return '#4f46e5'; // indigo for hovered node
    }
    
    return nodeRenderer.getNodeColor(node);
  }, [nodeRenderer, highlightedNodeId, hoveredNode]);
  
  // Render the graph
  return (
    <ForceGraph2D
      ref={graphRef}
      graphData={safeGraphData}
      width={width}
      height={height}
      backgroundColor="#fafafa"
      nodeRelSize={6}
      nodeVal={nodeRenderer.getNodeSize}
      nodeColor={getNodeColor}
      nodeLabel={node => node.name || node.title || node.id}
      linkColor={linkRenderer.getLinkColor}
      linkWidth={linkRenderer.getLinkWidth}
      linkLabel={linkRenderer.getLinkLabel}
      linkDirectionalParticles={2}
      linkDirectionalParticleWidth={1.5}
      onNodeClick={handleNodeClick}
      onLinkClick={handleLinkClick}
      onNodeHover={node => setHoveredNode(node ? node.id : null)}
      cooldownTicks={100}
      cooldownTime={2000}
      d3AlphaDecay={0.02}
      d3VelocityDecay={0.1}
      warmupTicks={50}
      linkAutoColorBy="type"
    />
  );
});

GraphRenderer.displayName = 'GraphRenderer';
