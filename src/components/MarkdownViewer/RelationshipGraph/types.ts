
/**
 * Type definitions for the RelationshipGraph component and related utilities
 */

// Graph data types
export interface GraphNode {
  id: string;
  name: string;
  type: 'source' | 'term'; // Source nodes are knowledge sources, term nodes are ontology terms
  val?: number; // Size of the node
  color?: string;
  x?: number;
  y?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  type: string;
  value?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Component props
export interface RelationshipGraphProps {
  startingNodeId?: string;
  width?: number;
  height?: number;
  hasAttemptedRetry?: boolean;
}

export interface RelationshipGraphPanelProps {
  sourceId?: string;
  hasAttemptedRetry?: boolean;
}
