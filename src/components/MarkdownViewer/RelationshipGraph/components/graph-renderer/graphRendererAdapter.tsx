
/**
 * Adapter for GraphRenderer component to handle type compatibility issues
 */
import React from 'react';
import { GraphNode, GraphLink } from '../../types';

/**
 * Creates a node render function that handles possible undefined values
 */
export function createNodeRenderAdapter(
  renderFn: (node: GraphNode & { x?: number; y?: number; }, ctx: CanvasRenderingContext2D, globalScale: number) => void
) {
  return (obj: any, ctx: CanvasRenderingContext2D, scale: number) => {
    // Ensure the object has all required GraphNode properties
    const node: GraphNode & { x?: number; y?: number } = {
      id: obj.id || '',
      title: obj.title || obj.name || 'Untitled',
      name: obj.name || obj.title || 'Unnamed',
      type: obj.type || 'document',
      x: typeof obj.x === 'number' ? obj.x : 0,
      y: typeof obj.y === 'number' ? obj.y : 0,
      ...obj
    };
    
    // Call the original render function with the enhanced node
    renderFn(node, ctx, scale);
  };
}

/**
 * Creates a link accessor function that handles type compatibility
 */
export function createLinkAccessorAdapter<T>(
  accessor: (link: GraphLink) => T
) {
  return (obj: any): T => {
    // Ensure the object has all required GraphLink properties
    const link: GraphLink = {
      source: typeof obj.source === 'object' ? obj.source.id : obj.source,
      target: typeof obj.target === 'object' ? obj.target.id : obj.target,
      type: obj.type || 'default',
      ...obj
    };
    
    // Call the original accessor with the enhanced link
    return accessor(link);
  };
}

/**
 * Safely handle graph zoom for undefined values
 */
export function safeZoom(zoom: number | undefined): number {
  return typeof zoom === 'number' ? zoom : 1;
}

/**
 * Handle node highlight with possibly undefined values
 */
export interface UseNodeRendererProps {
  highlightedNodeId: string | null;
}

export function createSafeNodeRendererProps(
  highlightedNodeId: string | null | undefined
): UseNodeRendererProps {
  return {
    highlightedNodeId: highlightedNodeId || null
  };
}
