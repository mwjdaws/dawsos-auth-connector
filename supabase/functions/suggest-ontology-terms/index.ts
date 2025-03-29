
import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log("suggest-ontology-terms function called with method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    console.log("Creating Supabase client with URL:", supabaseUrl ? "URL provided" : "URL missing");
    console.log("Service role key available:", supabaseServiceKey ? "Yes" : "No");
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract request data
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data received:", JSON.stringify({
        contentLength: requestData.content?.length || 0,
        title: requestData.title || 'none',
        sourceId: requestData.sourceId || 'none'
      }));
    } catch (parseError) {
      console.error("Error parsing request data:", parseError);
      throw new Error("Failed to parse request data: " + parseError.message);
    }
    
    const { content, title, sourceId } = requestData;

    if (!content) {
      console.error("Content is missing");
      throw new Error('Content is required');
    }

    console.log(`Processing ontology term suggestions for: "${title}" (${content.length} chars)`);

    // Fetch existing ontology terms from the database
    console.log("Fetching existing ontology terms from database");
    const { data: ontologyTerms, error: termsError } = await supabase
      .from('ontology_terms')
      .select('id, term, description, domain');

    if (termsError) {
      console.error("Error fetching ontology terms:", termsError);
      throw termsError;
    }
    
    console.log(`Found ${ontologyTerms?.length || 0} ontology terms in database`);

    // Fetch existing knowledge sources for related note suggestions
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

    // Extract keywords from the content
    const keywords = extractKeywords(content, title);
    console.log("Extracted keywords:", keywords);

    // Find matching ontology terms
    const termMatches = findMatchingTerms(ontologyTerms || [], keywords);
    console.log(`Found ${termMatches.length} matching terms`);

    // Find related knowledge sources
    const sourceMatches = findRelatedSources(knowledgeSources || [], keywords, content);
    console.log(`Found ${sourceMatches.length} related knowledge sources`);

    // Return the suggestions
    return new Response(
      JSON.stringify({ 
        sourceId,
        terms: termMatches.slice(0, 10),
        notes: sourceMatches.slice(0, 5)
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in suggest-ontology-terms function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        terms: [],
        notes: []
      }),
      { 
        status: 200, // Return 200 with empty results instead of error
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

// Helper function to extract keywords from content
function extractKeywords(content: string, title: string): string[] {
  // Simple keyword extraction (this could be enhanced with NLP or ML)
  const stopWords = new Set([
    'about', 'after', 'all', 'also', 'and', 'any', 'been', 'before', 'between',
    'both', 'but', 'for', 'from', 'had', 'has', 'have', 'here', 'how', 'into',
    'more', 'not', 'now', 'over', 'some', 'such', 'than', 'that', 'the', 'their',
    'them', 'then', 'there', 'these', 'they', 'this', 'through', 'under', 'very',
    'was', 'were', 'what', 'when', 'where', 'which', 'while', 'with', 'would'
  ]);
  
  // Clean content (remove code blocks, etc.)
  const cleanedContent = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .toLowerCase();
  
  // Extract title words
  const titleWords = title
    .toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
  
  // Extract header words (words after # symbols)
  const headerRegex = /#+\s+([^\n]+)/g;
  let headerMatch;
  let headerWords: string[] = [];
  
  while ((headerMatch = headerRegex.exec(content)) !== null) {
    const headerText = headerMatch[1].toLowerCase();
    const words = headerText
      .split(/\W+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
    headerWords = [...headerWords, ...words];
  }
  
  // Extract significant words from content
  const contentWords = cleanedContent
    .split(/\W+/)
    .filter(word => word.length > 4 && !stopWords.has(word));
  
  // Count word frequency
  const wordCount = new Map<string, number>();
  for (const word of contentWords) {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  }
  
  // Sort words by frequency and get top ones
  const frequentWords = [...wordCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(entry => entry[0]);
  
  // Combine all keywords, prioritizing title and headers
  const combinedKeywords = [...new Set([
    ...titleWords,
    ...headerWords,
    ...frequentWords
  ])].slice(0, 20);
  
  return combinedKeywords;
}

// Helper function to find matching ontology terms
function findMatchingTerms(terms: any[], keywords: string[]) {
  const matches: any[] = [];
  const seenTermIds = new Set<string>();
  
  // Score each term based on keyword matches
  for (const term of terms) {
    let score = 0;
    const termText = `${term.term} ${term.description || ''}`.toLowerCase();
    
    for (const keyword of keywords) {
      if (termText.includes(keyword)) {
        // Scoring: Term name matches are worth more than description matches
        if (term.term.toLowerCase().includes(keyword)) {
          score += 30;
        } else {
          score += 10;
        }
      }
    }
    
    // Only include terms with some relevance
    if (score > 0 && !seenTermIds.has(term.id)) {
      seenTermIds.add(term.id);
      matches.push({
        id: term.id,
        term: term.term,
        description: term.description,
        domain: term.domain,
        score: Math.min(100, score) // Cap at 100%
      });
    }
  }
  
  // Sort by score descending
  return matches.sort((a, b) => b.score - a.score);
}

// Helper function to find related knowledge sources
function findRelatedSources(sources: any[], keywords: string[], originalContent: string) {
  const matches: any[] = [];
  const seenSourceIds = new Set<string>();
  
  for (const source of sources) {
    let score = 0;
    const sourceText = `${source.title} ${source.content || ''}`.toLowerCase();
    
    for (const keyword of keywords) {
      if (sourceText.includes(keyword)) {
        // Scoring: Title matches worth more than content matches
        if (source.title.toLowerCase().includes(keyword)) {
          score += 25;
        } else {
          score += 5;
        }
      }
    }
    
    // Content length similarity contributes to relevance
    const lengthDiff = Math.abs(originalContent.length - (source.content?.length || 0));
    const lengthScore = Math.max(0, 10 - Math.floor(lengthDiff / 1000)); // 0-10 points for length similarity
    score += lengthScore;
    
    // Only include sources with some relevance
    if (score > 10 && !seenSourceIds.has(source.id)) {
      seenSourceIds.add(source.id);
      matches.push({
        id: source.id,
        title: source.title,
        score: Math.min(100, score) // Cap at 100%
      });
    }
  }
  
  // Sort by score descending
  return matches.sort((a, b) => b.score - a.score);
}
