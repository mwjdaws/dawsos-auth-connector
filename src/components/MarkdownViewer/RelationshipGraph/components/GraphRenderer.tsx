
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
import React, { useCallback, useMemo, useImperativeHandle, forwardRef, useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useNavigate } from 'react-router-dom';
import { GraphData, GraphNode, GraphLink } from '../types';

interface GraphRendererProps {
  graphData: GraphData;        // Data structure containing nodes and links
  width: number;               // Width of the graph container
  height: number;              // Height of the graph container
  highlightedNodeId?: string | null; // ID of the node to highlight
}

// Component with forwardRef to expose methods to parent
export const GraphRenderer = forwardRef<any, GraphRendererProps>(
  ({ graphData, width, height, highlightedNodeId }, ref) => {
    const navigate = useNavigate();
    const graphRef = useRef<any>(null);
    
    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
      centerOnNode: (nodeId: string) => {
        const node = graphData.nodes.find(n => n.id === nodeId);
        if (graphRef.current && node) {
          console.log(`Centering graph on node: ${node.name}`);
          graphRef.current.centerAt(node.x, node.y, 1000);
          graphRef.current.zoom(2.5, 1000);
        }
      }
    }));
    
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
          console.log(`Auto-centering on highlighted node: ${node.name}`);
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

    // Memoize node and link colors to prevent recalculations
    const colors = useMemo(() => {
      return {
        nodes: {
          source: '#4299e1', // blue
          term: '#68d391',   // green
          highlighted: '#f56565' // red for highlighted nodes
        },
        links: {
          default: '#999',
          wikilink: '#63b3ed',
          manual: '#9f7aea',
          'AI-suggested': '#f6ad55',
          'has_term': '#cbd5e0',
          'is_a': '#a0aec0',
          'part_of': '#e53e3e',
          'related_to': '#d69e2e'
        }
      };
    }, []);
    
    // Link color accessor function
    const getLinkColor = useCallback((link: GraphLink) => {
      const type = link.type as string;
      return colors.links[type as keyof typeof colors.links] || colors.links.default;
    }, [colors.links]);
    
    // Link label accessor function
    const getLinkLabel = useCallback((link: GraphLink) => {
      return link.type as string;
    }, []);
    
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
    
    // Memoized node canvas object renderer
    const nodeCanvasObject = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
      // Custom node rendering with text labels
      const label = node.name as string;
      const fontSize = 12/globalScale;
      ctx.font = `${fontSize}px Sans-Serif`;
      const textWidth = ctx.measureText(label).width;
      const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);
      
      // Determine if this node is highlighted
      const isHighlighted = highlightedNodeId === node.id;
      
      // Node circle - use highlighted color if this is the highlighted node
      ctx.fillStyle = isHighlighted 
        ? colors.nodes.highlighted 
        : (node.color as string || colors.nodes[node.type as 'source' | 'term']);
      
      const nodeSize = isHighlighted 
        ? (node.val as number) * 2.5 // Make highlighted nodes bigger
        : (node.val as number) * 2;
        
      ctx.beginPath();
      ctx.arc(node.x as number, node.y as number, nodeSize, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add a stroke for highlighted nodes
      if (isHighlighted) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2/globalScale;
        ctx.stroke();
      }
      
      // Only render text if we're zoomed in enough for it to be readable
      if (globalScale > 0.7) {
        // Text background
        ctx.fillStyle = isHighlighted 
          ? 'rgba(255, 240, 240, 0.9)' // Slightly red tint for highlighted nodes
          : 'rgba(255, 255, 255, 0.8)';
          
        ctx.fillRect(
          (node.x as number) - bckgDimensions[0] / 2,
          (node.y as number) + 6,
          bckgDimensions[0],
          bckgDimensions[1]
        );
        
        // Text
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isHighlighted ? '#e53e3e' : '#222';
        ctx.fillText(label, node.x as number, (node.y as number) + 6 + fontSize / 2);
      }
    }, [highlightedNodeId, colors.nodes]);
    
    // Handle empty data case - should never happen as this is checked in the parent
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
      </div>
    );
  }
);

// Set display name for debugging
GraphRenderer.displayName = 'GraphRenderer';
