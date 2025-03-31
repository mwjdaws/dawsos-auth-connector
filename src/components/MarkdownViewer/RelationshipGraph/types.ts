
/**
 * Types for the RelationshipGraph component
 */

// Core node and link types
export interface GraphNode {
  id: string;
  name?: string;
  title?: string;
  type?: string;
  color?: string;
  size?: number;
  [key: string]: any;
}

export interface GraphLink {
  source: string;
  target: string;
  type?: string;
  value?: number;
  label?: string;
  [key: string]: any;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Props for the RelationshipGraph component
export interface GraphProps {
  startingNodeId?: string;
  hasAttemptedRetry?: boolean;
  width?: number;
  height?: number;
}

// Reference to the graph renderer for imperative actions
export interface GraphRendererRef {
  centerOn: (nodeId: string) => void;
  setZoom: (zoom: number) => void;
  zoomToFit: () => void;
  findNode: (id: string) => GraphNode | undefined;
}

// Stats for the graph
export interface GraphStats {
  nodeCount: number;
  linkCount: number;
  nodeTypes?: Record<string, number>;
}

// Configuration for the graph rendering
export interface GraphConfig {
  forceStrength?: number;
  linkDistance?: number;
  nodeRadius?: number;
  fontSize?: number;
  highlightColor?: string;
  nodeLabelField?: string;
  linkLabelField?: string;
}
