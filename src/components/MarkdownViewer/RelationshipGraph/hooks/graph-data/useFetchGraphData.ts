
/**
 * useFetchGraphData Hook
 * 
 * Responsible for the data fetching logic for the graph
 */
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GraphData, GraphNode, GraphLink } from '../../types';
import { handleError, ErrorLevel } from '@/utils/errors';

/**
 * Hook for fetching graph data
 */
export function useFetchGraphData() {
  /**
   * Fetches data for the graph and transforms it into the proper format
   */
  const fetchAndProcessGraphData = useCallback(async (startingNodeId?: string) => {
    try {
      let knowledgeSources: any[] = [];
      let relationships: any[] = [];
      
      // If a starting node ID is provided, we fetch related nodes
      if (startingNodeId) {
        // Use a direct SQL query instead of table name for type safety
        // This approach uses RPC call for better type safety
        const { data: directRelationships, error: directError } = await supabase
          .rpc('get_content_relationships', { source_node_id: startingNodeId });
          
        if (directError) throw directError;
        
        if (directRelationships && directRelationships.length > 0) {
          relationships = directRelationships;
          
          // Get all node IDs involved in relationships
          const nodeIds = new Set<string>();
          directRelationships.forEach((rel: any) => {
            if (rel.source_id) nodeIds.add(rel.source_id);
            if (rel.target_id) nodeIds.add(rel.target_id);
          });
          
          // Fetch all involved knowledge sources
          if (nodeIds.size > 0) {
            const { data: sources, error: sourcesError } = await supabase
              .from('knowledge_sources')
              .select('id, title, content, published')
              .in('id', Array.from(nodeIds));
              
            if (sourcesError) throw sourcesError;
            
            if (sources) {
              knowledgeSources = sources;
            }
          }
        }
      } else {
        // No starting node, fetch a limited set of nodes for an overview
        const { data: sources, error: sourcesError } = await supabase
          .from('knowledge_sources')
          .select('id, title, content, published')
          .limit(50);
          
        if (sourcesError) throw sourcesError;
        
        if (sources) {
          knowledgeSources = sources;
          
          // Fetch relationships between these nodes
          if (knowledgeSources.length > 0) {
            const nodeIds = knowledgeSources.map(source => source.id);
            
            // Use RPC for type safety
            const { data: rels, error: relsError } = await supabase
              .rpc('get_relationships_between_nodes', { node_ids: nodeIds });
              
            if (relsError) throw relsError;
            
            if (rels) {
              relationships = rels;
            }
          }
        }
      }
      
      // Convert to graph data format
      const graphData = transformToGraphData(knowledgeSources, relationships, startingNodeId);
      
      // Return the processed data
      return { data: graphData, error: null };
    } catch (err) {
      console.error('Error fetching graph data:', err);
      
      handleError(
        err,
        "Failed to load graph data",
        { level: ErrorLevel.ERROR }
      );
      
      return { 
        data: { nodes: [], links: [] }, 
        error: err instanceof Error ? err.message : String(err)
      };
    }
  }, []);
  
  return { fetchAndProcessGraphData };
}

/**
 * Transform the raw database data into GraphData format
 */
function transformToGraphData(
  sources: any[],
  relationships: any[],
  highlightedNodeId?: string
): GraphData {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  
  // Create nodes from knowledge sources
  sources.forEach(source => {
    const titleText = source.title || 'Untitled';
    const isHighlighted = highlightedNodeId === source.id;
    
    // Extract content preview
    let preview = '';
    if (source.content) {
      preview = source.content.substring(0, 100) + (source.content.length > 100 ? '...' : '');
    }
    
    nodes.push({
      id: source.id,
      name: titleText,
      title: titleText,
      preview: preview,
      size: isHighlighted ? 10 : 5,
      type: source.published ? 'published' : 'draft',
      highlighted: isHighlighted
    });
  });
  
  // Create links from relationships
  relationships.forEach((rel: any) => {
    // Make sure both nodes exist
    const sourceExists = nodes.some(node => node.id === rel.source_id);
    const targetExists = nodes.some(node => node.id === rel.target_id);
    
    if (sourceExists && targetExists && rel.source_id && rel.target_id) {
      links.push({
        source: rel.source_id,
        target: rel.target_id,
        id: rel.id,
        type: rel.relation_type || 'default'
      });
    }
  });
  
  return { nodes, links };
}
