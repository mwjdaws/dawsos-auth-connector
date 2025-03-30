
/**
 * Type definitions for the GraphRenderer component
 */

// Basic node and link types
export interface GraphNode {
  id: string;
  title: string;
  name: string;
  type: string;
  size?: number; // Added size property
  color?: string; // Added color property
  // Allow for force-graph specific properties
  [key: string]: any;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type: string;
  // Allow for force-graph specific properties
  [key: string]: any;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Component props
export interface GraphRendererProps {
  ref?: React.RefObject<GraphRendererRef>;
  graphData: GraphData;
  width: number;
  height: number;
  highlightedNodeId?: string | null;
  zoom?: number;
  onNodeClick?: (nodeId: string) => void;
  onLinkClick?: (link: GraphLink) => void;
}

// Rendering utility types
export interface NodeRendererOptions {
  getNodeSize: (node: GraphNode) => number;
  getNodeColor: (node: GraphNode) => string;
  nodeCanvasRenderer: (node: GraphNode & { x?: number; y?: number; }, ctx: CanvasRenderingContext2D, globalScale: number) => void;
}

export interface UseNodeRendererProps {
  highlightedNodeId?: string | null;
}

export interface GraphRendererRef {
  centerOnNode: (nodeId: string) => void;
  zoomToFit: (duration?: number) => void;
  resetZoom: () => void;
  setZoom: (zoom: number) => void;
  getGraphData: () => GraphData;
}

// Search and zoom control props
export interface GraphSearchProps {
  nodes: GraphNode[];
  onNodeFound: (nodeId: string) => void;
}

export interface GraphZoomControlProps {
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onReset: () => void;
  min: number;
  max: number;
  percent?: number; // Added optional percent field
}

// Type for tooltip content
export type TooltipContent = string | JSX.Element;
