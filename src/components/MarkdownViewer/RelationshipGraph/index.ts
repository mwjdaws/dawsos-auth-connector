
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

// Export types
export type { 
  GraphData, 
  GraphNode, 
  GraphLink, 
  GraphProps, 
  GraphRendererProps,
  GraphRendererRef,
  RelationshipGraphPanelProps
} from './types';

// Export hooks
export { useRelationshipGraph } from './hooks/useRelationshipGraph';
export { useGraphData } from './hooks/graph-data';

// Export utilities
export { 
  createCompatibleGraphRef, 
  createSafeGraphProps, 
  ensureValidGraphData,
  sanitizeGraphData
} from './compatibility';
