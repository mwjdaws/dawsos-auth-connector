
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract request data
    const { queryText, contentId } = await req.json();

    if (!queryText) {
      throw new Error('Query text is required');
    }

    // Fetch popular tags from the database
    const { data: popularTags, error: tagsError } = await supabase
      .from('tags')
      .select('name, count(*)')
      .order('count', { ascending: false })
      .limit(20);

    if (tagsError) {
      throw tagsError;
    }

    // Simple algorithm to suggest tags based on query text and popular tags
    const words = queryText.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const suggestedTags = new Set<string>();
    
    // Add direct matches from popular tags
    popularTags?.forEach(tag => {
      if (words.some(word => tag.name.toLowerCase().includes(word))) {
        suggestedTags.add(tag.name);
      }
    });
    
    // Add some frequent words from the text as potential tags
    words.forEach(word => {
      if (word.length > 5 && !['about', 'these', 'their', 'there', 'would'].includes(word)) {
        suggestedTags.add(word);
      }
    });

    // Convert set to array and limit to 10 tags
    const suggestedTagsArray = Array.from(suggestedTags).slice(0, 10);

    // If contentId is provided, save these tags to the database
    if (contentId) {
      const tagsToInsert = suggestedTagsArray.map(tag => ({
        name: tag,
        content_id: contentId
      }));

      const { error: insertError } = await supabase
        .from('tags')
        .insert(tagsToInsert);

      if (insertError) {
        console.error('Error inserting tags:', insertError);
      }
    }

    // Return the suggested tags
    return new Response(
      JSON.stringify({ 
        tags: suggestedTagsArray,
        contentId: contentId || null
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in suggest-tags function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        tags: [] 
      }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
