import { ensureString, ensureNumber } from './strings';

/**
 * Sanitizes graph data to ensure it meets expected type requirements
 * 
 * @param data Raw graph data that may be missing required properties
 * @returns Sanitized graph data conforming to GraphData interface
 */
export function sanitizeGraphData(data: any): any {
  if (!data) {
    return { nodes: [], links: [] };
  }

  // Ensure nodes array exists
  const nodes = Array.isArray(data.nodes) ? data.nodes : [];
  
  // Ensure links array exists
  const links = Array.isArray(data.links) ? data.links : [];
  
  // Process nodes to ensure required properties
  const processedNodes = nodes.map((node: any) => ({
    id: ensureString(node.id || `node-${Math.random().toString(36).substr(2, 9)}`),
    name: ensureString(node.name || node.title || node.id || 'Unnamed'),
    title: ensureString(node.title || node.name || ''),
    type: ensureString(node.type || 'default'),
    color: ensureString(node.color || '#6e56cf'),
    ...node
  }));
  
  // Process links to ensure required properties
  const processedLinks = links.map((link: any) => {
    // Handle source and target as objects or strings
    const source = typeof link.source === 'object' && link.source !== null
      ? ensureString(link.source.id)
      : ensureString(link.source);
    
    const target = typeof link.target === 'object' && link.target !== null
      ? ensureString(link.target.id)
      : ensureString(link.target);
    
    return {
      source,
      target,
      type: ensureString(link.type || 'default'),
      value: ensureNumber(link.value || 1),
      color: ensureString(link.color || '#8b8b8b'),
      ...link
    };
  });
  
  return {
    nodes: processedNodes,
    links: processedLinks
  };
}
