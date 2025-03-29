
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

    // Get existing metadata and published status to preserve it
    const { data: existingData, error: fetchError } = await supabase
      .from("knowledge_sources")
      .select("metadata, user_id, published, published_at")
      .eq("id", documentId)
      .single();

    if (fetchError) {
      console.error("Failed to fetch existing data:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch existing document data", details: fetchError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!existingData) {
      console.error("No existing document found with ID:", documentId);
      return new Response(
        JSON.stringify({ error: `No document found with ID: ${documentId}` }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract content metadata
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Approx. words per minute
    const userId = existingData?.user_id;
    
    // IMPORTANT: Explicitly handle the published status
    const isPublished = existingData.published === true;
    const publishedAt = existingData?.published_at;

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
        // Continue with the process even if tag generation fails
      }
    }

    // Combine with existing metadata
    const existingMetadata = existingData?.metadata || {};
    const updatedMetadata = {
      ...existingMetadata,
      word_count: wordCount,
      reading_time_minutes: readingTime,
      extracted_tags: tags,
      enriched_at: new Date().toISOString(),
      user_id: userId, // Ensure user_id is preserved in metadata
      enriched: true, // Mark as enriched
      analysis_type: "content_enrichment",
      term_matches: [], // This would be populated by the ontology suggestion function
      confidence_scores: {}, // Would be populated with confidence scores for each match
      processed_content_size: content.length
    };

    console.log("Updating metadata:", updatedMetadata);
    console.log("Published status:", isPublished);
    console.log("Published at:", publishedAt);

    // Update the knowledge source with enriched metadata
    // IMPORTANT: Explicitly set the published status based on the existing value
    const { data: updateData, error: updateError } = await supabase
      .from("knowledge_sources")
      .update({
        metadata: updatedMetadata,
        published: isPublished, // Explicitly set this to maintain state
        published_at: publishedAt // Preserve the original published timestamp
      })
      .eq("id", documentId)
      .select();

    if (updateError) {
      console.error("Error updating metadata:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update document metadata", details: updateError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Double-check that the published status was correctly maintained
    const { data: verifyData, error: verifyError } = await supabase
      .from("knowledge_sources")
      .select("published, published_at")
      .eq("id", documentId)
      .single();
      
    if (verifyError) {
      console.warn("Error verifying update:", verifyError);
    } else if (verifyData && verifyData.published !== isPublished) {
      console.warn("Published status mismatch detected, fixing...");
      
      const { error: fixError } = await supabase
        .from("knowledge_sources")
        .update({
          published: isPublished,
          published_at: publishedAt
        })
        .eq("id", documentId);
        
      if (fixError) {
        console.error("Failed to fix published status:", fixError);
      } else {
        console.log("Successfully fixed published status");
      }
    }

    // Save tags to the tags table
    if (tags.length > 0) {
      console.log(`Saving ${tags.length} tags for document ${documentId}`);
      
      try {
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
          // Continue execution even if tag addition fails
        }
      } catch (tagSaveError) {
        console.error("Error in tag save process:", tagSaveError);
        // Continue execution even if tag addition fails
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        enriched: { 
          wordCount, 
          readingTime, 
          tags,
          metadata: updatedMetadata,
          published: isPublished // Include published status in response
        } 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in content enrichment:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error in content enrichment" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
