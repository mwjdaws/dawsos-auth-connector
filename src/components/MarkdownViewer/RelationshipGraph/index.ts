
/**
 * Relationship Graph Component
 * 
 * This module provides a complete graph visualization system for viewing
 * knowledge relationships within the application.
 * 
 * Exports:
 * - RelationshipGraph: Main component for displaying knowledge graphs
 * - RelationshipGraphPanel: Component for embedding the graph in panels
 * - Types for extending or integrating with the graph
 */

// Export the main component and panel
export { RelationshipGraph } from './RelationshipGraph';
export { RelationshipGraphPanel } from './components/RelationshipGraphPanel';

// Export types for external use
export type { 
  GraphData,
  GraphNode, 
  GraphLink,
  RelationshipGraphProps,
  RelationshipGraphPanelProps,
  GraphRendererProps,
  GraphRendererRef, 
  WithErrorHandlingOptions
} from './types';
