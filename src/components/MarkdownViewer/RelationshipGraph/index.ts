
/**
 * Relationship Graph Component Exports
 * 
 * This file exports all the components and types related to the relationship graph.
 */

// Export the main component
export { RelationshipGraph } from './RelationshipGraph';

// Export the panel version
export { RelationshipGraphPanel } from './RelationshipGraphPanel';

// Export the adapter for backward compatibility
export { RelationshipGraphAdapter } from './RelationshipGraphAdapter';

// Export types from the types file
export type { 
  GraphData, 
  GraphNode, 
  GraphLink, 
  GraphProps, 
  GraphRendererRef,
} from './types';

// Export types from the graph-renderer module
export type { GraphRendererProps } from './components/graph-renderer/GraphRendererTypes';

// Export types from the RelationshipGraphPanel component
export type { RelationshipGraphPanelProps } from './RelationshipGraphPanel';

// Export hooks
export { useRelationshipGraph } from './hooks/useRelationshipGraph';
export { useGraphData } from './hooks/graph-data';

// Export utilities
export { 
  createCompatibleGraphRef, 
  createSafeGraphProps, 
  ensureValidGraphData,
  sanitizeGraphData,
  ensureNumber,
} from './compatibility';
