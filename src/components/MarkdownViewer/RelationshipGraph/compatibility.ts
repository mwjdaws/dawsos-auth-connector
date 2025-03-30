
/**
 * Compatibility layer for RelationshipGraph components
 */
import { GraphNode, GraphLink, GraphRendererRef } from './types';

/**
 * Ensures a string value for node IDs, never undefined or null
 */
export function ensureString(value: string | null | undefined): string {
  return value || '';
}

/**
 * Ensures a node ID is never undefined or null
 */
export function ensureNodeId(nodeId: string | null | undefined): string {
  return nodeId || '';
}

/**
 * Ensures a number, defaulting to 0 for null or undefined
 */
export function ensureNumber(value: number | null | undefined): number {
  return typeof value === 'number' ? value : 0;
}

/**
 * Creates safe graph props to prevent undefined values
 */
export function createSafeGraphProps(props: any) {
  return {
    width: ensureNumber(props?.width) || 800,
    height: ensureNumber(props?.height) || 600,
    startingNodeId: ensureString(props?.startingNodeId),
    hasAttemptedRetry: props?.hasAttemptedRetry || false
  };
}

/**
 * A compatibility wrapper for graph link data
 */
export function adaptGraphLink(link: any): GraphLink {
  if (!link) return {
    id: '',
    source: '',
    target: '',
    label: '',
    type: 'default'
  };
  
  return {
    id: ensureString(link.id),
    source: typeof link.source === 'object' ? ensureString(link.source.id) : ensureString(link.source),
    target: typeof link.target === 'object' ? ensureString(link.target.id) : ensureString(link.target),
    label: ensureString(link.label),
    type: ensureString(link.type) || 'default'
  };
}

/**
 * Adapts node data to ensure type safety
 */
export function adaptGraphNode(node: any): GraphNode {
  if (!node) return {
    id: '',
    title: '',
    color: '#cccccc',
    size: 1,
    type: 'default'
  };
  
  return {
    id: ensureString(node.id),
    title: ensureString(node.title || node.name),
    color: ensureString(node.color) || '#cccccc',
    size: ensureNumber(node.size) || 1,
    type: ensureString(node.type) || 'default'
  };
}

/**
 * GraphRenderer reference compatibility wrapper
 */
export function createGraphRendererRefBridge(): React.RefObject<GraphRendererRef> {
  return {
    current: {
      zoomToFit: () => {},
      getGraphData: () => ({ nodes: [], links: [] })
    }
  };
}

/**
 * Create a TooltipContent with type safety
 */
export function createTooltipContent(content: React.ReactNode) {
  return content;
}
