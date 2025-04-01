
import { ForceGraphMethods } from 'react-force-graph-2d';

/**
 * Basic node structure for the graph visualization
 */
export interface GraphNode {
  id: string;
  name?: string;
  title?: string;
  type?: string;
  color?: string;
  weight?: number;
  [key: string]: any;
}

/**
 * Basic link structure for the graph visualization
 */
export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type?: string;
  color?: string;
  width?: number;
  weight?: number;
  label?: string;
  [key: string]: any;
}

/**
 * Complete graph data structure
 */
export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

/**
 * Extended ForceGraphMethods interface for the graph renderer
 */
export interface GraphRendererRef extends Partial<ForceGraphMethods> {
  centerOn: (nodeId: string) => void;
  setZoom: (zoom: number) => void;
  zoomToFit: (duration?: number) => void;
  getNodeAt?: (x: number, y: number) => GraphNode | null;
}

/**
 * Props for the useRelationshipGraph hook
 */
export interface UseRelationshipGraphProps {
  startingNodeId: string;
  hasAttemptedRetry?: boolean;
}

/**
 * Return type for the useGraphState hook
 */
export interface UseGraphStateReturn {
  graphData: GraphData;
  loading: boolean;
  error: string | null;
  setGraphData: (data: GraphData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * Props for the GraphControls component
 */
export interface GraphControlsProps {
  zoomLevel: number;
  onZoomChange: (newZoom: number) => void;
  onResetZoom: () => void;
  isDisabled: boolean;
}
