
/**
 * useGraphData Hook
 * 
 * This custom hook is responsible for fetching and constructing the graph data
 * from multiple Supabase tables. It fetches:
 * - Knowledge sources (nodes)
 * - Note links (connections between sources)
 * - Ontology terms (nodes)
 * - Ontology relationships (connections between terms)
 * - Source-term relationships (connections between sources and terms)
 * 
 * The hook returns the constructed graph data along with loading and error states,
 * and a function to refresh the data.
 * 
 * Performance optimizations:
 * - Debounced fetching
 * - Cache validation
 * - Error categorization
 */
import { useCallback, useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GraphData } from '../types';
import { handleError, categorizeError, withErrorHandling } from '@/utils/errors';

export function useGraphData(startingNodeId?: string) {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);
  const lastFetchTime = useRef<number>(0);
  
  /**
   * Fetches graph data from Supabase and constructs the graph structure
   * This function aggregates data from multiple tables to build a complete
   * representation of the knowledge network.
   */
  const fetchGraphData = useCallback(async () => {
    // Prevent excessive re-fetching and double fetches
    const now = Date.now();
    if (loading && graphData.nodes.length > 0) return;
    if (now - lastFetchTime.current < 2000) return; // Throttle to prevent rapid re-fetches
    
    lastFetchTime.current = now;
    setLoading(true);
    setError(null);
    
    try {
      // Fetch knowledge sources
      const { data: sources, error: sourcesError } = await supabase
        .from('knowledge_sources')
        .select('id, title')
        .limit(100);
      
      if (sourcesError) throw sourcesError;
      
      // Fetch note links
      const { data: links, error: linksError } = await supabase
        .from('note_links')
        .select('source_id, target_id, link_type')
        .limit(200);
      
      if (linksError) throw linksError;
      
      // Fetch ontology terms
      const { data: terms, error: termsError } = await supabase
        .from('ontology_terms')
        .select('id, term, domain')
        .limit(100);
      
      if (termsError) throw termsError;
      
      // Fetch ontology relationships
      const { data: termRelationships, error: termRelError } = await supabase
        .from('ontology_relationships')
        .select('term_id, related_term_id, relation_type')
        .limit(200);
      
      if (termRelError) throw termRelError;
      
      // Fetch knowledge source to ontology term relationships
      const { data: sourceTerms, error: sourceTermsError } = await supabase
        .from('knowledge_source_ontology_terms')
        .select('knowledge_source_id, ontology_term_id')
        .limit(200);
      
      if (sourceTermsError) throw sourceTermsError;
      
      // Check for component unmount before updating state
      if (!isMounted.current) return;
      
      // Prepare graph data by combining all fetched data
      const nodes = [
        // Knowledge source nodes
        ...sources.map(source => ({
          id: source.id,
          name: source.title,
          type: 'source' as const,
          val: 2,
          color: '#4299e1' // blue
        })),
        
        // Ontology term nodes
        ...terms.map(term => ({
          id: term.id,
          name: `${term.domain ? `${term.domain}: ` : ''}${term.term}`,
          type: 'term' as const,
          val: 1.5,
          color: '#68d391' // green
        }))
      ];
      
      const graphLinks = [
        // Note links
        ...links.map(link => ({
          source: link.source_id,
          target: link.target_id,
          type: link.link_type,
          value: 1
        })),
        
        // Term relationships
        ...termRelationships.map(rel => ({
          source: rel.term_id,
          target: rel.related_term_id,
          type: rel.relation_type,
          value: 0.7
        })),
        
        // Source to term relationships
        ...sourceTerms.map(st => ({
          source: st.knowledge_source_id,
          target: st.ontology_term_id,
          type: 'has_term',
          value: 0.5
        }))
      ];
      
      setGraphData({ 
        nodes,
        links: graphLinks
      });
    } catch (err) {
      console.error('Error fetching graph data:', err);
      
      // Use the error handling utility for consistent error handling
      const errorCategory = categorizeError(err);
      let errorMessage = 'Failed to load relationship data';
      
      // Customize error messages based on error category
      switch (errorCategory) {
        case 'NETWORK':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case 'AUTHENTICATION':
          errorMessage = 'Authentication error. Please log in again.';
          break;
        case 'DATABASE':
          errorMessage = 'Database error. Please try again later.';
          break;
        case 'TIMEOUT':
          errorMessage = 'Request timed out. Please try again.';
          break;
      }
      
      if (isMounted.current) {
        setError(errorMessage);
        
        // Log the error with our custom error handler
        handleError(err, errorMessage, {
          level: "error",
          context: { startingNodeId }
        });
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [startingNodeId, loading, graphData.nodes.length]);
  
  // Handle component unmounting
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Fetch data when the component mounts
  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);
  
  // Safe wrapper for the fetch function that handles errors properly
  const fetchGraphDataSafely = useCallback(() => {
    withErrorHandling(
      fetchGraphData,
      "Failed to refresh graph data"
    );
  }, [fetchGraphData]);
  
  return {
    graphData,
    loading,
    error,
    fetchGraphData: fetchGraphDataSafely
  };
}
