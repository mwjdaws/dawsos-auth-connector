
/**
 * Relationship Graph Type Definitions
 */

// Basic node and link types
export interface GraphNode {
  id: string;
  name?: string;
  title?: string;
  color?: string;
  type?: string;
  // D3 simulation properties
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  // Display properties
  size?: number;
  icon?: string;
  weight?: number;
  val?: number;
  [key: string]: any;  // Allow for additional properties
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type?: string;
  weight?: number;
  value?: number;
  label?: string;
  // Display properties
  color?: string;
  width?: number;
  [key: string]: any;  // Allow for additional properties
}

// Main data structure
export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Tooltip content type
export type TooltipContent = React.ReactNode | string | null;

// GraphRenderer component props
export interface GraphRendererProps {
  graphData: GraphData;
  width: number;
  height: number;
  highlightedNodeId?: string | null;
  zoom?: number;
  onNodeClick?: ((nodeId: string) => void) | undefined;
  onLinkClick?: ((source: string, target: string) => void) | undefined;
}

// Node renderer options
export interface NodeRendererOptions {
  onNodeClick?: ((nodeId: string) => void) | undefined;
}

// Link renderer options
export interface LinkRendererOptions {
  onLinkClick?: ((source: string, target: string) => void) | undefined;
}

// GraphRenderer ref methods
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
