
/**
 * Graph Data Types
 * 
 * Types for graph visualization and data structures
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

export interface RelationshipGraphOptions {
  width?: number;
  height?: number;
  directed?: boolean;
  nodeSize?: number;
  linkWidth?: number;
  highlightedNodeId?: string | null;
}

export interface GraphStats {
  nodeCount: number;
  linkCount: number;
  connectedGroups: number;
  centralNodes: string[];
}
