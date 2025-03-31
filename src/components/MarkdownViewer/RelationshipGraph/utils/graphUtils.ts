
/**
 * Utility functions for graph operations
 */
import { 
  GraphNode, 
  GraphLink, 
  GraphData 
} from '../components/graph-renderer/GraphRendererTypes';

/**
 * Create a new node with default values if needed
 */
export function createNode(id: string, data: Partial<GraphNode> = {}): GraphNode {
  return {
    id,
    title: data.title || data.name || id,
    name: data.name || data.title || id,
    type: data.type || 'document',
    domain: data.domain || '',
    ...data
  };
}

/**
 * Create a link between nodes with default values
 */
export function createLink(source: string, target: string, type = 'default'): GraphLink {
  return { source, target, type };
}

/**
 * Calculate statistics for a graph (node count, link count, etc.)
 */
export function calculateGraphStats(graph: GraphData) {
  if (!graph) {
    return {
      nodeCount: 0,
      linkCount: 0,
      density: 0
    };
  }
  
  const nodeCount = graph.nodes.length;
  const linkCount = graph.links.length;
  
  // Calculate graph density (ratio of actual links to possible links)
  let density = 0;
  if (nodeCount > 1) {
    // Maximum possible links for directed graph: n(n-1)
    const maxLinks = nodeCount * (nodeCount - 1);
    density = maxLinks > 0 ? linkCount / maxLinks : 0;
  }
  
  return {
    nodeCount,
    linkCount,
    density
  };
}

/**
 * Get node style configuration based on node properties
 */
export function getNodeStyle(node: GraphNode, config?: any) {
  if (!node) {
    return { color: '#6b7280', size: 8 }; // Default style
  }
  
  // Apply configuration if provided
  const styleConfig = config || {};
  
  // Node color based on type with fallbacks
  const typeColors = styleConfig.typeColors || {
    document: '#2563eb',
    term: '#059669',
    concept: '#7c3aed',
    entity: '#db2777',
    topic: '#ea580c',
    person: '#ef4444',
    organization: '#f59e0b'
  };
  
  const type = (node.type || 'document').toLowerCase();
  
  return {
    color: node.color || typeColors[type] || styleConfig.defaultColor || '#6b7280',
    size: node.size || styleConfig.sizes?.[type] || styleConfig.defaultSize || 8
  };
}
