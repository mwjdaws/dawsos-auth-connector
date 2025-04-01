
/**
 * RelationshipGraph Main Export
 * 
 * This file exports all components, hooks, and utilities for the relationship graph
 * to provide a unified API for consumers.
 */

// Main Components
export { RelationshipGraph } from './RelationshipGraph';
export { RelationshipGraphPanel } from './RelationshipGraphPanel';

// Sub-components
export { ErrorFallback } from './components/ErrorFallback';
export { GraphContent } from './components/GraphContent';
export { GraphControls } from './components/GraphControls';
export { GraphRenderer } from './components/graph-renderer/GraphRenderer';
export { GraphZoomControl } from './components/GraphZoomControl';
export { NodeSearch } from './components/NodeSearch';

// Hooks
export { useRelationshipGraph } from './hooks/useRelationshipGraph';
export { useGraphData } from './hooks/graph-data/useGraphData';
export { useGraphState } from './hooks/graph-data/useGraphState';
export { useFetchGraphData } from './hooks/graph-data/useFetchGraphData';

// Types
export * from './types';

// Utilities
export {
  ensureNumber,
  ensureString,
  ensureBoolean,
  ensureValidZoom,
  ensureValidGraphData,
  sanitizeGraphData,
  createCompatibleGraphRef
} from './compatibility';
