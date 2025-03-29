import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? "";
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials are missing");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { batchSize = 10, sourceIds = [], filter = {} } = await req.json();
    
    console.log(`Starting batch ontology enrichment: batchSize=${batchSize}, specificSourceIds=${sourceIds.length}`);
    
    // Determine which sources to process
    let sourcesToProcess = [];
    
    // If specific source IDs were provided, use those
    if (sourceIds && sourceIds.length > 0) {
      console.log(`Processing specific sources: ${sourceIds.join(', ')}`);
      const { data, error } = await supabase
        .from('knowledge_sources')
        .select('id, title, content')
        .in('id', sourceIds);
        
      if (error) {
        throw new Error(`Failed to fetch specific sources: ${error.message}`);
      }
      
      sourcesToProcess = data || [];
    } 
    // Otherwise, get sources that need enrichment based on filter criteria
    else {
      let query = supabase
        .from('knowledge_sources')
        .select('id, title, content');
      
      // Apply filters
      if (filter.published !== undefined) {
        query = query.eq('published', filter.published);
      }
      
      if (filter.needsEnrichment) {
        query = query.or('metadata.is.null,not.metadata->enriched.eq.true');
      }
      
      // Apply limit
      query = query.limit(batchSize);
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(`Failed to fetch sources: ${error.message}`);
      }
      
      sourcesToProcess = data || [];
    }
    
    if (sourcesToProcess.length === 0) {
      return new Response(
        JSON.stringify({ message: "No sources to process" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Found ${sourcesToProcess.length} sources to process`);
    
    // Prepare the sources array for batch processing
    const sourcesForBatch = sourcesToProcess.map(source => ({
      id: source.id,
      content: source.content,
      title: source.title
    }));
    
    // Call the suggest-ontology-terms function for batch processing
    const response = await fetch(`${supabaseUrl}/functions/v1/suggest-ontology-terms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({ sources: sourcesForBatch })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to process batch: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in batch-ontology-enrichment:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Unknown error",
        results: [],
        errors: [{ global: error.message }]
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
