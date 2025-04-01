
import { ReactNode } from 'react';

/**
 * Core GraphNode representation
 */
export interface GraphNode {
  id: string;
  title?: string;
  name?: string;
  type?: string;
  domain?: string;
  color?: string | null;
  size?: number;
  icon?: string;
  weight?: number;
  val?: number;
  [key: string]: any;  // Allow for additional properties
}

/**
 * Core GraphLink representation
 */
export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type?: string;
  weight?: number;
  value?: number;
  label?: string;
  [key: string]: any;  // Allow for additional properties
}

/**
 * Complete graph data structure
 */
export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

/**
 * GraphRenderer ref methods
 */
export interface GraphRendererRef {
  centerOnNode: (nodeId: string) => void;
  centerAt: (x: number, y: number, duration?: number) => void;
  zoomToFit: (duration?: number) => void;
  setZoom: (zoomLevel: number) => void;
  getGraphData: () => GraphData;
}

/**
 * Props for relationship graph component
 */
export interface RelationshipGraphProps {
  startingNodeId: string;
  hasAttemptedRetry?: boolean;
  width?: number;
  height?: number;
  className?: string;
}
