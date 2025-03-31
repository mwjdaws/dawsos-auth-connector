
/**
 * Compatibility utilities for RelationshipGraph
 * 
 * These functions provide type safety and compatibility between various
 * interfaces and components in the graph system.
 */

import { GraphData, GraphNode, GraphLink, GraphProps, GraphRendererRef } from './types';

/**
 * Creates a compatible graph reference
 */
export function createCompatibleGraphRef(ref: any): GraphRendererRef {
  return {
    zoomToFit: () => {
      if (ref?.current?.zoomToFit) {
        ref.current.zoomToFit();
      }
    },
    centerGraph: () => {
      if (ref?.current?.centerGraph) {
        ref.current.centerGraph();
      }
    },
    findNode: (nodeId: string) => {
      if (ref?.current?.findNode) {
        return ref.current.findNode(nodeId);
      }
      return null;
    }
  };
}

/**
 * Ensures a value is a number
 */
export function ensureNumber(value: any, defaultValue = 0): number {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  return defaultValue;
}

/**
 * Ensures a value is a string
 */
export function ensureString(value: any, defaultValue = ''): string {
  if (typeof value === 'string') {
    return value;
  }
  return defaultValue;
}

/**
 * Ensures a value is a boolean
 */
export function ensureBoolean(value: any, defaultValue = false): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  return defaultValue;
}

/**
 * Ensures a zoom value is valid
 */
export function ensureValidZoom(zoom: any): number {
  const numberZoom = ensureNumber(zoom, 1);
  return Math.max(0.1, Math.min(2, numberZoom));
}

/**
 * Sanitizes graph data to ensure all required properties are present
 */
export function sanitizeGraphData(data: any): GraphData {
  if (!data) {
    return { nodes: [], links: [] };
  }

  const nodes: GraphNode[] = Array.isArray(data.nodes) 
    ? data.nodes.map((node: any) => ({
        id: ensureString(node.id),
        name: ensureString(node.name),
        val: ensureNumber(node.val, 1),
        type: ensureString(node.type, 'document'),
        title: ensureString(node.title, node.name || node.id || ''),
        ...node
      }))
    : [];

  const links: GraphLink[] = Array.isArray(data.links)
    ? data.links.map((link: any) => ({
        source: ensureString(link.source),
        target: ensureString(link.target),
        type: ensureString(link.type, 'default'),
        ...link
      }))
    : [];

  return { nodes, links };
}

/**
 * Creates safe graph props from potentially unsafe input
 */
export function createSafeGraphProps(props: any): GraphProps {
  return {
    data: sanitizeGraphData(props.data),
    width: ensureNumber(props.width, 800),
    height: ensureNumber(props.height, 600),
    onNodeClick: props.onNodeClick || (() => {}),
    onNodeHover: props.onNodeHover || (() => {}),
    onLinkClick: props.onLinkClick || (() => {}),
    nodeColor: props.nodeColor || ((node) => '#1f77b4'),
    linkColor: props.linkColor || ((link) => '#999'),
    nodeLabel: props.nodeLabel || ((node) => node.name || node.id),
    linkLabel: props.linkLabel || ((link) => ''),
    nodeLabelVisibility: props.nodeLabelVisibility || (() => true),
    linkLabelVisibility: props.linkLabelVisibility || (() => false),
    nodeSize: props.nodeSize || ((node) => 7),
    linkWidth: props.linkWidth || ((link) => 1),
    nodeCanvasObject: props.nodeCanvasObject,
    linkCanvasObject: props.linkCanvasObject,
    cooldownTime: ensureNumber(props.cooldownTime, 15000),
    centerAtInit: ensureBoolean(props.centerAtInit, true),
    showLabels: ensureBoolean(props.showLabels, true),
    labelSize: ensureNumber(props.labelSize, 12),
    defaultNodeColor: ensureString(props.defaultNodeColor, '#1f77b4'),
    defaultLinkColor: ensureString(props.defaultLinkColor, '#999'),
  };
}
