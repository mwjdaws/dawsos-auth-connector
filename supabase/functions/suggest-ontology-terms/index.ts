
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
        contentLength: requestData.content?.length || 0,
        title: requestData.title || 'none',
        sourceId: requestData.sourceId || 'none'
      }));
    } catch (parseError) {
      console.error("Error parsing request data:", parseError);
      throw new Error("Failed to parse request data: " + parseError.message);
    }
    
    const { content, title, sourceId } = requestData;

    if (!content) {
      console.error("Content is missing");
      throw new Error('Content is required');
    }

    console.log(`Processing ontology term suggestions for: "${title}" (${content.length} chars)`);

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
    return new Response(
      JSON.stringify({ 
        sourceId,
        terms: termMatches.slice(0, 10),
        notes: sourceMatches.slice(0, 5)
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
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
