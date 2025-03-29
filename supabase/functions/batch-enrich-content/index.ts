
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body - we'll use this to control the batch size and other parameters
    const { batchSize = 10, applyOntologyTerms = true } = await req.json();
    
    console.log(`Starting batch enrichment with batchSize: ${batchSize}, applyOntologyTerms: ${applyOntologyTerms}`);
    
    // Create a Supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get published knowledge sources that haven't been enriched yet
    // We look for sources where either metadata is null or metadata->enriched is not true
    const { data: sourcesToEnrich, error: fetchError } = await supabase
      .from("knowledge_sources")
      .select("id, title, content")
      .eq("published", true)
      .or("metadata.is.null,not.metadata->enriched.eq.true")
      .limit(batchSize);

    if (fetchError) {
      console.error("Error fetching knowledge sources:", fetchError);
      throw new Error(`Failed to fetch knowledge sources: ${fetchError.message}`);
    }

    console.log(`Found ${sourcesToEnrich?.length || 0} knowledge sources to enrich`);
    
    if (!sourcesToEnrich || sourcesToEnrich.length === 0) {
      return new Response(
        JSON.stringify({ message: "No knowledge sources require enrichment" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Process each source in sequence
    const results = [];
    for (const source of sourcesToEnrich) {
      try {
        console.log(`Processing knowledge source: ${source.id} - ${source.title}`);
        
        // Step 1: Call the suggest-ontology-terms function to get term suggestions
        const { data: suggestionsData, error: suggestionsError } = await supabase.functions.invoke(
          "suggest-ontology-terms", 
          { 
            body: { 
              sourceId: source.id, 
              content: source.content, 
              title: source.title 
            } 
          }
        );
        
        if (suggestionsError) {
          console.error(`Error getting suggestions for source ${source.id}:`, suggestionsError);
          results.push({ 
            id: source.id, 
            title: source.title, 
            success: false, 
            error: suggestionsError.message
          });
          continue;
        }
        
        console.log(`Got ${suggestionsData?.terms?.length || 0} term suggestions for source ${source.id}`);
        
        // Step 2: Prepare metadata for ontology enrichment
        const enrichmentMetadata = {
          enriched: true,
          enriched_at: new Date().toISOString(),
          suggested_terms: suggestionsData?.terms || [],
          related_notes: suggestionsData?.notes || [],
          analysis_type: "ontology_term_suggestions",
          processed_content_size: source.content.length
        };

        // Step 3: Update the knowledge source with enriched metadata
        const { error: updateError } = await supabase
          .from("knowledge_sources")
          .update({ metadata: enrichmentMetadata })
          .eq("id", source.id);
          
        if (updateError) {
          console.error(`Error updating metadata for source ${source.id}:`, updateError);
          results.push({ 
            id: source.id, 
            title: source.title, 
            success: false, 
            error: updateError.message
          });
          continue;
        }
        
        // Step 4: If requested, apply ontology terms with good confidence scores
        let appliedTerms = 0;
        if (applyOntologyTerms && suggestionsData?.terms) {
          const goodTerms = suggestionsData.terms
            .filter(term => term.score && term.score > 70); // Only use terms with high confidence
          
          if (goodTerms.length > 0) {
            console.log(`Applying ${goodTerms.length} ontology terms to source ${source.id}`);
            
            // Get existing term links to avoid duplicates
            const { data: existingLinks } = await supabase
              .from("knowledge_source_ontology_terms")
              .select("ontology_term_id")
              .eq("knowledge_source_id", source.id);
            
            const existingTermIds = new Set(
              (existingLinks || []).map(link => link.ontology_term_id)
            );
            
            // Filter out terms that are already linked
            const newTerms = goodTerms.filter(term => !existingTermIds.has(term.id));
            
            if (newTerms.length > 0) {
              // Create link records
              const linkRecords = newTerms.map(term => ({
                knowledge_source_id: source.id,
                ontology_term_id: term.id,
                created_at: new Date().toISOString(),
                review_required: false // Auto-approve high confidence terms
              }));
              
              const { error: linkError } = await supabase
                .from("knowledge_source_ontology_terms")
                .insert(linkRecords);
              
              if (linkError) {
                console.error(`Error creating ontology links for source ${source.id}:`, linkError);
              } else {
                appliedTerms = linkRecords.length;
              }
            }
          }
        }
        
        results.push({ 
          id: source.id, 
          title: source.title, 
          success: true, 
          termsApplied: appliedTerms
        });
        
        console.log(`Successfully enriched source ${source.id} and applied ${appliedTerms} terms`);
      } catch (sourceError) {
        console.error(`Error processing source ${source.id}:`, sourceError);
        results.push({ 
          id: source.id, 
          title: source.title, 
          success: false, 
          error: sourceError.message
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        processed: results.length,
        successful: results.filter(r => r.success).length, 
        failed: results.filter(r => !r.success).length,
        results 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in batch-enrich-content:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error in batch enrichment" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
