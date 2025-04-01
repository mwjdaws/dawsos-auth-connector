
import { useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { GraphNode, GraphLink } from '../../types';
import { ensureString } from '@/utils/compatibility';

interface ForceSimulationOptions {
  nodes: GraphNode[];
  links: GraphLink[];
  onTick: () => void;
  strength?: number;
  distance?: number;
}

/**
 * Hook to create and manage D3 force simulation
 */
export function useForceSimulation({
  nodes,
  links,
  onTick,
  strength = -300,
  distance = 100
}: ForceSimulationOptions) {
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);

  // Initialize simulation
  const startSimulation = useCallback(() => {
    if (!nodes || !nodes.length) return;

    // Setup forces
    simulationRef.current = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links)
        .id((d: any) => ensureString(d.id))
        .distance(distance))
      .force('charge', d3.forceManyBody().strength(strength))
      .force('center', d3.forceCenter())
      .force('collision', d3.forceCollide().radius(30))
      .on('tick', onTick);

    return simulationRef.current;
  }, [nodes, links, onTick, strength, distance]);

  // Stop simulation
  const stopSimulation = useCallback(() => {
    if (simulationRef.current) {
      simulationRef.current.stop();
    }
  }, []);

  // Restart simulation with new data
  const restartSimulation = useCallback((newNodes: GraphNode[], newLinks: GraphLink[]) => {
    if (!newNodes || !newNodes.length) return;
    
    stopSimulation();
    
    simulationRef.current = d3.forceSimulation(newNodes)
      .force('link', d3.forceLink(newLinks)
        .id((d: any) => ensureString(d.id))
        .distance(distance))
      .force('charge', d3.forceManyBody().strength(strength))
      .force('center', d3.forceCenter())
      .force('collision', d3.forceCollide().radius(30))
      .on('tick', onTick);
      
    return simulationRef.current;
  }, [onTick, stopSimulation, strength, distance]);

  return {
    startSimulation,
    stopSimulation,
    restartSimulation,
    simulation: simulationRef.current
  };
}
