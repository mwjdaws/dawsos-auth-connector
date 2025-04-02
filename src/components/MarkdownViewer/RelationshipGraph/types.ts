
/**
 * Graph Data Types
 * 
 * Common type definitions for graph data structures
 */

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
