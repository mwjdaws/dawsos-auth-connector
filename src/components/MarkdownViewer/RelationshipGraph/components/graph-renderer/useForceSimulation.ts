
import { useRef, useState, useEffect } from 'react';
import { 
  forceSimulation, 
  forceManyBody, 
  forceCenter, 
  forceLink,
  SimulationNodeDatum,
  Simulation
} from 'd3-force';
import { GraphData, GraphNode, GraphLink } from './GraphRendererTypes';

interface UseForceSimulationProps {
  graphData: GraphData;
  width: number;
  height: number;
}

export function useForceSimulation({ 
  graphData, 
  width, 
  height 
}: UseForceSimulationProps) {
  const simulationRef = useRef<Simulation<any, any> | null>(null);
  const [simulationNodes, setSimulationNodes] = useState<GraphNode[]>([]);
  const [simulationLinks, setSimulationLinks] = useState<GraphLink[]>([]);

  useEffect(() => {
    // Make sure we have node data
    if (!graphData.nodes.length) {
      setSimulationNodes([]);
      setSimulationLinks([]);
      return;
    }

    // Initialize the simulation
    if (!simulationRef.current) {
      // Extend nodes with D3 simulation properties
      const nodes = graphData.nodes.map((node: GraphNode) => ({
        ...node,
        x: node.x || Math.random() * width, 
        y: node.y || Math.random() * height,
      }));

      // Setup the simulation
      const simulation = forceSimulation()
        .force('charge', forceManyBody().strength(-300))
        .force('center', forceCenter(width / 2, height / 2))
        .force('link', forceLink().id((d: any) => d.id).distance(100))
        .on('tick', () => {
          setSimulationNodes([...nodes]);
          setSimulationLinks([...graphData.links]);
        });

      // Initialize with nodes
      simulation.nodes(nodes as any);
      (simulation.force('link') as any).links(graphData.links);
      
      simulationRef.current = simulation;
      
      // Initial state
      setSimulationNodes(nodes);
      setSimulationLinks(graphData.links);
    } else {
      // Update the simulation with new data
      const simulation = simulationRef.current;
      
      // Update nodes
      const nodes = graphData.nodes.map((node: GraphNode) => ({
        ...node,
        x: node.x || Math.random() * width,
        y: node.y || Math.random() * height,
      }));
      
      simulation.nodes(nodes as any);
      (simulation.force('link') as any).links(graphData.links);
      simulation.alpha(1).restart();
      
      setSimulationNodes(nodes);
      setSimulationLinks(graphData.links);
    }

    // Cleanup
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [graphData, width, height]);

  return {
    simulationNodes,
    simulationLinks
  };
}
