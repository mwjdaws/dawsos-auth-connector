
/**
 * GraphRenderer Component
 * 
 * This component renders the force-directed graph visualization using react-force-graph-2d.
 * It uses custom hooks to handle different aspects of the rendering.
 */
import React, { useCallback, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
// Use dynamic import to avoid direct module reference issues
import { useNavigate } from 'react-router-dom';
import { GraphData, GraphNode, GraphRendererRef, GraphLink } from '../../types';
import { useNodeRenderer } from './useNodeRenderer';
import { useLinkRenderer } from './useLinkRenderer';
import { useGraphRenderStyles } from './useGraphRenderStyles';

// Dynamically import ForceGraph2D to avoid module loading issues
const ForceGraph2DComponent = React.lazy(() => import('react-force-graph-2d'));

interface GraphRendererProps {
  graphData: GraphData;        // Data structure containing nodes and links
  width: number;               // Width of the graph container
  height: number;              // Height of the graph container
  highlightedNodeId?: string | null; // ID of the node to highlight
  zoom?: number;               // Current zoom level
}

// Component with forwardRef to expose methods to parent
export const GraphRenderer = forwardRef<GraphRendererRef, GraphRendererProps>(
  ({ graphData, width, height, highlightedNodeId, zoom = 1 }, ref) => {
    const navigate = useNavigate();
    const graphRef = useRef<any>(null);
    const styles = useGraphRenderStyles();
    const { nodeCanvasObject } = useNodeRenderer({ highlightedNodeId });
    const { getLinkColor, getLinkLabel } = useLinkRenderer();
    
    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
      centerOnNode: (nodeId: string) => {
        const node = graphData.nodes.find(n => n.id === nodeId);
        if (graphRef.current && node) {
          console.log(`Centering graph on node: ${node.name || node.title}`);
          graphRef.current.centerAt(node.x, node.y, 1000);
          graphRef.current.zoom(2.5, 1000);
        }
      },
      setZoom: (zoomLevel: number, duration: number = 0) => {
        if (graphRef.current) {
          graphRef.current.zoom(zoomLevel, duration);
        }
      },
      zoomIn: () => {
        if (graphRef.current) {
          const currentZoom = graphRef.current.zoom();
          graphRef.current.zoom(currentZoom * 1.2, 300);
        }
      },
      zoomOut: () => {
        if (graphRef.current) {
          const currentZoom = graphRef.current.zoom();
          graphRef.current.zoom(currentZoom * 0.8, 300);
        }
      },
      resetZoom: () => {
        if (graphRef.current) {
          graphRef.current.zoom(1, 300);
        }
      },
      centerGraph: () => {
        if (graphRef.current) {
          try {
            graphRef.current.zoomToFit(400);
          } catch (error) {
            console.error("Error centering graph:", error);
          }
        }
      }
    }));
    
    // Apply zoom when the zoom prop changes
    useEffect(() => {
      if (graphRef.current && zoom) {
        graphRef.current.zoom(zoom, 300);
      }
    }, [zoom]);
    
    // Debug output for graph data
    useEffect(() => {
      console.log(`GraphRenderer: Rendering graph with ${graphData.nodes.length} nodes and ${graphData.links.length} links`);
      
      // Log some sample data for debugging
      if (graphData.nodes.length > 0) {
        console.log('Sample node:', graphData.nodes[0]);
      }
      
      if (graphData.links.length > 0) {
        console.log('Sample link:', graphData.links[0]);
      }
    }, [graphData]);
    
    // Center on highlighted node when it changes
    useEffect(() => {
      if (highlightedNodeId && graphRef.current) {
        const node = graphData.nodes.find(n => n.id === highlightedNodeId);
        if (node) {
          console.log(`Auto-centering on highlighted node: ${node.name || node.title}`);
          graphRef.current.centerAt(node.x, node.y, 1000);
          graphRef.current.zoom(2.5, 1000);
        }
      }
    }, [highlightedNodeId, graphData.nodes]);
    
    /**
     * Handles node click events
     * - For source nodes: Navigate to the source detail page
     * - For term nodes: Log the term details (could be expanded to show details in UI)
     */
    const handleNodeClick = useCallback((node: GraphNode) => {
      console.log('Node clicked:', node);
      if (node.type === 'source') {
        navigate(`/source/${node.id}`);
      } else if (node.type === 'term') {
        // Could show term details in a modal/sidebar
        console.log('Term clicked:', node);
      }
    }, [navigate]);
    
    // Reset graph when data changes
    useEffect(() => {
      // Allow the graph to stabilize after data changes
      const timer = setTimeout(() => {
        if (graphRef.current) {
          try {
            // @ts-ignore - ForceGraph2D instance has zoomToFit method
            graphRef.current.zoomToFit(400, 40);
          } catch (error) {
            console.error("Error zooming to fit graph:", error);
          }
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }, [graphData]);
    
    // Handle empty data case - should never happen as this is checked in the parent
    if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
      return (
        <div className={styles.emptyStateStyle}>
          <p className={styles.emptyStateText}>No graph data available</p>
        </div>
      );
    }
    
    return (
      <div style={{ height }}>
        <React.Suspense fallback={
          <div className="flex items-center justify-center h-full bg-muted/10">
            <div className="flex flex-col items-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
              <p className="text-sm text-muted-foreground">Loading graph renderer...</p>
            </div>
          </div>
        }>
          <ForceGraph2DComponent
            ref={graphRef}
            graphData={graphData}
            nodeAutoColorBy="type"
            nodeLabel={node => node.name}
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            linkLabel={getLinkLabel}
            linkColor={getLinkColor}
            onNodeClick={handleNodeClick}
            width={width}
            height={height}
            nodeCanvasObject={nodeCanvasObject}
            cooldownTicks={100}
            minZoom={0.5}
            maxZoom={5}
            warmupTicks={50}
            d3AlphaDecay={0.02} // Slower decay for more stable graph
            d3VelocityDecay={0.3} // Increased velocity decay for smoother motion
            onEngineStop={() => console.log('Graph physics simulation completed')}
            linkWidth={link => (link.value as number) * 2}
            nodeRelSize={6}
          />
        </React.Suspense>
      </div>
    );
  }
);

// Set display name for debugging
GraphRenderer.displayName = 'GraphRenderer';
