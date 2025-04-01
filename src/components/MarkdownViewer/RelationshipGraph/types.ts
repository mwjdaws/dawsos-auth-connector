
/**
 * Type definitions for the Relationship Graph
 */
import { MutableRefObject } from 'react';

// Graph data structures 
export interface GraphNode {
  id: string;
  name?: string;
  title?: string;
  type?: string;
  weight?: number;
  size?: number;
  color?: string;
  group?: string;
  [key: string]: any; // Allow additional properties
}

export interface GraphLink {
  source: string;
  target: string;
  type?: string;
  label?: string;
  weight?: number;
  width?: number;
  color?: string;
  [key: string]: any; // Allow additional properties
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Graph renderer controls and ref
export interface GraphRendererRef {
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setZoom: (scale: number) => void;
  centerOnNode: (nodeId: string) => void;
  updateGraph: (newData: GraphData) => void;
  getNodeById: (id: string) => GraphNode | undefined;
}

// For backwards compatibility
export type GraphNodeData = GraphNode;
export type GraphLinkData = GraphLink;
export type GraphDataFormat = GraphData;
