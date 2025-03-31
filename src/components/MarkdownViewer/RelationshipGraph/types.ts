
/**
 * Type definitions for the RelationshipGraph components
 */

// Basic graph data types
export interface GraphNode {
  id: string;
  name: string;
  title: string;
  type: string;
  description?: string;
  val?: number;
  color?: string | null; // Changed from string | undefined to string | null
  [key: string]: any;
}

export interface GraphLink {
  id?: string;
  source: string;
  target: string;
  type?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Graph renderer ref interface
export interface GraphRendererRef {
  centerOn: (nodeId: string) => void;
  setZoom: (zoomLevel: number) => void;
  zoomToFit: () => void;
}

// Props for the main RelationshipGraph component
export interface GraphProps {
  startingNodeId?: string;
  width?: number;
  height?: number;
  hasAttemptedRetry?: boolean;
}

// Also using RelationshipGraphProps for backward compatibility
export interface RelationshipGraphProps extends GraphProps {}

// Props types for RelationshipGraphPanel component
export interface RelationshipGraphPanelProps {
  contentId?: string;
  sourceId?: string;
  width?: number;
  height?: number;
  hasAttemptedRetry?: boolean;
}

// Node data object for node operations
export interface NodeData {
  id: string;
  title: string;
  type: string;
}

// Graph statistics interface
export interface GraphStats {
  nodeCount: number;
  linkCount: number;
  isEmpty?: boolean;
  nodeTypes?: Record<string, number>;
}

// Graph renderer props for main graph visualization component
export interface GraphRendererProps {
  graphData: GraphData;
  width: number;
  height: number;
  highlightedNodeId: string | null;
  zoom: number;
}
