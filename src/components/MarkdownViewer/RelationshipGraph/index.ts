
/**
 * Re-export graph-related components and utilities
 */

// Export components 
export { RelationshipGraph } from './RelationshipGraph';
export { RelationshipGraphPanel } from './RelationshipGraphPanel';

// Export hooks
export { useRelationshipGraph } from './hooks/useRelationshipGraph';
export { useGraphData } from './hooks/graph-data/useGraphData';
export { useFetchGraphData } from './hooks/graph-data/useFetchGraphData'; 
export { useGraphState } from './hooks/graph-data/useGraphState';

// Export types
export type { 
  GraphData, 
  GraphNode, 
  GraphLink,
  GraphRendererProps,
  GraphRendererRef
} from './types';

// Export compatibility utilities to ensure consistent usage across the application
export {
  ensureString,
  ensureNumber,
  ensureBoolean,
  ensureArray,
  nullToUndefined,
  undefinedToNull,
  sanitizeGraphData,
  ensureValidZoom,
  ensureValidGraphData,
  createSafeGraphProps,
  safeCallback
} from '@/utils/compatibility';

// Export compatibility functions for interoperability with different graph implementations
export {
  adaptGraphNode,
  adaptGraphLink,
  adaptGraphData,
  ensureValidGraphData as ensureGraphDataValid
} from './compatibility';
