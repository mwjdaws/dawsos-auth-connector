
// Deno Edge Function for tag generation
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCorsPreflightRequest } from "./utils/cors.ts";
import { generateTagsWithOpenAI } from "./utils/openai.ts";
import { saveTagsToDatabase } from "./utils/database.ts";

interface RequestBody {
  content: string;
  save?: boolean;
  contentId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse the request body
    const { content, save = false, contentId } = await req.json() as RequestBody;

    if (!content || typeof content !== "string") {
      console.error("Missing or invalid content");
      return new Response(
        JSON.stringify({ error: "Content is required and must be a string" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate tags using OpenAI
    const { tags, error: generationError } = await generateTagsWithOpenAI(content);
    
    // Save tags to database if requested
    if (save && contentId) {
      const { success, message, error: saveError } = await saveTagsToDatabase(tags, contentId);
      
      return new Response(
        JSON.stringify({ 
          tags, 
          success,
          message,
          error: generationError || saveError 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Return just the generated tags if not saving
    return new Response(
      JSON.stringify({ 
        tags,
        error: generationError 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating tags:", error);
    
    // Safely return a fallback response
    return new Response(
      JSON.stringify({ 
        tags: ["content", "text", "document", "analysis", "metadata"], 
        error: "An error occurred, returning fallback tags" 
      }),
      {
        status: 200, // Return 200 with fallback tags instead of error
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
