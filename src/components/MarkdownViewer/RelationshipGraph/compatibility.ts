
/**
 * Compatibility Layer for RelationshipGraph
 * 
 * This file provides utilities for making the relationship graph components
 * more robust when dealing with different input types and legacy code.
 */
import { GraphData, GraphNode, GraphLink, GraphProps, GraphRendererRef } from './types';
import { ensureString, ensureNumber, ensureBoolean } from '@/utils/compatibility';

/**
 * Creates compatible ref methods for the graph renderer
 */
export function createCompatibleGraphRef(modernRef: any): GraphRendererRef {
  return {
    centerOn: (nodeId: string) => {
      if (modernRef && typeof modernRef.centerNode === 'function') {
        modernRef.centerNode(nodeId);
      }
    },
    setZoom: (zoomLevel: number) => {
      if (modernRef && typeof modernRef.zoomTo === 'function') {
        modernRef.zoomTo(zoomLevel);
      }
    },
    zoomToFit: () => {
      if (modernRef && typeof modernRef.zoomToFit === 'function') {
        modernRef.zoomToFit();
      }
    }
  };
}

/**
 * Creates safe graph props from potentially unsafe inputs
 */
export function createSafeGraphProps(props: Partial<GraphProps>): GraphProps {
  return {
    startingNodeId: ensureString(props.startingNodeId, ''),
    width: ensureNumber(props.width, 800),
    height: ensureNumber(props.height, 600),
    hasAttemptedRetry: ensureBoolean(props.hasAttemptedRetry)
  };
}

/**
 * Sanitizes graph data to ensure it's valid
 */
export function sanitizeGraphData(data: GraphData | null | undefined): GraphData {
  if (!data) {
    return { nodes: [], links: [] };
  }
  
  // Ensure nodes have required properties
  const safeNodes = (data.nodes || [])
    .map(node => sanitizeNode(node))
    .filter(Boolean) as GraphNode[];
  
  // Ensure links have required properties
  const safeLinks = (data.links || [])
    .map(link => sanitizeLink(link, safeNodes))
    .filter(Boolean) as GraphLink[];
  
  return {
    nodes: safeNodes,
    links: safeLinks
  };
}

/**
 * Sanitizes a graph node to ensure it has valid properties
 */
function sanitizeNode(node: GraphNode | null | undefined): GraphNode | null {
  if (!node || !node.id) {
    return null;
  }
  
  // Return a safe node with all required and optional properties
  return {
    id: ensureString(node.id),
    name: ensureString(node.name || node.title || ''),
    title: ensureString(node.title || node.name || ''),
    type: ensureString(node.type, ''),
    description: ensureString(node.description, ''),
    // Make sure color can be null or undefined
    color: node.color !== undefined ? node.color : null,
    // Make val optional
    val: node.val
  };
}

/**
 * Sanitizes a graph link to ensure it has valid properties and references existing nodes
 */
function sanitizeLink(link: GraphLink | null | undefined, validNodes: GraphNode[]): GraphLink | null {
  if (!link || !link.source || !link.target) {
    return null;
  }
  
  // Check that source and target nodes exist
  const sourceId = typeof link.source === 'object' && link.source !== null 
    ? String((link.source as any).id) 
    : String(link.source);
    
  const targetId = typeof link.target === 'object' && link.target !== null 
    ? String((link.target as any).id) 
    : String(link.target);
  
  const validNodeIds = validNodes.map(n => n.id);
  
  if (!validNodeIds.includes(sourceId) || !validNodeIds.includes(targetId)) {
    return null;
  }
  
  // Return a safe link with all required and optional properties
  return {
    source: sourceId,
    target: targetId,
    id: link.id || `${sourceId}-${targetId}`,
    type: ensureString(link.type),
    label: ensureString(link.label),
    value: link.value
  };
}
