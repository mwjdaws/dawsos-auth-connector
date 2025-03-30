
/**
 * Graph Node Type Definition
 * Represents a node in the relationship graph
 */
export type GraphNode = {
  id: string;
  title: string;  // Main node title
  name?: string;  // Display name for the node (used by force-graph library)
  type?: string;  // Node type for categorization (e.g., "source", "term", "document")
  color?: string; // Node color for visual distinction
  group?: string; // Group identifier for clustering nodes
  val?: number;   // Node size value (used for visual scaling)
  // Required for force-graph library positioning and physics
  x?: number;
  y?: number;
  index?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
};

/**
 * Graph Link Type Definition
 * Represents a link/edge between nodes in the relationship graph
 */
export type GraphLink = {
  source: string;  // Source node ID
  target: string;  // Target node ID
  label?: string;  // Optional label for the link
  type?: string;   // Link type (e.g., "wikilink", "manual", "AI-suggested")
  color?: string;  // Link color
  value?: number;  // Link strength or weight value
};

/**
 * Graph Data Structure
 * Contains the complete set of nodes and links for rendering a graph
 */
export type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
};

/**
 * GraphRenderer Props Interface
 * Properties for the GraphRenderer component
 */
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

/**
 * NodeRenderer Props Interface
 * Properties for components rendering individual nodes
 */
export interface NodeRendererProps {
  node: GraphNode;
  isSelected?: boolean;
  isHighlighted?: boolean;
}

/**
 * LinkRenderer Props Interface
 * Properties for components rendering individual links
 */
export interface LinkRendererProps {
  link: GraphLink;
  isHighlighted?: boolean;
}

/**
 * RelationshipGraph Props Interface
 * Properties for the main RelationshipGraph component
 */
export interface RelationshipGraphProps {
  startingNodeId?: string;
  width?: number;
  height?: number;
  hasAttemptedRetry?: boolean;
}

/**
 * RelationshipGraphPanel Props Interface
 * Properties for the RelationshipGraphPanel component
 */
export interface RelationshipGraphPanelProps {
  sourceId: string;
  hasAttemptedRetry: boolean;
}

/**
 * GraphRenderer Reference Interface
 * Methods exposed by the GraphRenderer component through forwardRef
 */
export interface GraphRendererRef {
  centerOnNode: (nodeId: string) => void;
  setZoom: (zoomLevel: number, duration?: number) => void;
}

/**
 * Error Handling Options Interface
 * Options for the withErrorHandling higher-order function
 */
export interface WithErrorHandlingOptions {
  errorMessage?: string;
  silent?: boolean;
  level?: "info" | "warning" | "error";
  context?: Record<string, any>;
}
