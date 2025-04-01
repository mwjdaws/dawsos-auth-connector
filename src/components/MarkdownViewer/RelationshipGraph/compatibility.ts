
/**
 * Compatibility utilities for the relationship graph
 * 
 * These functions help ensure proper type safety and data validation
 * when working with the graph data.
 */
import { GraphData, GraphNode, GraphLink, GraphRendererRef } from './types';

/**
 * Ensures a value is a number
 */
export const ensureNumber = (value: any, defaultValue = 0): number => {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  return defaultValue;
};

/**
 * Ensures a value is a string
 */
export const ensureString = (value: any, defaultValue = ''): string => {
  if (typeof value === 'string') {
    return value;
  }
  return defaultValue;
};

/**
 * Ensures a value is a boolean
 */
export const ensureBoolean = (value: any, defaultValue = false): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  return defaultValue;
};

/**
 * Ensures a zoom value is valid
 */
export const ensureValidZoom = (zoom: number): number => {
  if (isNaN(zoom) || zoom < 0.2) {
    return 0.2;
  }
  if (zoom > 2) {
    return 2;
  }
  return zoom;
};

/**
 * Validates and sanitizes graph data
 */
export const ensureValidGraphData = (data: any): GraphData => {
  if (!data) {
    return { nodes: [], links: [] };
  }
  
  const nodes = Array.isArray(data.nodes) ? data.nodes : [];
  const links = Array.isArray(data.links) ? data.links : [];
  
  return {
    nodes,
    links
  };
};

/**
 * Sanitizes graph data to ensure all required properties exist
 */
export const sanitizeGraphData = (data: GraphData): GraphData => {
  const sanitizedNodes = data.nodes.map((node: GraphNode) => ({
    id: ensureString(node.id, `node-${Math.random().toString(36).substr(2, 9)}`),
    name: ensureString(node.name),
    title: ensureString(node.title),
    type: ensureString(node.type, 'default'),
    weight: ensureNumber(node.weight, 1)
  }));
  
  const nodeMap = new Map(sanitizedNodes.map(node => [node.id, node]));
  
  const sanitizedLinks = data.links.map((link: GraphLink) => {
    const sourceId = typeof link.source === 'string' ? link.source : link.source?.id;
    const targetId = typeof link.target === 'string' ? link.target : link.target?.id;
    
    return {
      source: ensureString(sourceId),
      target: ensureString(targetId),
      type: ensureString(link.type, 'default'),
      weight: ensureNumber(link.weight, 1)
    };
  }).filter(link => 
    nodeMap.has(link.source as string) && 
    nodeMap.has(link.target as string)
  );
  
  return {
    nodes: sanitizedNodes,
    links: sanitizedLinks
  };
};

/**
 * Creates a compatible graph ref with safely typed methods
 */
export const createCompatibleGraphRef = (): GraphRendererRef => {
  return {
    centerOn: (nodeId: string) => {},
    zoomToFit: (duration?: number) => {},
    resetZoom: () => {},
    setZoom: (zoomLevel: number) => {},
    getGraphData: () => ({ nodes: [], links: [] })
  };
};

/**
 * Creates safe props for the graph renderer
 */
export const createSafeGraphProps = (props: any): any => {
  return {
    graphData: ensureValidGraphData(props.graphData),
    width: ensureNumber(props.width, 800),
    height: ensureNumber(props.height, 600),
    highlightedNodeId: props.highlightedNodeId || null,
    zoom: ensureValidZoom(props.zoom ?? 1)
  };
};
