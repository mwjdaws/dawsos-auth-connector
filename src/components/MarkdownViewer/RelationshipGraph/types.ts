
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
  x?: number;
  y?: number;
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
 * Tooltip content type
 */
export type TooltipContent = ReactNode | string | null;

/**
 * GraphRenderer component props
 */
export interface GraphRendererProps {
  graphData: GraphData;
  width?: number;
  height?: number;
  highlightedNodeId?: string | null;
  zoom?: number;
  onNodeClick?: ((nodeId: string) => void) | undefined;
  onLinkClick?: ((source: string, target: string) => void) | undefined;
}

/**
 * GraphRenderer ref methods
 */
export interface GraphRendererRef {
  centerOnNode: (nodeId: string) => void;
  centerAt: (x: number, y: number, duration?: number) => void;
  zoomToFit: (duration?: number) => void;
  resetZoom: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setZoom: (zoomLevel: number) => void;
  updateGraph: (newData: GraphData) => void;
  getNodeById: (id: string) => GraphNode | undefined;
  getGraphData: () => GraphData;
}

/**
 * RelationshipGraphPanel props
 */
export interface RelationshipGraphPanelProps {
  graphData: GraphData;
  title?: string;
  contentId?: string | undefined;
  className?: string;
  height?: number;
  width?: number | undefined;
  onNodeClick?: ((nodeId: string) => void) | undefined;
  hasAttemptedRetry?: boolean;
}
