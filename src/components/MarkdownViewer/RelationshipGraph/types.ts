
import { ReactNode } from 'react';
import { GraphNode, GraphLink, GraphData } from './components/graph-renderer/GraphRendererTypes';

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
 * UseRelationshipGraph hook props
 */
export interface UseRelationshipGraphProps {
  startingNodeId: string;
  hasAttemptedRetry: boolean;
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
