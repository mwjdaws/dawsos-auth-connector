
// Deno Edge Function for tag generation
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface RequestBody {
  content: string;
}

interface Response {
  tags: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { content } = await req.json() as RequestBody;

    if (!content || typeof content !== "string") {
      return new Response(
        JSON.stringify({ error: "Content is required and must be a string" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Simple tag generation logic
    // In a real app, this would typically use a more sophisticated algorithm or call an AI service
    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    // Get unique words
    const uniqueWords = [...new Set(words)];
    
    // Take the top 5 most frequent words as tags
    const tags = uniqueWords.slice(0, 5);

    // Return the generated tags
    return new Response(
      JSON.stringify({ tags }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating tags:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to generate tags" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
