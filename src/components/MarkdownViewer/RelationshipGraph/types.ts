
/**
 * RelationshipGraph Type Definitions
 * 
 * This file contains type definitions for the RelationshipGraph component and related hooks.
 * These types ensure proper data structures and props are used throughout the graph visualization.
 */

// Node Types
export type NodeType = 'source' | 'term';

// Graph Node Properties
export interface GraphNode {
  id: string;         // Unique identifier for the node
  name: string;       // Display name for the node
  type: NodeType;     // Type of node (source or term)
  val?: number;       // Size value for the node
  color?: string;     // Color of the node
  x?: number;         // X position (set by force graph)
  y?: number;         // Y position (set by force graph)
  vx?: number;        // X velocity (set by force graph)
  vy?: number;        // Y velocity (set by force graph)
  index?: number;     // Index in the array (set by force graph)
  domain?: string;    // Domain for term nodes
}

// Graph Link Properties
export interface GraphLink {
  source: string;     // Source node ID or reference
  target: string;     // Target node ID or reference
  type: string;       // Type of relationship
  value?: number;     // Strength/width of the link
  index?: number;     // Index in the array (set by force graph)
}

// Complete Graph Data Structure
export interface GraphData {
  nodes: GraphNode[];  // Array of graph nodes
  links: GraphLink[];  // Array of connections between nodes
}

// RelationshipGraph Component Props
export interface RelationshipGraphProps {
  startingNodeId?: string;  // Optional ID to center the graph on
  width?: number;           // Width of the graph
  height?: number;          // Height of the graph
}

// GraphHeader Component Props
export interface GraphHeaderProps {
  graphData: GraphData;     // Graph data for showing statistics
}

// GraphError Component Props
export interface GraphErrorProps {
  error: string;            // Error message to display
  onRetry: () => void;      // Retry function
}

// Zoom Control Props
export interface ZoomControlProps {
  zoom: number;             // Current zoom level
  onZoomChange: (zoom: number) => void;  // Zoom change handler
  onReset: () => void;      // Reset zoom handler
  min?: number;             // Minimum zoom level
  max?: number;             // Maximum zoom level
  step?: number;            // Zoom step increment
}
