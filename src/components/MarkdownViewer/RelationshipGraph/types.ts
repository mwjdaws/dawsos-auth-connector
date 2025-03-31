
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
  color?: string;
  size?: number;
  icon?: string;
  weight?: number;
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
 * GraphProps for RelationshipGraph component
 */
export interface GraphProps {
  startingNodeId?: string; 
  width?: number;
  height?: number;
  hasAttemptedRetry?: boolean;
}

/**
 * RelationshipGraph component props
 */
export interface RelationshipGraphProps {
  startingNodeId: string;
  width: number;
  height: number;
  hasAttemptedRetry: boolean;
}

/**
 * RelationshipGraphPanel component props
 */
export interface RelationshipGraphPanelProps {
  contentId: string;
  width?: number;
  height?: number;
}

/**
 * UseRelationshipGraph hook props
 */
export interface UseRelationshipGraphProps {
  startingNodeId: string;
  hasAttemptedRetry: boolean;
}

/**
 * GraphRendererProps for the graph renderer component
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
 * GraphRendererRef methods
 */
export interface GraphRendererRef {
  centerOn: (nodeId: string) => void;
  zoomToFit: (duration?: number) => void;
  resetViewport: () => void;
  getGraphData: () => GraphData;
  setZoom: (zoomLevel: number) => void;
}

/**
 * Error handling options 
 */
export interface WithErrorHandlingOptions {
  errorMessage?: string;
  level?: "info" | "warning" | "error";
  silent?: boolean;
  technical?: boolean;
  actionLabel?: string;
  onRetry?: () => void;
  preventDuplicate?: boolean;
  deduplicate?: boolean;
}

/**
 * Node renderer props interface
 */
export interface NodeRendererProps {
  getNodeColor: (node: GraphNode) => string;
  getNodeSize: (node: GraphNode) => number;
  nodeCanvasRenderer: (ctx: CanvasRenderingContext2D, node: GraphNode) => void;
}

/**
 * Link renderer props interface
 */
export interface LinkRendererProps {
  getLinkColor: (link: GraphLink) => string;
  getLinkWidth: (link: GraphLink) => number;
  getLinkLabel: (link: GraphLink) => string;
}
