
/**
 * GraphRenderer Component
 * 
 * This component renders the force-directed graph visualization using react-force-graph-2d.
 * It handles:
 * - Setting up the graph visualization
 * - Configuring node and link appearance
 * - Custom node rendering with labels
 * - Handling node click events for navigation
 * 
 * Performance optimizations:
 * - Memoized callbacks
 * - Optimized node rendering
 * - Throttled node updates
 */
import React, { useCallback, useMemo, memo, useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useNavigate } from 'react-router-dom';
import { GraphData, GraphNode } from '../types';

interface GraphRendererProps {
  graphData: GraphData;    // Data structure containing nodes and links
  width: number;           // Width of the graph container
  height: number;          // Height of the graph container
}

// Memoized component to prevent unnecessary re-renders
export const GraphRenderer = memo(({ graphData, width, height }: GraphRendererProps) => {
  const navigate = useNavigate();
  const graphRef = useRef(null);
  
  /**
   * Handles node click events
   * - For source nodes: Navigate to the source detail page
   * - For term nodes: Log the term details (could be expanded to show details in UI)
   */
  const handleNodeClick = useCallback((node: GraphNode) => {
    if (node.type === 'source') {
      navigate(`/source/${node.id}`);
    } else {
      // Could show term details in a modal/sidebar
      console.log('Term clicked:', node);
    }
  }, [navigate]);

  // Memoize node colors to prevent recalculations
  const nodeColors = useMemo(() => {
    return {
      source: '#4299e1', // blue
      term: '#68d391'    // green
    };
  }, []);
  
  // Reset graph when data changes
  useEffect(() => {
    // Allow the graph to stabilize after data changes
    const timer = setTimeout(() => {
      if (graphRef.current) {
        // @ts-ignore - ForceGraph2D instance has zoomToFit method
        graphRef.current.zoomToFit(400, 40);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [graphData]);
  
  // Memoized node canvas object renderer
  const nodeCanvasObject = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    // Custom node rendering with text labels
    const label = node.name as string;
    const fontSize = 12/globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);
    
    // Node circle
    ctx.fillStyle = node.color as string || nodeColors[node.type as 'source' | 'term'];
    ctx.beginPath();
    ctx.arc(node.x as number, node.y as number, node.val as number * 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Only render text if we're zoomed in enough for it to be readable
    if (globalScale > 0.7) {
      // Text background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(
        (node.x as number) - bckgDimensions[0] / 2,
        (node.y as number) + 6,
        bckgDimensions[0],
        bckgDimensions[1]
      );
      
      // Text
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#222';
      ctx.fillText(label, node.x as number, (node.y as number) + 6 + fontSize / 2);
    }
  }, [nodeColors]);
  
  // Handle empty data case
  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-muted-foreground">No graph data available</p>
      </div>
    );
  }
  
  return (
    <div style={{ height }}>
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeAutoColorBy="type"
        nodeLabel={node => node.name}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        linkLabel={link => link.type as string}
        linkColor={() => "#999"}
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
      />
    </div>
  );
});

// Set display name for debugging
GraphRenderer.displayName = 'GraphRenderer';
