
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GraphData } from '../../types';
import { handleError } from '@/utils/errors';
import { ErrorLevel } from '@/utils/errors/types';

/**
 * Custom hook for fetching and processing graph data from Supabase
 */
export function useFetchGraphData() {
  /**
   * Fetches knowledge sources and their relationships to build the graph data
   */
  const fetchAndProcessGraphData = useCallback(async (startingNodeId?: string): Promise<{ data: GraphData | null, error: string | null }> => {
    try {
      // Set defaults in case of errors
      let nodes: any[] = [];
      let links: any[] = [];
      
      // Fetch content relationships from the knowledge_sources table
      // We need to perform a custom query since we don't have the get_content_relationships function
      const { data: sourceData, error: sourceError } = await supabase
        .from('knowledge_sources')
        .select('id, title')
        .limit(100);
      
      if (sourceError) {
        throw new Error(`Error fetching sources: ${sourceError.message}`);
      }
      
      if (!sourceData || sourceData.length === 0) {
        return { data: { nodes: [], links: [] }, error: null };
      }
      
      // Convert sources to nodes
      nodes = sourceData.map(source => ({
        id: source.id,
        name: source.title,
        title: source.title,
        type: 'source'
      }));
      
      // Fetch links between knowledge sources from note_links table
      const { data: linkData, error: linkError } = await supabase
        .from('note_links')
        .select('source_id, target_id, link_type');
      
      if (linkError) {
        throw new Error(`Error fetching links: ${linkError.message}`);
      }
      
      if (linkData && linkData.length > 0) {
        // Convert links to graph links
        links = linkData.map(link => ({
          source: link.source_id,
          target: link.target_id,
          type: link.link_type
        }));
      }
      
      // If we have a starting node ID, fetch related ontology terms
      if (startingNodeId) {
        try {
          const { data: termData, error: termError } = await supabase
            .rpc('get_related_ontology_terms', { knowledge_source_id: startingNodeId });
            
          if (termError) {
            console.error('Error fetching related ontology terms:', termError);
          } else if (termData && termData.length > 0) {
            // Add ontology terms as nodes
            const termNodes = termData.map(term => ({
              id: term.term_id,
              name: term.term,
              title: term.term,
              description: term.description,
              domain: term.domain,
              type: 'ontology'
            }));
            
            // Add links between starting node and terms
            const termLinks = termData.map(term => ({
              source: startingNodeId,
              target: term.term_id,
              type: term.relation_type || 'ontology'
            }));
            
            // Add to existing nodes and links
            nodes = [...nodes, ...termNodes];
            links = [...links, ...termLinks];
          }
        } catch (termError) {
          console.error('Error processing ontology terms:', termError);
        }
      }
      
      // Return processed data
      return {
        data: {
          nodes,
          links
        },
        error: null
      };
    } catch (error) {
      handleError(error, {
        message: 'Failed to fetch graph data',
        level: ErrorLevel.Error,
        context: { startingNodeId }
      });
      
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error fetching graph data'
      };
    }
  }, []);
  
  return { fetchAndProcessGraphData };
}
