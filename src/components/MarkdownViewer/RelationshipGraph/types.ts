
/**
 * Type definitions for the RelationshipGraph components
 */

// Main graph data structure
export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Graph node representation
export interface GraphNode {
  id: string;
  name: string;
  type: 'source' | 'term';
  val: number;
  color: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  index?: number;
}

// Graph link representation
export interface GraphLink {
  id?: string;
  source: string;
  target: string;
  type: string;
  value: number;
}

// Props for the RelationshipGraph component
export interface RelationshipGraphProps {
  startingNodeId?: string;
  width?: number;
  height?: number;
  hasAttemptedRetry?: boolean;
}

// Props for the RelationshipGraphPanel component
export interface RelationshipGraphPanelProps {
  sourceId?: string;
  hasAttemptedRetry?: boolean;
}

export interface GraphRendererRef {
  centerOnNode: (nodeId: string) => void;
  setZoom: (zoomLevel: number, duration?: number) => void;
}
