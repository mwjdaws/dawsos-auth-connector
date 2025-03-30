
export type GraphNode = {
  id: string;
  title: string;
  name?: string;  // Added for compatibility with graph-renderer
  type?: string;  // Added for node type identification
  color?: string;
  group?: string;
  val?: number;   // Added for node sizing
  // Required for force-graph library
  x?: number;
  y?: number;
  index?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
};

export type GraphLink = {
  source: string;
  target: string;
  label?: string;
  type?: string;  // Added for link type
  color?: string;
  value?: number;
};

export type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
};

export interface GraphRendererProps {
  data: GraphData;
  onNodeClick?: (node: GraphNode) => void;
  onLinkClick?: (link: GraphLink) => void;
  selectedNodeIds?: string[];
  highlightNodeIds?: string[];
  autoCenter?: boolean;
  height?: number;
  width?: number;
}

export interface NodeRendererProps {
  node: GraphNode;
  isSelected?: boolean;
  isHighlighted?: boolean;
}

export interface LinkRendererProps {
  link: GraphLink;
  isHighlighted?: boolean;
}

// Add the missing interfaces that are causing errors
export interface RelationshipGraphProps {
  startingNodeId?: string;
  width?: number;
  height?: number;
  hasAttemptedRetry?: boolean;
}

export interface RelationshipGraphPanelProps {
  sourceId: string;
  hasAttemptedRetry: boolean;
}

export interface GraphRendererRef {
  centerOnNode: (nodeId: string) => void;
  setZoom: (zoomLevel: number, duration?: number) => void;
}

// Add this type for withErrorHandling options
export interface WithErrorHandlingOptions {
  errorMessage?: string;
  silent?: boolean;
  level?: "info" | "warning" | "error";
  context?: Record<string, any>;
}
