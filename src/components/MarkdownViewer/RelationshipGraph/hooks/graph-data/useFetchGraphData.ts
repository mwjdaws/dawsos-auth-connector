
/**
 * useFetchGraphData Hook
 * 
 * Handles the data fetching and processing for the relationship graph.
 * This hook fetches data from multiple Supabase tables and processes it.
 */
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FetchResult, GraphFetchOptions } from './types';
import { GraphData } from '../../types';
import { handleError, categorizeError } from '@/utils/errors';

export function useFetchGraphData() {
  /**
   * Fetch raw data from Supabase
   */
  const fetchRawData = useCallback(async (): Promise<FetchResult> => {
    console.log("Fetching graph data...");
    
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
    
    return {
      sources,
      links,
      terms,
      termRelationships,
      sourceTerms
    };
  }, []);

  /**
   * Process raw data into graph format
   */
  const processGraphData = useCallback((data: FetchResult): GraphData => {
    const { sources, links, terms, termRelationships, sourceTerms } = data;
    
    // Check if we have actual data to render
    if (
      (!sources || sources.length === 0) && 
      (!terms || terms.length === 0)
    ) {
      console.log("No graph data available to display");
      return { nodes: [], links: [] };
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
    return { 
      nodes,
      links: validLinks
    };
  }, []);

  /**
   * Log information about the starting node
   */
  const logStartingNodeInfo = useCallback((graphData: GraphData, startingNodeId?: string) => {
    if (!startingNodeId) return;
    
    const startingNode = graphData.nodes.find(n => n.id === startingNodeId);
    console.log(`Starting node ${startingNodeId} found:`, startingNode ? 'YES' : 'NO');
    
    if (startingNode) {
      console.log(`Starting node is a ${startingNode.type} named "${startingNode.name}"`);
      
      // Count direct connections to starting node
      const directConnections = graphData.links.filter(
        l => l.source === startingNodeId || l.target === startingNodeId
      ).length;
      
      console.log(`Starting node has ${directConnections} direct connections`);
    }
  }, []);

  /**
   * Main function to fetch and process graph data
   */
  const fetchAndProcessGraphData = useCallback(async (
    startingNodeId?: string,
    options: GraphFetchOptions = {}
  ): Promise<{ data: GraphData | null; error: string | null }> => {
    try {
      // Fetch the raw data from Supabase
      const rawData = await fetchRawData();
      
      // Process the data into graph format
      const graphData = processGraphData(rawData);
      
      // Log information about the starting node if provided
      logStartingNodeInfo(graphData, startingNodeId);
      
      return { data: graphData, error: null };
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
      
      // Log the error with our custom error handler
      handleError(err, errorMessage, {
        level: "error",
        context: { startingNodeId }
      });
      
      return { data: null, error: errorMessage };
    }
  }, [fetchRawData, processGraphData, logStartingNodeInfo]);

  return {
    fetchAndProcessGraphData
  };
}
