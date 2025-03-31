
/**
 * Compatibility layer for RelationshipGraph components
 * Provides type-safe wrappers and utility functions to bridge API differences
 */
import React from 'react';
import { GraphNode, GraphLink, GraphData, GraphRendererRef, GraphProps } from './types';

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
  startingNodeId?: string | undefined | null;
  width?: number;
  height?: number;
  hasAttemptedRetry?: boolean;
}): GraphProps {
  return {
    startingNodeId: props.startingNodeId || '',
    width: props.width || 800,
    height: props.height || 600,
    hasAttemptedRetry: props.hasAttemptedRetry || false
  };
}

/**
 * Creates a compatible ref implementation for legacy components
 */
export function createCompatibleGraphRef(modernRef: any): GraphRendererRef {
  return {
    centerOn: (nodeId: string) => {
      if (modernRef && modernRef.centerOnNode) {
        modernRef.centerOnNode(nodeId);
      }
    },
    setZoom: (zoomLevel: number) => {
      if (modernRef && modernRef.setZoom) {
        modernRef.setZoom(zoomLevel);
      }
    },
    zoomToFit: () => {
      if (modernRef && modernRef.zoomToFit) {
        modernRef.zoomToFit();
      }
    },
    findNode: (id: string) => {
      if (modernRef && modernRef.getGraphData) {
        const data = modernRef.getGraphData();
        return data.nodes.find((node: GraphNode) => node.id === id);
      }
      return undefined;
    }
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
    color: node.color || undefined,
    size: node.size || undefined,
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
    value: link.value || undefined,
    label: link.label || undefined,
    ...link
  };
}

/**
 * Ensures GraphData is valid with proper types
 */
export function ensureValidGraphData(data: Partial<GraphData> | undefined | null): GraphData {
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

/**
 * Sanitize graph data to ensure valid for rendering
 */
export function sanitizeGraphData(data: GraphData | null | undefined): GraphData {
  if (!data) return { nodes: [], links: [] };
  
  // Ensure nodes array exists and has valid nodes
  const nodes = Array.isArray(data.nodes) 
    ? data.nodes
        .filter(node => node && typeof node.id === 'string') // Filter out invalid nodes
        .map(ensureValidNode)
    : [];
  
  // Ensure links array exists and has valid links
  const links = Array.isArray(data.links)
    ? data.links
        .filter(link => link && 
          typeof link.source === 'string' && 
          typeof link.target === 'string') // Filter out invalid links
        .map(ensureValidLink)
    : [];
  
  return { nodes, links };
}

/**
 * Safe wrapper function to ensure numbers have fallbacks
 */
export function ensureNumber(value: number | undefined | null, defaultValue = 0): number {
  return (value !== undefined && value !== null && !isNaN(value)) ? value : defaultValue;
}

/**
 * Ensures a value is a valid string, with a default fallback
 */
export function ensureString(value: string | undefined | null, defaultValue: string = ''): string {
  if (typeof value !== 'string') {
    return defaultValue;
  }
  return value;
}

/**
 * Creates a safe node renderer function
 */
export function createSafeHighlightNodeId(highlightedNodeId: string | null | undefined): string | null {
  return highlightedNodeId === undefined ? null : highlightedNodeId;
}

/**
 * Ensures a value is a boolean with a default fallback
 */
export function ensureBoolean(value: boolean | undefined | null, defaultValue: boolean = false): boolean {
  return typeof value === 'boolean' ? value : defaultValue;
}

/**
 * Ensures an array has a fallback value
 */
export function ensureArray<T>(value: T[] | undefined | null, defaultValue: T[] = []): T[] {
  return Array.isArray(value) ? value : defaultValue;
}

/**
 * Ensures a valid zoom level within reasonable bounds
 */
export function ensureValidZoom(zoom: number | undefined, defaultValue: number = 1): number {
  if (typeof zoom !== 'number' || isNaN(zoom) || zoom <= 0) {
    return defaultValue;
  }
  
  // Constrain zoom to reasonable bounds
  return Math.max(0.1, Math.min(5, zoom));
}
