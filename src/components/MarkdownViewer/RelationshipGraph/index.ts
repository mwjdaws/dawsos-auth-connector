
/**
 * Relationship Graph - Central Export Point
 * 
 * This file exports all components related to the relationship graph visualization.
 */

// Export main components
export { RelationshipGraph } from './RelationshipGraph';
export { RelationshipGraphPanel } from './RelationshipGraphPanel';
export { RelationshipGraphAdapter } from './RelationshipGraphAdapter';

// Export from components directory
export { GraphRenderer } from './components/graph-renderer/GraphRenderer';
export { GraphSearch } from './components/GraphSearch';
export { GraphControls } from './components/GraphControls';
export { GraphContent } from './components/GraphContent';
export { RelationshipGraphControls } from './components/RelationshipGraphControls';

// Export from hooks directory
export { useRelationshipGraph } from './hooks/useRelationshipGraph';
export { useGraphData } from './hooks/graph-data/useGraphData';
export { useGraphState } from './hooks/graph-data/useGraphState';

// Export types
export * from './types';

// Export compatibility utilities to ensure proper type handling
export { 
  ensureString, 
  ensureNumber, 
  ensureBoolean,
  ensureArray,
  nullToUndefined,
  undefinedToNull,
  sanitizeGraphData
} from '@/utils/compatibility';

// Re-export additional compatibility utilities
export {
  ensureValidZoom,
  ensureValidGraphData,
  createSafeGraphProps,
  safeCallback
} from '@/utils/compatibility';
