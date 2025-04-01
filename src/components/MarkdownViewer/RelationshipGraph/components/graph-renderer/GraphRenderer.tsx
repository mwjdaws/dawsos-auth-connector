
import React, { useRef, useImperativeHandle, useEffect } from 'react';
import { useNodeRenderer } from './useNodeRenderer';
import { useLinkRenderer } from './useLinkRenderer';
import { useForceSimulation } from './useForceSimulation';
import { useZoomPan } from './useZoomPan';
import { GraphData, GraphNode, GraphRendererRef } from '../../types';
import { ensureString, ensureNumber } from '@/utils/compatibility';

interface GraphRendererProps {
  graphData: GraphData;
  width?: number;
  height?: number;
  zoom?: number;
  highlightedNodeId?: string | null;
  onNodeClick?: (nodeId: string) => void;
  onLinkClick?: (source: string, target: string) => void;
}

export const GraphRenderer = React.forwardRef<GraphRendererRef, GraphRendererProps>(
  ({ 
    graphData, 
    width = 800, 
    height = 600, 
    zoom = 1, 
    highlightedNodeId = null,
    onNodeClick,
    onLinkClick
  }, ref) => {
    // Create refs for our DOM elements
    const svgRef = useRef<SVGSVGElement>(null);
    const gRef = useRef<SVGGElement>(null);
    
    // Initialize our rendering hooks
    const { renderNodes, updateNodePositions, getNodeById } = useNodeRenderer(svgRef, gRef, {
      onNodeClick
    });
    
    const { renderLinks, updateLinkPositions } = useLinkRenderer(svgRef, gRef, {
      onLinkClick
    });
    
    // Initialize our simulation
    const { startSimulation, stopSimulation, restartSimulation } = useForceSimulation({
      nodes: graphData.nodes,
      links: graphData.links,
      onTick: () => {
        updateNodePositions();
        updateLinkPositions();
      }
    });
    
    // Initialize zoom/pan behavior
    const { 
      setZoom, 
      zoomIn, 
      zoomOut, 
      resetZoom, 
      centerOnNode, 
      centerAt, 
      zoomToFit 
    } = useZoomPan(svgRef, gRef, { width, height });
    
    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      zoomIn,
      zoomOut,
      resetZoom,
      setZoom,
      centerOnNode: (nodeId: string) => centerOnNode(nodeId, getNodeById),
      updateGraph: (newData: GraphData) => {
        stopSimulation();
        renderNodes(newData.nodes, highlightedNodeId ? ensureString(highlightedNodeId) : '');
        renderLinks(newData.links);
        restartSimulation(newData.nodes, newData.links);
      },
      getNodeById: (id: string) => getNodeById(id),
      centerAt,
      zoomToFit,
      getGraphData: () => graphData
    }));
    
    // Initialize graph on mount
    useEffect(() => {
      renderNodes(graphData.nodes, highlightedNodeId ? ensureString(highlightedNodeId) : '');
      renderLinks(graphData.links);
      startSimulation();
      
      if (zoom !== 1) {
        setZoom(zoom);
      }
      
      return () => {
        stopSimulation();
      };
    }, []);
    
    // Update graph when data changes
    useEffect(() => {
      stopSimulation();
      renderNodes(graphData.nodes, highlightedNodeId ? ensureString(highlightedNodeId) : '');
      renderLinks(graphData.links);
      restartSimulation(graphData.nodes, graphData.links);
    }, [graphData]);
    
    // Update highlighted node
    useEffect(() => {
      renderNodes(graphData.nodes, highlightedNodeId ? ensureString(highlightedNodeId) : '');
    }, [highlightedNodeId]);
    
    // Update zoom level
    useEffect(() => {
      setZoom(zoom);
    }, [zoom]);
    
    return (
      <svg 
        ref={svgRef} 
        width={width} 
        height={height} 
        className="graph-renderer"
      >
        <g ref={gRef} />
      </svg>
    );
  }
);

GraphRenderer.displayName = 'GraphRenderer';
