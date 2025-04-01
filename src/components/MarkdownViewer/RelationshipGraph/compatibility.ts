
import { GraphData, GraphNode, GraphLink, GraphRendererRef } from './types';

/**
 * Ensure a value is a valid number
 */
export const ensureNumber = (value: any, defaultValue: number = 0): number => {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  return defaultValue;
};

/**
 * Ensure a value is a valid string
 */
export const ensureString = (value: any, defaultValue: string = ''): string => {
  if (typeof value === 'string') {
    return value;
  }
  return defaultValue;
};

/**
 * Ensure a value is a valid boolean
 */
export const ensureBoolean = (value: any, defaultValue: boolean = false): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  return defaultValue;
};

/**
 * Ensure zoom level is within valid range
 */
export const ensureValidZoom = (zoom: number | undefined, min: number = 0.1, max: number = 5): number => {
  const validZoom = ensureNumber(zoom, 1);
  return Math.min(Math.max(validZoom, min), max);
};

/**
 * Ensure graph data is valid
 */
export const ensureValidGraphData = (data: GraphData | null | undefined): GraphData => {
  if (!data) {
    return { nodes: [], links: [] };
  }
  
  return {
    nodes: Array.isArray(data.nodes) ? data.nodes : [],
    links: Array.isArray(data.links) ? data.links : []
  };
};

/**
 * Sanitize graph data to ensure all required properties exist
 */
export const sanitizeGraphData = (data: GraphData): GraphData => {
  const sanitizedNodes = data.nodes.map(node => ({
    id: ensureString(node.id),
    name: ensureString(node.name, node.title || `Node ${node.id}`),
    title: ensureString(node.title, node.name || `Node ${node.id}`),
    ...node
  }));

  const sanitizedLinks = data.links.map(link => {
    // Handle the case where link.source or link.target are objects
    const sourceId = typeof link.source === 'object' ? ensureString((link.source as GraphNode)?.id) : ensureString(link.source);
    const targetId = typeof link.target === 'object' ? ensureString((link.target as GraphNode)?.id) : ensureString(link.target);
    
    return {
      source: sourceId,
      target: targetId,
      type: ensureString(link.type, 'default'),
      ...link
    };
  });

  return {
    nodes: sanitizedNodes,
    links: sanitizedLinks
  };
};

/**
 * Creates a compatible ref object for the graph renderer
 */
export const createCompatibleGraphRef = (ref: React.RefObject<GraphRendererRef>): any => {
  // Return a proxy that safely handles method calls
  return {
    centerOnNode: (nodeId: string) => {
      try {
        if (ref.current && ref.current.centerOnNode) {
          ref.current.centerOnNode(nodeId);
        }
      } catch (error) {
        console.error('Error calling centerOnNode:', error);
      }
    },
    zoomToFit: (duration?: number) => {
      try {
        if (ref.current && ref.current.zoomToFit) {
          ref.current.zoomToFit(duration);
        }
      } catch (error) {
        console.error('Error calling zoomToFit:', error);
      }
    },
    resetZoom: () => {
      try {
        if (ref.current && ref.current.resetZoom) {
          ref.current.resetZoom();
        }
      } catch (error) {
        console.error('Error calling resetZoom:', error);
      }
    },
    setZoom: (zoomLevel: number) => {
      try {
        if (ref.current && ref.current.setZoom) {
          ref.current.setZoom(zoomLevel);
        }
      } catch (error) {
        console.error('Error calling setZoom:', error);
      }
    }
  };
};
