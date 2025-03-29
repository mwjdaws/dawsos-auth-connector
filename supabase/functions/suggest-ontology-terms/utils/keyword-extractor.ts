
/**
 * Extracts keywords from content and title to use for term matching
 */
export function extractKeywords(content: string, title: string): string[] {
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
