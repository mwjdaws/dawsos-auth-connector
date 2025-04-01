
import { useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { GraphNode } from '../../types';
import { ensureString } from '@/utils/compatibility';

interface NodeRendererOptions {
  onNodeClick?: (nodeId: string) => void;
}

export function useNodeRenderer(
  svgRef: React.RefObject<SVGSVGElement>,
  gRef: React.RefObject<SVGGElement>,
  options: NodeRendererOptions = {}
) {
  const nodesRef = useRef<d3.Selection<SVGGElement, GraphNode, SVGGElement, unknown>>();
  const nodeDataRef = useRef<GraphNode[]>([]);
  
  // Render nodes initially
  const renderNodes = useCallback((nodes: GraphNode[], highlightedNodeId: string = '') => {
    if (!gRef.current) return;
    
    nodeDataRef.current = nodes;
    
    // Remove any existing nodes
    d3.select(gRef.current).selectAll('.node').remove();
    
    // Create node elements
    nodesRef.current = d3.select(gRef.current)
      .selectAll('.node')
      .data(nodes, (d: any) => ensureString(d.id))
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('id', d => `node-${ensureString(d.id)}`)
      .attr('data-id', d => ensureString(d.id))
      .classed('highlighted', d => ensureString(d.id) === highlightedNodeId);
    
    // Add node circles
    nodesRef.current
      .append('circle')
      .attr('r', d => d.size || 15)
      .attr('fill', d => d.color || '#69b3a2')
      .attr('stroke', d => d.color || '#69b3a2')
      .attr('stroke-width', 2);
    
    // Add node labels
    nodesRef.current
      .append('text')
      .text(d => d.name || d.title || d.id || '')
      .attr('dy', 30)
      .attr('text-anchor', 'middle')
      .attr('class', 'node-label');
    
    // Add click events
    if (options.onNodeClick) {
      nodesRef.current.on('click', (event, d) => {
        options.onNodeClick?.(ensureString(d.id));
      });
    }
    
    return nodesRef.current;
  }, [gRef, options]);
  
  // Update node positions
  const updateNodePositions = useCallback(() => {
    if (!nodesRef.current) return;
    
    nodesRef.current
      .attr('transform', d => `translate(${d.x || 0}, ${d.y || 0})`);
  }, [nodesRef]);
  
  // Get a node by ID
  const getNodeById = useCallback((id: string): GraphNode | undefined => {
    return nodeDataRef.current.find(n => n.id === id);
  }, [nodeDataRef]);
  
  return {
    renderNodes,
    updateNodePositions,
    getNodeById,
  };
}
