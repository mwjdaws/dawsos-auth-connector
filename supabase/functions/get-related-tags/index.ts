
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Set up CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create Supabase client with Deno runtime
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );
    
    // Parse request body to get knowledgeSourceId
    let knowledgeSourceId: string | null = null;
    
    // Check if we're getting params from the request body
    if (req.body) {
      const body = await req.json();
      knowledgeSourceId = body.knowledgeSourceId;
    }
    
    // If not in body, try URL params
    if (!knowledgeSourceId) {
      const url = new URL(req.url);
      knowledgeSourceId = url.searchParams.get("knowledgeSourceId");
    }
    
    // Validate input
    if (!knowledgeSourceId) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required parameter: knowledgeSourceId" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    console.log(`Fetching related tags for knowledge source ID: ${knowledgeSourceId}`);
    
    // Call the SQL function to get related tags
    const { data, error } = await supabaseClient.rpc(
      'get_related_tags',
      { knowledge_source_id: knowledgeSourceId }
    );
    
    if (error) {
      console.error("Error fetching related tags:", error);
      return new Response(
        JSON.stringify({ 
          error: "Failed to fetch related tags",
          details: error.message,
          code: error.code || "UNKNOWN_ERROR"
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Format the response - transform data to expected format
    // Ensure we're extracting the tag names and creating the expected structure
    const relatedTags = data ? data.map(item => item.related_tag) : [];
    console.log(`Found ${relatedTags.length} related tags`);
    
    return new Response(
      JSON.stringify({ relatedTags }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Unhandled error:", error.message);
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message,
        stack: error.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
