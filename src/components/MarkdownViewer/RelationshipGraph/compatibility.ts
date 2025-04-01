
/**
 * Compatibility layer for RelationshipGraph
 * This file contains utilities to handle different data formats and prop types
 */
import { GraphProps, GraphData } from './types';

/**
 * Ensures GraphProps are valid and have safe defaults
 */
export function createSafeGraphProps(props: GraphProps): GraphProps {
  return {
    startingNodeId: props.startingNodeId || '',
    hasAttemptedRetry: props.hasAttemptedRetry || false,
    width: props.width && props.width > 0 ? props.width : 800,
    height: props.height && props.height > 0 ? props.height : 600
  };
}

/**
 * Creates safe empty graph data
 */
export function createEmptyGraphData(): GraphData {
  return {
    nodes: [],
    links: []
  };
}

/**
 * Ensures a string value is valid
 */
export function ensureValidString(value: any, defaultValue = ''): string {
  if (typeof value === 'string') {
    return value;
  }
  return defaultValue;
}

/**
 * Ensures a node ID is valid for use in the graph
 */
export function ensureValidNodeId(nodeId: any): string | null {
  if (!nodeId) return null;
  
  if (typeof nodeId === 'string' && nodeId.trim() !== '') {
    return nodeId.trim();
  }
  
  if (typeof nodeId === 'number') {
    return String(nodeId);
  }
  
  return null;
}
