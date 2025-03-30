
/**
 * RelationshipGraph Types
 * 
 * This file defines all the types used in the RelationshipGraph components.
 * Includes interfaces for nodes, links, props, and various rendering configuration options.
 */

// Basic data types
export interface GraphNode {
  id: string;
  title: string;
  name: string;  // Required for node label display
  type: string;  // Required for node styling (e.g., "source", "term")
  val?: number;  // Size value for the node
  color?: string;
  x?: number;    // Position x - added for force graph rendering
  y?: number;    // Position y - added for force graph rendering
}

export interface GraphLink {
  source: string;
  target: string;
  type: string;  // Required for link styling
  value?: number;
  label?: string;
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
  contentId?: string;
  initialZoom?: number;
  showControls?: boolean;
  className?: string;
  hasAttemptedRetry?: boolean;
}

export interface RelationshipGraphPanelProps {
  sourceId?: string;
  contentId?: string;
  className?: string;
  isCollapsible?: boolean;
  hasAttemptedRetry?: boolean;
}

export interface GraphRendererProps {
  graphData: GraphData;
  width: number;
  height: number;
  highlightedNodeId?: string | null;
  zoom?: number;
}

// Renderer component props
export interface NodeRendererProps {
  node: GraphNode;
  color: string;
  size: number;
  showLabel: boolean;
  onClick?: (node: GraphNode) => void;
}

export interface LinkRendererProps {
  link: GraphLink;
  color: string;
  width: number;
  showLabel: boolean;
  onClick?: (link: GraphLink) => void;
}

// Ref for imperative handle
export interface GraphRendererRef {
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  centerGraph: () => void;
  centerOnNode: (nodeId: string) => void;
  setZoom: (zoomLevel: number, duration?: number) => void;
}

// Error handling options
export interface WithErrorHandlingOptions {
  errorMessage?: string;
  fallback?: React.ReactNode;
  retryable?: boolean;
}
