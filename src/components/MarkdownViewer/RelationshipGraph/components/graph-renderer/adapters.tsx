
/**
 * Adapters for the GraphRenderer component to interface with force-graph
 */
import { GraphNode, GraphLink } from './GraphRendererTypes';

/**
 * Adapter function to create a link tooltip text
 */
export function createLinkTooltip(link: GraphLink): string {
  return `${typeof link.type === 'string' ? link.type : 'default'} relationship`;
}

/**
 * Adapter function to create a node tooltip text
 */
export function createNodeTooltip(node: GraphNode): string {
  return node.title || node.name || '';
}

/**
 * Adapter for node click handler
 */
export function createNodeClickHandler(
  callback?: (nodeId: string) => void
): (node: GraphNode) => void {
  return (node: GraphNode) => {
    if (callback && node.id) {
      callback(node.id);
    }
  };
}

/**
 * Safely handle node rendering with force-graph
 */
export function safeNodeRenderer(
  node: any,
  ctx: CanvasRenderingContext2D,
  globalScale: number,
  renderer: (node: GraphNode & { x?: number; y?: number; }, ctx: CanvasRenderingContext2D, globalScale: number) => void
): void {
  // Ensure the node has all required properties
  const safeNode: GraphNode & { x?: number; y?: number } = {
    id: node.id || '',
    title: node.title || node.name || node.id || 'Unknown',
    name: node.name || node.title || node.id || 'Unknown',
    type: node.type || 'document',
    x: typeof node.x === 'number' ? node.x : 0,
    y: typeof node.y === 'number' ? node.y : 0,
    ...node
  };
  
  renderer(safeNode, ctx, globalScale);
}
