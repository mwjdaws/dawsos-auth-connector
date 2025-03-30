import React, { useRef, useImperativeHandle, useCallback, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useNodeRenderer } from './useNodeRenderer';
import { useLinkRenderer } from './useLinkRenderer';
import { useGraphRenderStyles } from './useGraphRenderStyles';
import { 
  GraphRendererProps, 
  GraphRendererRef,
  GraphNode,
  GraphLink 
} from './GraphRendererTypes';
import { 
  createLinkTooltip, 
  createNodeTooltip,
  createNodeClickHandler,
  safeNodeRenderer
} from './adapters';

/**
 * GraphRenderer component
 * 
 * A force-directed graph visualization component with custom node and link rendering.
 */
export const GraphRenderer = React.forwardRef<GraphRendererRef, GraphRendererProps>(
  (props, ref) => {
    const {
      graphData,
      width,
      height,
      highlightedNodeId,
      zoom = 1,
      onNodeClick,
      onLinkClick
    } = props;
    
    // Get rendering utilities
    const { getNodeSize, getNodeColor, nodeCanvasRenderer } = useNodeRenderer({ 
      highlightedNodeId 
    });
    const { getLinkWidth, getLinkColor } = useLinkRenderer();
    const { backgroundColor } = useGraphRenderStyles();
    
    // Keep a reference to the graph instance
    const graphRef = useRef<any>(null);
    
    // Create imperative handle for parent components to call methods
    useImperativeHandle(ref, () => ({
      centerOnNode: (nodeId: string) => {
        const node = graphData.nodes.find(n => n.id === nodeId);
        if (node && graphRef.current) {
          graphRef.current.centerAt(node.x, node.y, 1000);
          setTimeout(() => {
            graphRef.current.zoom(1.5, 1000);
          }, 500);
        }
      },
      zoomToFit: (duration = 1000) => {
        if (graphRef.current) {
          graphRef.current.zoomToFit(duration);
        }
      },
      resetZoom: () => {
        if (graphRef.current) {
          graphRef.current.zoom(1, 1000);
        }
      },
      setZoom: (zoomLevel: number) => {
        if (graphRef.current) {
          graphRef.current.zoom(zoomLevel, 500);
        }
      },
      getGraphData: () => graphData
    }));
    
    // Handle node click
    const handleNodeClick = useCallback(
      createNodeClickHandler(onNodeClick),
      [onNodeClick]
    );
    
    // Custom node canvas object renderer wrapped with error handling
    const safeNodeCanvasObject = useCallback(
      (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
        safeNodeRenderer(node, ctx, globalScale, nodeCanvasRenderer);
      },
      [nodeCanvasRenderer]
    );
    
    // Don't re-render graph for highlightedNodeId changes only
    const memoizedGraphData = useMemo(() => graphData, [
      graphData.nodes.length,
      graphData.links.length
    ]);
    
    return (
      <div style={{ width, height, position: 'relative' }}>
        <ForceGraph2D
          ref={graphRef}
          graphData={memoizedGraphData}
          width={width}
          height={height}
          backgroundColor={backgroundColor}
          nodeRelSize={6}
          zoom={zoom}
          
          // Node styling
          nodeColor={getNodeColor}
          nodeVal={getNodeSize}
          nodeCanvasObject={safeNodeCanvasObject}
          nodeLabel={createNodeTooltip}
          onNodeClick={handleNodeClick}
          
          // Link styling
          linkWidth={(link) => getLinkWidth(link as GraphLink)}
          linkColor={(link) => getLinkColor(link as GraphLink)}
          linkLabel={(link) => createLinkTooltip(link as GraphLink)}
          linkCurvature={0.1}
          
          // Physics settings
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={2}
          cooldownTicks={100}
          
          // Performance optimization
          nodeAutoColorBy="type"
          linkAutoColorBy="type"
        />
      </div>
    );
  }
);

GraphRenderer.displayName = 'GraphRenderer';
