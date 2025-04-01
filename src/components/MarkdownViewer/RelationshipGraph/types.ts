
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
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type?: string;
}

// Main data structure
export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Graph renderer ref methods
export interface GraphRendererRef {
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setZoom: (zoom: number) => void;
  centerOnNode: (nodeId: string) => void;
}

// Node renderer options
export interface NodeRendererOptions {
  onNodeClick?: (nodeId: string) => void;
}

// Link renderer options
export interface LinkRendererOptions {
  onLinkClick?: (source: string, target: string) => void;
}

// Graph renderer props
export interface GraphRendererProps {
  graphData: GraphData;
  width: number;
  height: number;
  zoom?: number;
  highlightedNodeId?: string | null;
  onNodeClick?: (nodeId: string) => void;
  onLinkClick?: (source: string, target: string) => void;
}
