
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
import { toast } from '@/hooks/use-toast';

export function useGraphData(startingNodeId?: string) {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);
  const lastFetchTime = useRef<number>(0);
  const fetchAttempts = useRef<number>(0);
  const maxRetries = 3;
  
  /**
   * Fetches graph data from Supabase and constructs the graph structure
   * This function aggregates data from multiple tables to build a complete
   * representation of the knowledge network.
   */
  const fetchGraphData = useCallback(async () => {
    // Prevent excessive re-fetching and double fetches
    const now = Date.now();
    if (now - lastFetchTime.current < 2000) return; // Throttle to prevent rapid re-fetches
    
    lastFetchTime.current = now;
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching graph data...");
      fetchAttempts.current += 1;
      
      // Fetch knowledge sources
      const { data: sources, error: sourcesError } = await supabase
        .from('knowledge_sources')
        .select('id, title')
        .limit(100);
      
      if (sourcesError) throw sourcesError;
      console.log(`Fetched ${sources?.length || 0} knowledge sources:`, sources?.map(s => s.title).slice(0, 5));
      
      // Fetch note links
      const { data: links, error: linksError } = await supabase
        .from('note_links')
        .select('id, source_id, target_id, link_type')
        .limit(200);
      
      if (linksError) throw linksError;
      console.log(`Fetched ${links?.length || 0} note links`);
      
      // Fetch ontology terms
      const { data: terms, error: termsError } = await supabase
        .from('ontology_terms')
        .select('id, term, domain')
        .limit(100);
      
      if (termsError) throw termsError;
      console.log(`Fetched ${terms?.length || 0} ontology terms:`, terms?.map(t => t.term).slice(0, 5));
      
      // Fetch ontology relationships
      const { data: termRelationships, error: termRelError } = await supabase
        .from('ontology_relationships')
        .select('id, term_id, related_term_id, relation_type')
        .limit(200);
      
      if (termRelError) throw termRelError;
      console.log(`Fetched ${termRelationships?.length || 0} ontology relationships`);
      
      // Fetch knowledge source to ontology term relationships
      const { data: sourceTerms, error: sourceTermsError } = await supabase
        .from('knowledge_source_ontology_terms')
        .select('id, knowledge_source_id, ontology_term_id')
        .limit(200);
      
      if (sourceTermsError) throw sourceTermsError;
      console.log(`Fetched ${sourceTerms?.length || 0} source-term relationships`);
      
      // Check for component unmount before updating state
      if (!isMounted.current) {
        console.log("Component unmounted, skipping state update");
        return;
      }
      
      // Reset fetch attempts on successful fetch
      fetchAttempts.current = 0;
      
      // Check if we have actual data to render
      if (
        (!sources || sources.length === 0) && 
        (!terms || terms.length === 0)
      ) {
        console.log("No graph data available to display");
        setGraphData({ nodes: [], links: [] });
        setError("No graph data available to display. Try adding some knowledge sources or ontology terms.");
        setLoading(false);
        return;
      }
      
      // Prepare graph data by combining all fetched data
      const nodes = [
        // Knowledge source nodes
        ...(sources || []).map(source => ({
          id: source.id,
          name: source.title,
          type: 'source' as const,
          val: 2,
          color: '#4299e1' // blue
        })),
        
        // Ontology term nodes
        ...(terms || []).map(term => ({
          id: term.id,
          name: `${term.domain ? `${term.domain}: ` : ''}${term.term}`,
          type: 'term' as const,
          val: 1.5,
          color: '#68d391' // green
        }))
      ];
      
      // Log node count by type for debugging
      const sourceNodes = nodes.filter(n => n.type === 'source').length;
      const termNodes = nodes.filter(n => n.type === 'term').length;
      console.log(`Created ${sourceNodes} source nodes and ${termNodes} term nodes`);
      
      // Filter out links that don't have corresponding nodes
      const nodeIds = new Set(nodes.map(node => node.id));
      
      const validLinks = [
        // Note links
        ...(links || []).filter(link => 
          nodeIds.has(link.source_id) && nodeIds.has(link.target_id)
        ).map(link => ({
          id: link.id,
          source: link.source_id,
          target: link.target_id,
          type: link.link_type,
          value: 1
        })),
        
        // Term relationships
        ...(termRelationships || []).filter(rel => 
          nodeIds.has(rel.term_id) && nodeIds.has(rel.related_term_id)
        ).map(rel => ({
          id: rel.id,
          source: rel.term_id,
          target: rel.related_term_id,
          type: rel.relation_type,
          value: 0.7
        })),
        
        // Source to term relationships
        ...(sourceTerms || []).filter(st => 
          nodeIds.has(st.knowledge_source_id) && nodeIds.has(st.ontology_term_id)
        ).map(st => ({
          id: st.id,
          source: st.knowledge_source_id,
          target: st.ontology_term_id,
          type: 'has_term',
          value: 0.5
        }))
      ];
      
      // Log link counts by type for debugging
      const sourceLinks = validLinks.filter(l => l.type === 'wikilink' || l.type === 'manual' || l.type === 'AI-suggested').length;
      const termLinks = validLinks.filter(l => l.type !== 'wikilink' && l.type !== 'manual' && l.type !== 'AI-suggested' && l.type !== 'has_term').length;
      const sourceTermLinks = validLinks.filter(l => l.type === 'has_term').length;
      
      console.log(`Created ${sourceLinks} source-to-source links, ${termLinks} term-to-term links, and ${sourceTermLinks} source-to-term links`);
      
      // Create the final graph data structure
      const finalGraphData = { 
        nodes,
        links: validLinks
      };
      
      // Log starting node info if specified
      if (startingNodeId) {
        const startingNode = nodes.find(n => n.id === startingNodeId);
        console.log(`Starting node ${startingNodeId} found:`, startingNode ? 'YES' : 'NO');
        if (startingNode) {
          console.log(`Starting node is a ${startingNode.type} named "${startingNode.name}"`);
          
          // Count direct connections to starting node
          const directConnections = validLinks.filter(
            l => l.source === startingNodeId || l.target === startingNodeId
          ).length;
          
          console.log(`Starting node has ${directConnections} direct connections`);
        }
      }
      
      // Update state with the new graph data
      setGraphData(finalGraphData);
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
        
        // Retry automatically if below max attempts
        if (fetchAttempts.current <= maxRetries) {
          console.log(`Retry attempt ${fetchAttempts.current} of ${maxRetries}`);
          toast({
            title: "Loading graph data failed",
            description: "Retrying automatically...",
            variant: "destructive",
          });
          
          // Retry with exponential backoff
          setTimeout(() => {
            if (isMounted.current) {
              fetchGraphData();
            }
          }, Math.min(1000 * Math.pow(2, fetchAttempts.current - 1), 8000));
        } else {
          // Log the error with our custom error handler
          handleError(err, errorMessage, {
            level: "error",
            context: { startingNodeId }
          });
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [startingNodeId]);
  
  // Handle component unmounting
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Fetch data when the component mounts or startingNodeId changes
  useEffect(() => {
    fetchAttempts.current = 0;
    fetchGraphData();
  }, [fetchGraphData, startingNodeId]);
  
  // Safe wrapper for the fetch function that handles errors properly
  const fetchGraphDataSafely = useCallback(() => {
    fetchAttempts.current = 0;
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
