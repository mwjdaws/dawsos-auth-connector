
/**
 * Compatibility layer for RelationshipGraph components
 * Provides type-safe wrappers and utility functions to bridge API differences
 */
import React from 'react';
import { GraphNode, GraphLink, GraphData, RelationshipGraphProps } from './types';

/**
 * Ensures a node ID is always a string
 */
export function ensureNodeId(id: string | undefined | null): string {
  return id || '';
}

/**
 * Safe wrapper for the RelationshipGraph component props
 */
export function createSafeGraphProps(props: {
  startingNodeId?: string | undefined;
  width?: number;
  height?: number;
  hasAttemptedRetry?: boolean;
}): RelationshipGraphProps {
  return {
    startingNodeId: props.startingNodeId || '',
    width: props.width || 800,
    height: props.height || 600,
    hasAttemptedRetry: props.hasAttemptedRetry || false
  };
}

/**
 * Ensures a GraphNode has all required properties
 */
export function ensureValidNode(node: Partial<GraphNode>): GraphNode {
  return {
    id: node.id || '',
    title: node.title || node.name || 'Untitled',
    name: node.name || node.title || 'Unnamed',
    type: node.type || 'document',
    ...node
  };
}

/**
 * Ensures a GraphLink has all required properties
 */
export function ensureValidLink(link: Partial<GraphLink>): GraphLink {
  return {
    source: link.source || '',
    target: link.target || '',
    type: link.type || 'default',
    ...link
  };
}

/**
 * Creates a safe wrapper for node click handlers
 */
export function createSafeNodeClickHandler(
  handler: ((node: GraphNode) => void) | undefined
): (node: any) => void {
  return (node: any) => {
    if (handler && node) {
      handler(ensureValidNode(node));
    }
  };
}

/**
 * Ensures GraphData is valid with proper types
 */
export function ensureValidGraphData(data: Partial<GraphData> | undefined): GraphData {
  if (!data) {
    return { nodes: [], links: [] };
  }
  
  return {
    nodes: Array.isArray(data.nodes) 
      ? data.nodes.map(node => ensureValidNode(node))
      : [],
    links: Array.isArray(data.links)
      ? data.links.map(link => ensureValidLink(link))
      : []
  };
}
