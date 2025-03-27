// Deno Edge Function for tag generation
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

interface RequestBody {
  content: string;
  save?: boolean;
  contentId?: string;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

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

    // Get OpenAI API key from environment variable
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      console.error("OpenAI API key not configured");
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Generating tags for content:", content.substring(0, 100) + "...");

    try {
      // Call OpenAI API to generate tags
      const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a tag generation assistant. Extract 5-10 relevant tags from the provided content. Return ONLY an array of tags in JSON format, nothing else."
            },
            {
              role: "user",
              content
            }
          ],
          temperature: 0.3,
          max_tokens: 150
        })
      });

      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.json();
        console.error("OpenAI API error:", errorData);
        return new Response(
          JSON.stringify({ error: "Failed to generate tags from OpenAI", details: errorData }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const openaiData = await openaiResponse.json() as OpenAIResponse;
      const tagsContent = openaiData.choices[0].message.content;
      console.log("Raw OpenAI response:", tagsContent);
      
      // Parse tags from the response
      let tags: string[] = [];
      try {
        // Try to parse if response is a JSON array
        if (tagsContent.trim().startsWith("[") && tagsContent.trim().endsWith("]")) {
          tags = JSON.parse(tagsContent);
        } else if (tagsContent.trim().startsWith("{") && tagsContent.trim().endsWith("}")) {
          // Try to parse if response is a JSON object with a tags property
          const parsedObject = JSON.parse(tagsContent);
          if (Array.isArray(parsedObject.tags)) {
            tags = parsedObject.tags;
          } else {
            // Try to extract tags from object values
            tags = Object.values(parsedObject).filter(value => typeof value === 'string');
          }
        } else {
          // Otherwise, split by commas, newlines, or bullets
          tags = tagsContent
            .split(/[\n,•\-]+/)
            .map(tag => tag.trim())
            .filter(tag => tag && !tag.startsWith("[") && !tag.endsWith("]") && tag.length > 1);
        }
      } catch (parseError) {
        console.error("Error parsing tags:", parseError);
        // Fallback: split by commas or newlines
        tags = tagsContent
          .split(/[\n,]+/)
          .map(tag => tag.trim())
          .filter(tag => tag && tag.length > 1);
      }

      // If tags array is still empty, return a default set
      if (tags.length === 0) {
        console.warn("Failed to parse tags, using default tags");
        tags = ["content", "document", "text", "analysis", "metadata"];
      }

      // Limit to 10 tags
      tags = tags.slice(0, 10);
      console.log("Final parsed tags:", tags);
      
      // Save tags to database if requested
      if (save && contentId) {
        try {
          // Create Supabase client using env vars
          const supabaseUrl = Deno.env.get("SUPABASE_URL");
          const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
          
          if (!supabaseUrl || !supabaseKey) {
            console.error("Supabase credentials not configured");
          } else {
            const supabase = createClient(supabaseUrl, supabaseKey);
            
            // Prepare tags for insertion
            const tagsToInsert = tags.map(name => ({
              name,
              content_id: contentId
            }));
            
            // Insert tags into the database
            const { data, error } = await supabase
              .from("tags")
              .insert(tagsToInsert);
              
            if (error) {
              console.error("Error saving tags to database:", error);
            } else {
              console.log(`Successfully saved ${tagsToInsert.length} tags to database`);
            }
          }
        } catch (error) {
          console.error("Error in database operation:", error);
        }
      }

      console.log("Returning tags:", tags);
      
      // Return the generated tags
      return new Response(
        JSON.stringify({ tags }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (openaiError) {
      console.error("Error calling OpenAI API:", openaiError);
      return new Response(
        JSON.stringify({ error: "OpenAI API call failed", details: openaiError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error generating tags:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to generate tags", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
