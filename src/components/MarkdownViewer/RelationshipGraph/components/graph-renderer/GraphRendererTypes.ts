
/**
 * Graph Renderer Types
 * 
 * Common type definitions for graph renderer components
 */
import { GraphData, GraphNode, GraphLink } from '../../../types';

// Re-export the base types
export type { GraphNode, GraphLink, GraphData };

// Renderer specific types
export interface GraphRendererProps {
  graphData: GraphData;
  width: number;
  height: number;
  highlightedNodeId?: string | null;
  zoom?: number;
  onNodeClick?: (nodeId: string) => void;
  onLinkClick?: (source: string, target: string) => void;
}

export interface GraphRendererRef {
  centerOnNode: (nodeId: string) => void;
  centerAt: (x: number, y: number, duration?: number) => void;
  zoomToFit: (duration?: number) => void;
  resetZoom: () => void;
  zoom: (zoomLevel: number, duration?: number) => void;
  setZoom: (zoomLevel: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  getGraphData: () => GraphData;
}

export interface NodeRendererOptions {
  onNodeClick?: (nodeId: string) => void;
}

export interface LinkRendererOptions {
  onLinkClick?: (source: string, target: string) => void;
}
