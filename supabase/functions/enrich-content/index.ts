
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const openAiApiKey = Deno.env.get("OPENAI_API_KEY") ?? "";

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
    // Parse the request body
    const { documentId, title, content } = await req.json();
    
    if (!documentId || !content) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing content enrichment for document ID: ${documentId}`);

    // Create a Supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract metadata from content (simplified example)
    // In a real application, you'd use AI/NLP to extract meaningful metadata
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Approx. words per minute

    // Generate tags if OpenAI API key is available
    let tags = [];
    
    if (openAiApiKey) {
      try {
        // Extract tags using AI - simplified example
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openAiApiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "Extract 5-10 relevant tags/keywords from the following content. Return only a JSON array of strings."
              },
              {
                role: "user",
                content: `Title: ${title}\n\nContent: ${content.substring(0, 1000)}...`
              }
            ],
            temperature: 0.3
          })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0]?.message?.content) {
          try {
            tags = JSON.parse(data.choices[0].message.content);
          } catch (parseError) {
            console.error("Failed to parse OpenAI response:", parseError);
            // Extract tags with a simple regex if JSON parsing fails
            const tagText = data.choices[0].message.content;
            tags = tagText.match(/["']([^"']+)["']/g)?.map(t => t.replace(/["']/g, '')) || [];
          }
        }
      } catch (aiError) {
        console.error("Error generating tags with AI:", aiError);
      }
    }

    // Update the knowledge source with enriched metadata
    const { error: updateError } = await supabase
      .from("knowledge_sources")
      .update({
        metadata: {
          word_count: wordCount,
          reading_time_minutes: readingTime,
          extracted_tags: tags,
          enriched_at: new Date().toISOString()
        }
      })
      .eq("id", documentId);

    if (updateError) {
      throw updateError;
    }

    // Save tags to the tags table
    if (tags.length > 0) {
      const tagObjects = tags.map(name => ({
        name,
        content_id: documentId
      }));

      const { error: tagError } = await supabase
        .from("tags")
        .upsert(tagObjects, { 
          onConflict: 'name,content_id',
          ignoreDuplicates: true
        });

      if (tagError) {
        console.warn("Error adding tags:", tagError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, enriched: { wordCount, readingTime, tags } }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in content enrichment:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
