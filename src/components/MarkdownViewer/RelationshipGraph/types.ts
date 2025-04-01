
import { ReactNode } from 'react';
import { GraphNode, GraphLink, GraphData, GraphRendererRef } from './components/graph-renderer/GraphRendererTypes';

export { GraphNode, GraphLink, GraphData, GraphRendererRef };

export interface RelationshipGraphProps {
  startingNodeId: string;
  width?: number;
  height?: number;
  hasAttemptedRetry?: boolean;
}

export interface NodeData {
  id: string;
  label: string;
  type?: string;
  color?: string;
}

export interface LinkData {
  source: string;
  target: string;
  label?: string;
  type?: string;
}

export interface UseRelationshipGraphProps {
  startingNodeId: string;
  hasAttemptedRetry?: boolean;
}

export interface UseRelationshipGraphResult {
  graphData: GraphData;
  loading: boolean;
  loadingTime: number;
  error: string | null;
  highlightedNodeId: string | null;
  zoomLevel: number;
  isPending: boolean;
  graphRendererRef: React.RefObject<GraphRendererRef>;
  graphStats: {
    nodeCount: number;
    linkCount: number;
    isEmpty: boolean;
    nodeTypes?: Record<string, number>;
  };
  handleNodeFound: (nodeId: string) => void;
  handleZoomChange: (zoom: number) => void;
  handleResetZoom: () => void;
  handleRetry: () => void;
}

export interface UseGraphStateReturn {
  graphData: GraphData;
  loading: boolean;
  error: string | null;
  setGraphData: (data: GraphData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface GraphContentProps {
  graphRef: React.RefObject<GraphRendererRef>;
  graphData: GraphData;
  width: number;
  height: number;
  highlightedNodeId: string | null;
  zoomLevel: number;
  onNodeSelect: (nodeId: string) => void;
}
