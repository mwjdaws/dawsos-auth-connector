
/**
 * Types for Relationship Graph Components
 */

// Exports for graph data structures
export interface GraphNode {
  id: string;
  name?: string;
  title?: string;
  type?: string;
  description?: string;
  color?: string;
  [key: string]: any;
}

export interface GraphLink {
  source: string;
  target: string;
  id?: string;
  type?: string;
  label?: string;
  strength?: number;
  [key: string]: any;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Graph renderer props and ref types
export interface GraphRendererProps {
  graphData: GraphData;
  width: number;
  height: number;
  nodeColor?: (node: GraphNode) => string;
  highlightedNodeId?: string | null;
  backgroundColor?: string;
  onNodeClick?: (nodeId: string) => void;
  onLinkClick?: (link: GraphLink) => void;
  zoom?: number;
}

export interface GraphRendererRef {
  zoomIn: () => void;
  zoomOut: () => void;
  centerOn: (nodeId: string) => void;
  setZoom: (value: number) => void;
  resetZoom: () => void;
  exportImage: () => string;
  resetViewport?: () => void;
  getGraphData?: () => GraphData;
  zoomToFit?: (duration?: number) => void;
}

// Props for the main RelationshipGraph component
export interface GraphProps {
  startingNodeId?: string;
  width?: number;
  height?: number;
  hasAttemptedRetry?: boolean;
}

// Props for the panel version
export interface RelationshipGraphPanelProps {
  sourceId?: string;
  contentId?: string;
  hasAttemptedRetry?: boolean;
  width?: number;
  height?: number;
}

// Import error level type from the main error types
import { ErrorLevel } from '@/utils/errors/types';

// For error handling with graph operations
export interface WithErrorHandlingOptions {
  errorMessage?: string;
  silent?: boolean;
  level?: ErrorLevel;
  technical?: boolean;
  context?: Record<string, any>;
}
