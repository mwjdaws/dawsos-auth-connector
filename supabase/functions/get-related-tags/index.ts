
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
    console.log("get-related-tags function called");
    
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
      try {
        const body = await req.json();
        knowledgeSourceId = body.knowledgeSourceId;
        console.log("Received request body:", JSON.stringify(body));
      } catch (parseError) {
        console.error("Error parsing request body:", parseError);
      }
    }
    
    // If not in body, try URL params
    if (!knowledgeSourceId) {
      const url = new URL(req.url);
      knowledgeSourceId = url.searchParams.get("knowledgeSourceId");
      console.log("Extracted from URL params:", knowledgeSourceId);
    }
    
    // Validate input
    if (!knowledgeSourceId) {
      console.error("Missing required parameter: knowledgeSourceId");
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
    
    // First, get the tags for this content
    const { data, error } = await supabaseClient
      .from('tags')
      .select('name')
      .eq('content_id', knowledgeSourceId);
    
    if (error) {
      console.error("Error fetching tags:", error);
      return new Response(
        JSON.stringify({ 
          error: "Failed to fetch tags",
          details: error.message,
          code: error.code || "UNKNOWN_ERROR",
          tags: [] // Always include empty tags array in error responses
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Get tag names for this content
    const contentTags = data.map(item => item.name);
    console.log("Content tags found:", contentTags);
    
    // If we have no tags for this content, return empty array
    if (contentTags.length === 0) {
      console.log("No tags found for this content, returning empty array");
      return new Response(
        JSON.stringify({ tags: [] }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Find similar content with at least one matching tag
    const { data: similarContent, error: similarError } = await supabaseClient
      .from('tags')
      .select('content_id')
      .in('name', contentTags)
      .neq('content_id', knowledgeSourceId);
    
    if (similarError) {
      console.error("Error finding similar content:", similarError);
      return new Response(
        JSON.stringify({ tags: [] }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Get unique content IDs
    const similarContentIds = [...new Set(similarContent.map(item => item.content_id))];
    console.log("Similar content IDs found:", similarContentIds);
    
    // If no similar content found
    if (similarContentIds.length === 0) {
      console.log("No similar content found, returning empty array");
      return new Response(
        JSON.stringify({ tags: [] }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Get tags from similar content that aren't in the original content
    const { data: relatedTags, error: relatedError } = await supabaseClient
      .from('tags')
      .select('name')
      .in('content_id', similarContentIds)
      .not('name', 'in', `(${contentTags.map(tag => `'${tag}'`).join(',')})`)
      .limit(10);
    
    if (relatedError) {
      console.error("Error fetching related tags:", relatedError);
      return new Response(
        JSON.stringify({ tags: [] }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Format the response
    const uniqueRelatedTags = [...new Set(relatedTags.map(item => item.name))];
    console.log(`Found ${uniqueRelatedTags.length} related tags:`, uniqueRelatedTags);
    
    return new Response(
      JSON.stringify({ tags: uniqueRelatedTags }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Unhandled error:", error.message, error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message,
        stack: error.stack,
        tags: [] // Always include empty tags array in error responses
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
