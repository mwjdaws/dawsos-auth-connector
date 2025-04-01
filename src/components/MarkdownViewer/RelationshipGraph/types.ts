
/**
 * Types for the relationship graph component
 */

export interface GraphNode {
  id: string;
  name: string;
  title?: string; // Added title property
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
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface GraphConfig {
  nodeRelSize?: number;
  nodeColor?: string;
  linkColor?: string;
  linkWidth?: number;
  linkDirectional?: boolean;
  backgroundColor?: string;
  highlightColor?: string;
  fontSize?: number;
}

export interface GraphState extends GraphData {
  config: GraphConfig;
  isLoading: boolean;
  error: Error | null;
  selectedNode: GraphNode | null;
  hoverNode: GraphNode | null;
  highlightLinks: GraphLink[];
}

export interface GraphAction {
  type: string;
  payload?: any;
}

export interface RelatedNote {
  id: string;
  title?: string;
  score?: number;
  applied: boolean;
  rejected: boolean;
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

export type GraphReducer = (state: GraphState, action: GraphAction) => GraphState;
