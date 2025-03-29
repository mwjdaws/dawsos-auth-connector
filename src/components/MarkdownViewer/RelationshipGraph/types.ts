
/**
 * Type Definitions for the Relationship Graph
 * 
 * This file defines the TypeScript interfaces used throughout the
 * Knowledge Graph visualization components.
 */

/**
 * GraphNode interface
 * Represents a node in the knowledge graph, which can be either a source or term.
 */
export interface GraphNode {
  id: string;                 // Unique identifier for the node
  name: string;               // Display name for the node
  type: 'source' | 'term';    // Type of node (knowledge source or ontology term)
  val?: number;               // Optional value determining node size
  color?: string;             // Optional color for the node
  x?: number;                 // Optional x-coordinate (managed by force simulation)
  y?: number;                 // Optional y-coordinate (managed by force simulation)
}

/**
 * GraphLink interface
 * Represents a connection between two nodes in the knowledge graph.
 */
export interface GraphLink {
  source: string;             // ID of the source node
  target: string;             // ID of the target node
  type: string;               // Type of relationship between the nodes
  value?: number;             // Optional value determining link strength
}

/**
 * GraphData interface
 * Contains the complete data structure for the knowledge graph.
 */
export interface GraphData {
  nodes: GraphNode[];         // Array of nodes in the graph
  links: GraphLink[];         // Array of links between nodes
}

/**
 * RelationshipGraphProps interface
 * Props for the main RelationshipGraph component.
 */
export interface RelationshipGraphProps {
  startingNodeId?: string;    // Optional ID of node to focus on initially
  width?: number;             // Optional width of the graph container
  height?: number;            // Optional height of the graph container
}
