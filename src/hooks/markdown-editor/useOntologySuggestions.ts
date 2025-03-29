
import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import Fuse from 'fuse.js';

interface OntologyTerm {
  id: string;
  term: string;
  description?: string;
  domain?: string;
  score?: number;
}

interface RelatedNote {
  id: string;
  title: string;
  score?: number;
}

interface SuggestionResult {
  terms: OntologyTerm[];
  notes: RelatedNote[];
}

/**
 * Hook for suggesting ontology terms and related notes based on content
 */
export function useOntologySuggestions() {
  const [suggestions, setSuggestions] = useState<SuggestionResult>({
    terms: [],
    notes: []
  });
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Analyze content and suggest relevant ontology terms and notes
   * Uses edge function if available, falls back to client-side analysis
   */
  const analyzeContent = useCallback(async (content: string, title: string, sourceId?: string) => {
    if (!content || content.length < 20) return;
    
    setIsLoading(true);
    
    try {
      console.log(`Analyzing content for suggestions (${content.length} chars)`);
      
      // Try to use the edge function first
      try {
        const { data: edgeFunctionData, error: edgeFunctionError } = await supabase.functions.invoke(
          'suggest-ontology-terms',
          {
            body: { content, title, sourceId }
          }
        );
        
        if (!edgeFunctionError && edgeFunctionData?.terms) {
          console.log('Using results from edge function:', edgeFunctionData);
          setSuggestions({
            terms: edgeFunctionData.terms || [],
            notes: edgeFunctionData.notes || []
          });
          return {
            terms: edgeFunctionData.terms || [],
            notes: edgeFunctionData.notes || []
          };
        }
        
        console.log('Edge function unavailable, falling back to client-side analysis');
      } catch (edgeError) {
        console.error('Error calling edge function:', edgeError);
        console.log('Falling back to client-side analysis');
      }
      
      // Extract important keywords and phrases from content
      const keywords = extractKeywords(content, title);
      console.log('Extracted keywords:', keywords);
      
      // Fetch all ontology terms
      const { data: allTerms, error: termsError } = await supabase
        .from('ontology_terms')
        .select('id, term, description, domain');
      
      if (termsError) {
        console.error('Error fetching ontology terms:', termsError);
        throw termsError;
      }
      
      // Fetch published knowledge sources
      const { data: knowledgeSources, error: sourcesError } = await supabase
        .from('knowledge_sources')
        .select('id, title, content')
        .eq('published', true)
        .not('id', 'eq', sourceId); // Exclude current source
      
      if (sourcesError) {
        console.error('Error fetching knowledge sources:', sourcesError);
        throw sourcesError;
      }
      
      // Use fuzzy search to find matching terms
      const termFuse = new Fuse(allTerms || [], {
        keys: ['term', 'description'],
        threshold: 0.4,
        includeScore: true
      });
      
      const termMatches = keywords.flatMap(keyword => {
        const results = termFuse.search(keyword);
        return results.map(result => ({
          id: result.item.id,
          term: result.item.term,
          description: result.item.description,
          domain: result.item.domain,
          score: (1 - (result.score || 0.5)) * 100 // Convert to percentage relevance
        }));
      });
      
      // Use fuzzy search to find matching notes
      const notesFuse = new Fuse(knowledgeSources || [], {
        keys: ['title', 'content'],
        threshold: 0.3,
        includeScore: true
      });
      
      const noteMatches = keywords.flatMap(keyword => {
        const results = notesFuse.search(keyword);
        return results.map(result => ({
          id: result.item.id,
          title: result.item.title,
          score: (1 - (result.score || 0.5)) * 100 // Convert to percentage relevance
        }));
      });
      
      // Filter duplicates and sort by relevance
      const uniqueTerms = filterUniqueByProperty(termMatches, 'id').slice(0, 8);
      const uniqueNotes = filterUniqueByProperty(noteMatches, 'id').slice(0, 5);
      
      // Update suggestions
      const results = {
        terms: uniqueTerms,
        notes: uniqueNotes
      };
      
      setSuggestions(results);
      
      // Return the suggestions in case caller needs immediate access
      return results;
    } catch (error) {
      console.error('Error analyzing content for suggestions:', error);
      toast({
        title: 'Analysis Error',
        description: 'Failed to analyze content for suggestions',
        variant: 'destructive'
      });
      
      return {
        terms: [],
        notes: []
      };
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Apply suggested ontology term
   */
  const applySuggestedTerm = useCallback(async (
    termId: string, 
    sourceId: string
  ) => {
    try {
      if (!sourceId) {
        throw new Error('Source ID is required to apply a term');
      }
      
      // Check if term is already applied
      const { data: existingAssociations, error: checkError } = await supabase
        .from('knowledge_source_ontology_terms')
        .select('id')
        .match({
          knowledge_source_id: sourceId,
          ontology_term_id: termId
        });
        
      if (checkError) {
        console.error('Error checking existing term association:', checkError);
        throw checkError;
      }
      
      // If already associated, just inform the user
      if (existingAssociations && existingAssociations.length > 0) {
        toast({
          title: 'Term Already Applied',
          description: 'This ontology term is already associated with this document.'
        });
        return false;
      }
      
      // Add the ontology term association
      const { data, error } = await supabase
        .from('knowledge_source_ontology_terms')
        .insert({
          knowledge_source_id: sourceId,
          ontology_term_id: termId,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select();
        
      if (error) {
        console.error('Error applying suggested term:', error);
        throw error;
      }
      
      toast({
        title: 'Term Applied',
        description: 'The ontology term has been associated with this document.'
      });
      
      return true;
    } catch (error) {
      console.error('Error applying suggested term:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply the suggested term',
        variant: 'destructive'
      });
      return false;
    }
  }, []);
  
  /**
   * Apply suggested note link
   */
  const applySuggestedLink = useCallback(async (
    targetId: string,
    sourceId: string
  ) => {
    try {
      if (!sourceId) {
        throw new Error('Source ID is required to create a link');
      }
      
      // Skip if source and target are the same
      if (sourceId === targetId) {
        toast({
          title: 'Link Error',
          description: 'Cannot link a document to itself',
          variant: 'destructive'
        });
        return false;
      }
      
      // Check if link already exists
      const { data: existingLinks, error: checkError } = await supabase
        .from('note_links')
        .select('id')
        .match({
          source_id: sourceId,
          target_id: targetId
        });
        
      if (checkError) {
        console.error('Error checking existing links:', checkError);
        throw checkError;
      }
      
      // If already linked, just inform the user
      if (existingLinks && existingLinks.length > 0) {
        toast({
          title: 'Link Already Exists',
          description: 'These documents are already linked'
        });
        return false;
      }
      
      // Create the note link
      const { data, error } = await supabase
        .from('note_links')
        .insert({
          source_id: sourceId,
          target_id: targetId,
          link_type: 'AI-suggested',
          created_by: (await supabase.auth.getUser()).data.user?.id
        });
        
      if (error) {
        console.error('Error creating suggested link:', error);
        throw error;
      }
      
      toast({
        title: 'Link Created',
        description: 'The documents have been linked successfully'
      });
      
      return true;
    } catch (error) {
      console.error('Error applying suggested link:', error);
      toast({
        title: 'Error',
        description: 'Failed to create the suggested link',
        variant: 'destructive'
      });
      return false;
    }
  }, []);

  return {
    suggestions,
    isLoading,
    analyzeContent,
    applySuggestedTerm,
    applySuggestedLink
  };
}

/**
 * Helper function to extract keywords from content
 */
function extractKeywords(content: string, title: string): string[] {
  // Simple extraction of important terms
  // In a production system, this would use NLP or ML techniques
  
  // Clean up content
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/#+\s+([^\n]+)/g, '$1') // Extract headers
    .toLowerCase();
  
  // Extract words, prioritizing from title and headers
  const titleWords = title.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  
  // Extract potential header content (basic approach)
  const headerPattern = /#+\s+([^\n]+)/g;
  let headerWords: string[] = [];
  let match;
  while ((match = headerPattern.exec(content)) !== null) {
    headerWords = headerWords.concat(
      match[1].toLowerCase().split(/\W+/).filter(w => w.length > 3)
    );
  }
  
  // Get all content words excluding common stop words
  const stopWords = new Set([
    'about', 'after', 'all', 'also', 'and', 'any', 'been', 'before', 'between',
    'both', 'but', 'for', 'from', 'had', 'has', 'have', 'here', 'how', 'into',
    'more', 'not', 'now', 'over', 'some', 'such', 'than', 'that', 'the', 'their',
    'them', 'then', 'there', 'these', 'they', 'this', 'through', 'under', 'very',
    'was', 'were', 'what', 'when', 'where', 'which', 'while', 'with', 'would'
  ]);
  
  const contentWords = cleanContent
    .split(/\W+/)
    .filter(w => w.length > 4 && !stopWords.has(w));
  
  // Count word frequencies to identify important terms
  const wordCounts = new Map<string, number>();
  for (const word of contentWords) {
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
  }
  
  // Prioritize title words, then header words, then frequent content words
  const titleSet = new Set(titleWords);
  const headerSet = new Set(headerWords.filter(w => !titleSet.has(w)));
  
  // Get top frequent words
  const sortedContentWords = [...wordCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0])
    .filter(w => !titleSet.has(w) && !headerSet.has(w))
    .slice(0, 15);
  
  // Combine phrases from title 
  const titlePhrases = extractPhrases(title);
  
  // Combine all keywords
  return [
    ...titlePhrases,
    ...titleWords,
    ...headerWords,
    ...sortedContentWords
  ].slice(0, 20); // Limit to 20 keywords
}

/**
 * Extract meaningful phrases from text
 */
function extractPhrases(text: string): string[] {
  if (!text || text.length < 5) return [];
  
  // Simple phrase extraction (2-3 word combos)
  const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  const phrases: string[] = [];
  
  // Create 2-word phrases
  for (let i = 0; i < words.length - 1; i++) {
    phrases.push(`${words[i]} ${words[i+1]}`);
  }
  
  // Create 3-word phrases
  for (let i = 0; i < words.length - 2; i++) {
    phrases.push(`${words[i]} ${words[i+1]} ${words[i+2]}`);
  }
  
  return phrases;
}

/**
 * Filter unique objects by a property
 */
function filterUniqueByProperty<T>(array: T[], property: keyof T): T[] {
  const seen = new Set();
  return array
    .filter(item => {
      const value = item[property];
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    })
    .sort((a: any, b: any) => b.score - a.score); // Sort by score descending
}
