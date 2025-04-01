
/**
 * Compatibility utilities for handling type differences and ensuring backward compatibility
 */

import { GraphData, GraphNode, GraphLink, GraphRendererRef } from '@/components/MarkdownViewer/RelationshipGraph/types';
import { ErrorHandlingOptions, ErrorLevel, ErrorSource } from '@/utils/errors/types';
import { Toast, ToastActionElement } from "@/components/ui/toast";

// ----- Type Safety Utilities -----

/**
 * Ensure a value is a string, with a fallback default
 */
export function ensureString(value: any, defaultValue = ''): string {
  if (value === null || value === undefined) return defaultValue;
  return String(value);
}

/**
 * Ensure a value is a number, with a fallback default
 */
export function ensureNumber(value: any, defaultValue = 0): number {
  if (value === null || value === undefined) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Ensure a value is a boolean, with a fallback default
 */
export function ensureBoolean(value: any, defaultValue = false): boolean {
  if (value === null || value === undefined) return defaultValue;
  return Boolean(value);
}

/**
 * Ensure a valid zoom level (between 0.1 and 10)
 */
export function ensureValidZoom(value: any): number {
  const zoom = ensureNumber(value, 1);
  return Math.max(0.1, Math.min(zoom, 10));
}

/**
 * Convert undefined to null explicitly
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Ensure valid graph data structure
 */
export function ensureValidGraphData(data: any): GraphData {
  if (!data) {
    return { nodes: [], links: [] };
  }
  
  return {
    nodes: Array.isArray(data.nodes) ? data.nodes : [],
    links: Array.isArray(data.links) ? data.links : []
  };
}

/**
 * Sanitize graph data to ensure all nodes and links have required properties
 */
export function sanitizeGraphData(data: GraphData): GraphData {
  return {
    nodes: data.nodes.map(node => ({
      ...node,
      id: ensureString(node.id),
      // Add x and y for D3 compatibility
      x: node.x || Math.random() * 500,
      y: node.y || Math.random() * 500,
      // Add other optional properties
      color: node.color || null,
      size: node.size || 10,
    })),
    links: data.links.map(link => ({
      ...link,
      source: typeof link.source === 'object' ? link.source.id : ensureString(link.source),
      target: typeof link.target === 'object' ? link.target.id : ensureString(link.target),
      // Add optional properties
      color: link.color || '#999',
      width: link.width || 1,
    }))
  };
}

/**
 * Create safe graph props with type checking
 */
export function createSafeGraphProps(props: any): any {
  return {
    graphData: ensureValidGraphData(props.graphData),
    width: ensureNumber(props.width, 800),
    height: ensureNumber(props.height, 600),
    zoom: ensureValidZoom(props.zoom),
    highlightedNodeId: props.highlightedNodeId || null,
    onNodeClick: props.onNodeClick || undefined,
    onLinkClick: props.onLinkClick || undefined,
  };
}

/**
 * Execute a callback safely, checking if it exists first
 */
export function safeCallback<T extends Function>(callback: T | undefined | null, ...args: any[]): any {
  if (typeof callback === 'function') {
    return callback(...args);
  }
  return undefined;
}

/**
 * Convert legacy error options to new format
 */
export function convertErrorOptions(options: any): Partial<ErrorHandlingOptions> {
  if (!options) return {};
  
  // Handle string level values
  let level = options.level;
  if (typeof level === 'string') {
    switch (level.toUpperCase()) {
      case 'DEBUG': level = ErrorLevel.DEBUG; break;
      case 'INFO': level = ErrorLevel.INFO; break;
      case 'WARNING': level = ErrorLevel.WARNING; break;
      case 'ERROR': 
      default: level = ErrorLevel.ERROR; break;
    }
  }
  
  return {
    level,
    context: options.context || {},
    silent: options.silent || false,
    reportToAnalytics: options.reportToAnalytics !== false,
    showToast: options.showToast !== false,
    toastTitle: options.toastTitle || undefined,
    fingerprint: options.fingerprint || undefined,
    retryCount: options.retryCount || 0,
    maxRetries: options.maxRetries || 3,
    category: options.category || undefined
  };
}

/**
 * Ensure toast properties are compatible
 */
export function compatibleToast(props: any): Toast {
  return {
    ...props,
    variant: props.variant || "default",
    title: props.title || "",
    description: props.description || "",
  };
}

// Types for backward compatibility
export type { Toast, ToastActionElement };
