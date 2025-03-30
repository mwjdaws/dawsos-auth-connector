
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
  contentId?: string;
  initialZoom?: number;
  showControls?: boolean;
  className?: string;
}

export interface RelationshipGraphPanelProps {
  contentId?: string;
  className?: string;
  isCollapsible?: boolean;
}

export interface GraphRendererProps {
  data: GraphData;
  onNodeClick?: (node: GraphNode) => void;
  onLinkClick?: (link: GraphLink) => void;
  width?: number;
  height?: number;
  nodeSize?: number;
  backgroundColor?: string;
  showLabels?: boolean;
  zoomLevel?: number;
  onZoomChange?: (zoomLevel: number) => void;
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
}

// Error handling options
export interface WithErrorHandlingOptions {
  errorMessage?: string;
  fallback?: React.ReactNode;
  retryable?: boolean;
}
