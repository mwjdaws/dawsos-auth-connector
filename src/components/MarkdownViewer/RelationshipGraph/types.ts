
/**
 * Type definitions for the Relationship Graph component
 */
import { OntologyTerm, RelatedTerm } from '@/types/ontology';

// Re-export types properly for TS with isolatedModules
export type { OntologyTerm, RelatedTerm };

/**
 * Main graph data structure
 */
export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

/**
 * Graph node interface
 */
export interface GraphNode {
  id: string;
  name?: string;
  title?: string;
  type?: string;
  x?: number;
  y?: number;
  color?: string;
  size?: number;
  highlighted?: boolean;
  metadata?: Record<string, any>;
  weight?: number;
}

/**
 * Graph link interface
 */
export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type?: string;
  strength?: number;
  color?: string;
  width?: number;
  highlighted?: boolean;
  weight?: number;
}

/**
 * Props for GraphRenderer component
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
 * Props for the main RelationshipGraph component
 */
export interface GraphProps {
  startingNodeId: string;
  width?: number;
  height?: number;
  hasAttemptedRetry?: boolean;
}

/**
 * Props for GraphControls component
 */
export interface GraphControlsProps {
  zoomLevel: number;
  onZoomChange: (newZoom: number) => void;
  onResetZoom: () => void;
  isDisabled: boolean;
}

/**
 * Props for UseRelationshipGraphProps hook
 */
export interface UseRelationshipGraphProps {
  startingNodeId: string;
  hasAttemptedRetry?: boolean;
}

/**
 * Ref interface for GraphRenderer to expose methods
 */
export interface GraphRendererRef {
  centerOn: (nodeId: string) => void;
  zoomToFit: (duration?: number) => void;
  resetZoom: () => void;
  setZoom: (zoomLevel: number) => void;
  getGraphData: () => GraphData;
}
