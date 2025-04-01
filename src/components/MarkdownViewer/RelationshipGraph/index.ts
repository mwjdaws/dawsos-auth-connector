
/**
 * RelationshipGraph Component
 * 
 * This component visualizes relationships between content items.
 */

// Main components
export { RelationshipGraphPanel } from './components/RelationshipGraphPanel';
export { RelationshipGraphControls } from './components/RelationshipGraphControls';
export { RelationshipGraphAdapter } from './RelationshipGraphAdapter';
export { GraphRenderer } from './components/graph-renderer/GraphRenderer';

// Type definitions
export type { 
  GraphNode, 
  GraphLink, 
  GraphData,
  GraphRendererRef 
} from './types';

// Utility functions for graph components
export { 
  ensureNumber,
  ensureString,
  ensureBoolean,
  ensureValidZoom,
  ensureValidGraphData,
  sanitizeGraphData,
  // Helper functions
  createSafeGraphProps,
} from '@/utils/compatibility';
