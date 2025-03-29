
/**
 * Find matching ontology terms based on keywords
 */
export function findMatchingTerms(terms: any[], keywords: string[]) {
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

/**
 * Find related knowledge sources based on keywords
 */
export function findRelatedSources(sources: any[], keywords: string[], originalContent: string) {
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
