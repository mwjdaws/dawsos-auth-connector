
/**
 * Compatibility layer for GraphRenderer
 * 
 * This module provides helpers to ensure backward compatibility between
 * different versions of the GraphRenderer component and its APIs.
 */
import { GraphData, GraphNode, GraphLink, GraphRendererRef } from './types';
import { GraphRendererRef as ModernGraphRendererRef } from './components/graph-renderer/GraphRendererTypes';

/**
 * Create safe props for the graph component with proper defaults and type conversions
 */
export function createSafeGraphProps(props: any): any {
  return {
    startingNodeId: props.startingNodeId || props.contentId || undefined,
    width: props.width || 800,
    height: props.height || 600,
    hasAttemptedRetry: props.hasAttemptedRetry || false,
    contentId: props.contentId || props.sourceId || undefined,
    initialZoom: props.initialZoom || 1,
    showControls: props.showControls !== false,
    className: props.className || '',
  };
}

/**
 * Converts a node to a safe format with required properties
 */
export function createSafeNode(node: any): GraphNode {
  if (!node) return createEmptyNode();
  
  return {
    id: node.id || `node-${Math.random().toString(36).substring(2, 9)}`,
    title: node.title || node.name || 'Unnamed',
    name: node.name || node.title || 'Unnamed',
    type: node.type || 'default',
    ...node,
  };
}

/**
 * Converts a link to a safe format with required properties
 */
export function createSafeLink(link: any): GraphLink {
  if (!link) return createEmptyLink();

  return {
    source: link.source || '',
    target: link.target || '',
    type: link.type || 'default',
    ...link,
  };
}

/**
 * Creates an empty node when no data is available
 */
function createEmptyNode(): GraphNode {
  return {
    id: `empty-${Math.random().toString(36).substring(2, 9)}`,
    title: 'No data',
    name: 'No data',
    type: 'empty',
  };
}

/**
 * Creates an empty link when no data is available
 */
function createEmptyLink(): GraphLink {
  return {
    source: '',
    target: '',
    type: 'empty',
  };
}

/**
 * Creates a safe GraphData structure with nodes and links
 */
export function createSafeGraphData(data: any): GraphData {
  if (!data) {
    return { nodes: [], links: [] };
  }
  
  const safeNodes = Array.isArray(data.nodes) 
    ? data.nodes.map(createSafeNode) 
    : [];
    
  const safeLinks = Array.isArray(data.links) 
    ? data.links.map(createSafeLink) 
    : [];
  
  return {
    nodes: safeNodes,
    links: safeLinks
  };
}

/**
 * Creates a compatibility wrapper for the GraphRendererRef
 */
export function createCompatibleGraphRef(ref: ModernGraphRendererRef | null): GraphRendererRef {
  if (!ref) {
    return {
      centerOnNode: () => {},
      zoomIn: () => {},
      zoomOut: () => {},
      resetZoom: () => {},
      centerGraph: () => {},
      setZoom: () => {},
    };
  }
  
  return {
    centerOnNode: ref.centerOnNode || (() => {}),
    zoomIn: () => ref.setZoom(1.5),
    zoomOut: () => ref.setZoom(0.75),
    resetZoom: ref.resetZoom || (() => {}),
    centerGraph: () => ref.zoomToFit(500),
    setZoom: ref.setZoom || (() => {}),
  };
}
