
import { GraphProps, GraphData } from './types';

/**
 * Ensures that zoom level is valid
 * 
 * @param zoom - The zoom level to validate
 * @param defaultValue - Default zoom level if invalid
 * @returns A valid zoom level
 */
export function ensureValidZoom(zoom: number | undefined, defaultValue: number = 1): number {
  if (typeof zoom !== 'number' || isNaN(zoom) || zoom <= 0) {
    return defaultValue;
  }
  
  // Constrain zoom to reasonable bounds
  return Math.max(0.1, Math.min(5, zoom));
}

/**
 * Creates safe graph props with defaults
 * 
 * @param props - Graph props to sanitize
 * @returns Safe graph props with defaults for missing values
 */
export function createSafeGraphProps(props: GraphProps): GraphProps {
  return {
    startingNodeId: props.startingNodeId || '',
    width: typeof props.width === 'number' ? props.width : 800,
    height: typeof props.height === 'number' ? props.height : 600,
    hasAttemptedRetry: !!props.hasAttemptedRetry
  };
}

/**
 * Creates empty graph data
 * 
 * @returns Empty graph data structure
 */
export function createEmptyGraphData(): GraphData {
  return {
    nodes: [],
    links: []
  };
}

/**
 * Ensures graph data is valid
 * 
 * @param data - Graph data to validate
 * @returns Valid graph data
 */
export function ensureValidGraphData(data: GraphData | null | undefined): GraphData {
  if (!data || !Array.isArray(data.nodes) || !Array.isArray(data.links)) {
    return createEmptyGraphData();
  }
  
  return {
    nodes: data.nodes.filter(node => node && typeof node.id === 'string'),
    links: data.links.filter(link => 
      link && 
      typeof link.source === 'string' && 
      typeof link.target === 'string'
    )
  };
}
