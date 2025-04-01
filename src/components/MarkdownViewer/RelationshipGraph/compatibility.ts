
import { 
  GraphNodeData, 
  GraphLinkData, 
  GraphDataFormat, 
  GraphNode,
  GraphLink 
} from './types';

/**
 * Convert older graph data formats to current format
 */
export function convertLegacyGraphData(data: any): GraphDataFormat {
  // If it's already in the correct format
  if (data && Array.isArray(data.nodes) && Array.isArray(data.links)) {
    return data;
  }
  
  // Default empty graph
  const result: GraphDataFormat = { nodes: [], links: [] };
  
  try {
    // Handle nodes
    if (data && Array.isArray(data.nodes)) {
      result.nodes = data.nodes.map((node: any) => convertLegacyNode(node));
    }
    
    // Handle links
    if (data && Array.isArray(data.links)) {
      result.links = data.links.map((link: any) => convertLegacyLink(link));
    } else if (data && Array.isArray(data.edges)) {
      // Support for older "edges" naming
      result.links = data.edges.map((edge: any) => convertLegacyLink(edge));
    }
  } catch (error) {
    console.error('Error converting legacy graph data:', error);
  }
  
  return result;
}

/**
 * Convert older node formats to current format
 */
export function convertLegacyNode(node: any): GraphNode {
  // If no data, create minimal valid node
  if (!node) {
    return { id: 'unknown', label: 'Unknown' };
  }
  
  // Start with required properties
  const result: GraphNode = {
    id: String(node.id || ''),
    label: node.label || node.name || String(node.id || '')
  };
  
  // Add optional properties if they exist
  if (node.group) result.type = String(node.group);
  if (node.type) result.type = String(node.type);
  if (node.color) result.color = String(node.color);
  if (node.size !== undefined) result.size = Number(node.size);
  if (node.weight !== undefined) result.weight = Number(node.weight);
  if (node.x !== undefined) result.x = Number(node.x);
  if (node.y !== undefined) result.y = Number(node.y);
  
  // Copy any custom properties
  Object.keys(node).forEach(key => {
    if (!['id', 'label', 'name', 'group', 'type', 'color', 'size', 'weight', 'x', 'y'].includes(key)) {
      (result as any)[key] = node[key];
    }
  });
  
  return result;
}

/**
 * Convert older link formats to current format
 */
export function convertLegacyLink(link: any): GraphLink {
  // If no data, create minimal valid link
  if (!link) {
    return { source: 'unknown', target: 'unknown' };
  }
  
  // Start with required properties
  const result: GraphLink = {
    source: String(link.source || ''),
    target: String(link.target || '')
  };
  
  // Add optional properties if they exist
  if (link.type) result.type = String(link.type);
  if (link.label) result.label = String(link.label);
  if (link.color) result.color = String(link.color);
  if (link.width !== undefined) result.width = Number(link.width);
  if (link.weight !== undefined) result.weight = Number(link.weight);
  
  // Copy any custom properties
  Object.keys(link).forEach(key => {
    if (!['source', 'target', 'type', 'label', 'color', 'width', 'weight'].includes(key)) {
      (result as any)[key] = link[key];
    }
  });
  
  return result;
}

/**
 * Create a compatible ref object for the graph
 */
export function createCompatibleGraphRef(initialValue: any = null) {
  return { current: initialValue };
}
