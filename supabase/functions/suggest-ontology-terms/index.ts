
import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Import utility functions
import { corsHeaders, handleCorsRequest } from "./utils/cors.ts";
import { extractKeywords } from "./utils/keyword-extractor.ts";
import { findMatchingTerms, findRelatedSources } from "./utils/term-matcher.ts";
import { 
  getSupabaseClient, 
  fetchOntologyTerms, 
  fetchKnowledgeSources,
  storeAnalysisResults 
} from "./utils/database.ts";

serve(async (req) => {
  console.log("suggest-ontology-terms function called with method:", req.method);
  
  // Handle CORS preflight requests
  const corsResponse = handleCorsRequest(req);
  if (corsResponse) return corsResponse;

  try {
    // Create Supabase client
    const supabase = getSupabaseClient();

    // Extract request data
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data received:", JSON.stringify({
        batchMode: !!requestData.sources,
        sourcesCount: requestData.sources?.length || 0,
        singleSourceId: requestData.sourceId || 'none',
        contentLength: requestData.content?.length || 0,
        title: requestData.title || 'none'
      }));
    } catch (parseError) {
      console.error("Error parsing request data:", parseError);
      throw new Error("Failed to parse request data: " + parseError.message);
    }
    
    // Check if batch mode or single source mode
    const batchMode = Array.isArray(requestData.sources);
    
    // Process in batch mode
    if (batchMode) {
      return await processBatchRequest(supabase, requestData.sources);
    } 
    // Process in single source mode (original functionality)
    else {
      const { content, title, sourceId } = requestData;

      if (!content) {
        console.error("Content is missing");
        throw new Error('Content is required');
      }

      console.log(`Processing ontology term suggestions for: "${title}" (${content.length} chars)`);
      
      const result = await processSingleSource(supabase, sourceId, content, title);
      
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in suggest-ontology-terms function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        terms: [],
        notes: []
      }),
      { 
        status: 200, // Return 200 with empty results instead of error
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

/**
 * Process a batch of knowledge sources
 */
async function processBatchRequest(supabase: any, sources: Array<{id: string, content?: string, title?: string}>) {
  console.log(`Processing batch request with ${sources.length} sources`);
  
  // Fetch all ontology terms once (used for all sources)
  const ontologyTerms = await fetchOntologyTerms(supabase);
  
  // Fetch all knowledge sources once (used for related notes)
  const allKnowledgeSources = await fetchKnowledgeSources(supabase, '');
  
  // Process each source
  const results = [];
  const errors = [];
  
  for (const source of sources) {
    try {
      console.log(`Processing source: ${source.id}`);
      
      // If content is not provided, fetch it
      let content = source.content;
      let title = source.title;
      
      if (!content || !title) {
        console.log(`Fetching content for source: ${source.id}`);
        const { data, error } = await supabase
          .from('knowledge_sources')
          .select('content, title')
          .eq('id', source.id)
          .single();
          
        if (error) {
          console.error(`Error fetching source ${source.id}:`, error);
          errors.push({
            id: source.id,
            error: error.message
          });
          continue;
        }
        
        if (!data) {
          console.error(`Source not found: ${source.id}`);
          errors.push({
            id: source.id,
            error: "Source not found"
          });
          continue;
        }
        
        content = data.content;
        title = data.title;
      }
      
      if (!content) {
        console.error(`Content missing for source: ${source.id}`);
        errors.push({
          id: source.id,
          error: "Content is required"
        });
        continue;
      }
      
      // Extract keywords from the content
      const keywords = extractKeywords(content, title || '');
      
      // Find matching ontology terms
      const termMatches = findMatchingTerms(ontologyTerms, keywords);
      
      // Find related knowledge sources (exclude current source from related)
      const filteredSources = allKnowledgeSources.filter(ks => ks.id !== source.id);
      const sourceMatches = findRelatedSources(filteredSources, keywords, content);
      
      // Store the results in metadata if it's not a temporary source
      if (source.id && !source.id.startsWith('temp-')) {
        await storeAnalysisResults(supabase, source.id, keywords, termMatches, sourceMatches);
      }
      
      // Add to results
      results.push({
        id: source.id,
        terms: termMatches.slice(0, 10),
        notes: sourceMatches.slice(0, 5),
        keywords: keywords
      });
      
      console.log(`Completed processing source: ${source.id} with ${termMatches.length} terms`);
    } catch (sourceError) {
      console.error(`Error processing source ${source.id}:`, sourceError);
      errors.push({
        id: source.id,
        error: sourceError.message
      });
    }
  }
  
  return new Response(
    JSON.stringify({ 
      results,
      errors,
      processingStats: {
        totalProcessed: sources.length,
        successful: results.length,
        failed: errors.length
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

/**
 * Process a single knowledge source (original functionality)
 */
async function processSingleSource(supabase: any, sourceId: string, content: string, title: string) {
  // Fetch existing ontology terms from the database
  const ontologyTerms = await fetchOntologyTerms(supabase);
  
  // Fetch existing knowledge sources for related note suggestions
  const knowledgeSources = await fetchKnowledgeSources(supabase, sourceId);

  // Extract keywords from the content
  const keywords = extractKeywords(content, title);
  console.log("Extracted keywords:", keywords);

  // Find matching ontology terms
  const termMatches = findMatchingTerms(ontologyTerms, keywords);
  console.log(`Found ${termMatches.length} matching terms`);

  // Find related knowledge sources
  const sourceMatches = findRelatedSources(knowledgeSources, keywords, content);
  console.log(`Found ${sourceMatches.length} related knowledge sources`);

  // Store the results in metadata
  if (sourceId && !sourceId.startsWith('temp-')) {
    await storeAnalysisResults(supabase, sourceId, keywords, termMatches, sourceMatches);
  }

  // Return the suggestions
  return { 
    sourceId,
    terms: termMatches.slice(0, 10),
    notes: sourceMatches.slice(0, 5)
  };
}
