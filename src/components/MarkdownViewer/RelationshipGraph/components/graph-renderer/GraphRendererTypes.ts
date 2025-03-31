
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
  val?: number; // Changed to accept undefined values
  [key: string]: any;  // Allow for additional properties
}

/**
 * Core GraphLink representation
 */
export interface GraphLink {
  source: string;
  target: string;
  type?: string;
  weight?: number;
  value?: number; // Changed to accept undefined values
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
 * Tooltip content type
 */
export type TooltipContent = ReactNode | string | null;

/**
 * GraphRenderer component props
 */
export interface GraphRendererProps {
  graphData: GraphData;
  width: number;
  height: number;
  highlightedNodeId?: string | null;
  zoom?: number;
  onNodeClick?: (nodeId: string) => void;
  onLinkClick?: (source: string, target: string) => void;
}

/**
 * GraphRenderer ref methods
 */
export interface GraphRendererRef {
  centerOnNode: (nodeId: string) => void;
  zoomToFit: (duration?: number) => void;
  resetZoom: () => void;
  setZoom: (zoomLevel: number) => void;
  getGraphData: () => GraphData;
}
