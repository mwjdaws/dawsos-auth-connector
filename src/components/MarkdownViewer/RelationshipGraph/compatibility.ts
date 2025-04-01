
/**
 * Compatibility utilities for the RelationshipGraph component
 * 
 * These functions ensure the graph data is valid and handles inconsistencies
 * that might occur when working with different data sources or legacy formats.
 */
import { GraphData, GraphNode, GraphLink, GraphProps } from './types';

/**
 * Ensure a value is a number
 */
export const ensureNumber = (value: any, defaultValue = 0): number => {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  return defaultValue;
};

/**
 * Ensure a value is a string
 */
export const ensureString = (value: any, defaultValue = ''): string => {
  if (typeof value === 'string') {
    return value;
  }
  return defaultValue;
};

/**
 * Ensure a value is a boolean
 */
export const ensureBoolean = (value: any, defaultValue = false): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  return defaultValue;
};

/**
 * Ensure a zoom value is valid (between 0.1 and 5)
 */
export const ensureValidZoom = (zoom: number | undefined): number => {
  const validZoom = ensureNumber(zoom, 1);
  return Math.max(0.1, Math.min(validZoom, 5));
};

/**
 * Ensure graph data is valid, filtering out invalid nodes and links
 */
export const ensureValidGraphData = (data: any): GraphData => {
  if (!data) {
    return { nodes: [], links: [] };
  }

  // Ensure nodes array exists and all nodes have an id
  const validNodes = Array.isArray(data.nodes) 
    ? data.nodes.filter(node => node && node.id).map(sanitizeGraphNode)
    : [];

  // Ensure links array exists and all links have source and target
  const validLinks = Array.isArray(data.links)
    ? data.links.filter(link => 
        link && 
        (typeof link.source === 'string' || (link.source && typeof link.source.id === 'string')) &&
        (typeof link.target === 'string' || (link.target && typeof link.target.id === 'string'))
      ).map(sanitizeGraphLink)
    : [];

  return {
    nodes: validNodes,
    links: validLinks
  };
};

/**
 * Sanitize a graph node to ensure all properties are valid
 */
const sanitizeGraphNode = (node: any): GraphNode => {
  return {
    id: ensureString(node.id),
    name: ensureString(node.name),
    title: ensureString(node.title),
    type: ensureString(node.type),
    x: ensureNumber(node.x),
    y: ensureNumber(node.y),
    color: ensureString(node.color),
    size: ensureNumber(node.size),
    highlighted: ensureBoolean(node.highlighted),
    metadata: node.metadata || {}
  };
};

/**
 * Sanitize a graph link to ensure all properties are valid
 */
const sanitizeGraphLink = (link: any): GraphLink => {
  return {
    source: typeof link.source === 'object' ? ensureString(link.source.id) : ensureString(link.source),
    target: typeof link.target === 'object' ? ensureString(link.target.id) : ensureString(link.target),
    type: ensureString(link.type),
    strength: ensureNumber(link.strength, 1),
    color: ensureString(link.color),
    width: ensureNumber(link.width, 1),
    highlighted: ensureBoolean(link.highlighted)
  };
};

/**
 * Create a safe GraphData object from potentially invalid data
 */
export const sanitizeGraphData = (data: any): GraphData => {
  return ensureValidGraphData(data);
};

/**
 * Create a compatible ref object for the graph renderer
 */
export const createCompatibleGraphRef = (): { current: any } => {
  return {
    current: {
      centerOn: (nodeId: string) => console.warn('Graph ref not initialized', nodeId),
      zoomToFit: (duration = 1000) => console.warn('Graph ref not initialized', duration),
      resetZoom: () => console.warn('Graph ref not initialized'),
      setZoom: (zoomLevel: number) => console.warn('Graph ref not initialized', zoomLevel),
      getGraphData: () => ({ nodes: [], links: [] })
    }
  };
};

/**
 * Create safe props for the RelationshipGraph component
 */
export const createSafeGraphProps = (props: Partial<GraphProps>): GraphProps => {
  return {
    startingNodeId: ensureString(props.startingNodeId, ''),
    width: ensureNumber(props.width, 800),
    height: ensureNumber(props.height, 600),
    hasAttemptedRetry: ensureBoolean(props.hasAttemptedRetry)
  };
};
