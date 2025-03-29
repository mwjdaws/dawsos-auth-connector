
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

/**
 * Creates a Supabase client with service role permissions
 */
export function getSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials");
    throw new Error("Missing required environment variables for Supabase connection");
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

/**
 * Fetches ontology terms from the database
 */
export async function fetchOntologyTerms(supabase: any) {
  console.log("Fetching existing ontology terms from database");
  const { data: ontologyTerms, error: termsError } = await supabase
    .from('ontology_terms')
    .select('id, term, description, domain');

  if (termsError) {
    console.error("Error fetching ontology terms:", termsError);
    throw termsError;
  }
  
  console.log(`Found ${ontologyTerms?.length || 0} ontology terms in database`);
  return ontologyTerms || [];
}

/**
 * Fetches knowledge sources from the database
 */
export async function fetchKnowledgeSources(supabase: any, sourceId: string) {
  const { data: knowledgeSources, error: sourcesError } = await supabase
    .from('knowledge_sources')
    .select('id, title, content')
    .eq('published', true)
    .not('id', 'eq', sourceId);
    
  if (sourcesError) {
    console.error("Error fetching knowledge sources:", sourcesError);
    throw sourcesError;
  }
  
  console.log(`Found ${knowledgeSources?.length || 0} knowledge sources for linking`);
  return knowledgeSources || [];
}

/**
 * Stores the analysis results in the knowledge source's agent_metadata field
 */
export async function storeAnalysisResults(supabase: any, sourceId: string, keywords: string[], termMatches: any[], sourceMatches: any[]) {
  if (!sourceId || sourceId.startsWith('temp-')) {
    console.log("Skipping metadata storage for temporary source");
    return;
  }

  try {
    // Create agent metadata for the analysis
    const metadataUpdate = {
      analysis_type: "ontology_term_suggestions",
      analyzed_at: new Date().toISOString(),
      keywords_extracted: keywords,
      suggested_terms: termMatches.map(term => ({
        id: term.id,
        term: term.term,
        domain: term.domain,
        score: term.score
      })),
      related_notes: sourceMatches.map(note => ({
        id: note.id,
        title: note.title,
        score: note.score
      }))
    };
    
    // Update the knowledge source with the metadata
    const { error: updateError } = await supabase
      .from('knowledge_sources')
      .update({ metadata: metadataUpdate })
      .eq('id', sourceId);
      
    if (updateError) {
      console.error("Error updating metadata:", updateError);
      throw updateError;
    } else {
      console.log("Successfully stored analysis results in metadata");
    }
  } catch (storageError) {
    console.error("Error storing analysis results:", storageError);
    // Continue even if storage fails - we'll still return the results
  }
}
