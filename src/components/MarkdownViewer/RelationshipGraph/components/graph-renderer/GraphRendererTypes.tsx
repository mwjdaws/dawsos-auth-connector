
/**
 * Graph Renderer Types
 * 
 * Common type definitions for graph renderer components
 */

// Define our own types instead of importing from a non-existent file
export interface GraphNode {
  id: string;
  name: string;
  title?: string;
  type?: string;
  color?: string;
  val?: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
  index?: number;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type?: string;
  value?: number;
  color?: string;
  label?: string;
  width?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Renderer specific types with optional callback functions
export interface GraphRendererProps {
  graphData: GraphData;
  width: number;
  height: number;
  highlightedNodeId?: string | null;
  zoom?: number;
  onNodeClick?: ((nodeId: string) => void) | undefined;
  onLinkClick?: ((source: string, target: string) => void) | undefined;
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
  onNodeClick?: ((nodeId: string) => void) | undefined;
}

export interface LinkRendererOptions {
  onLinkClick?: ((source: string, target: string) => void) | undefined;
}
