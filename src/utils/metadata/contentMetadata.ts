
/**
 * Checks if content is empty or contains only whitespace
 * 
 * @param content The content to check
 * @returns True if the content is empty, false otherwise
 */
export function isContentEmpty(content: string | null | undefined): boolean {
  return !content || content.trim() === '';
}

/**
 * Extracts metadata from content
 * 
 * @param content The content to extract metadata from
 * @returns Object containing extracted metadata
 */
export function extractContentMetadata(content: string): Record<string, any> {
  if (isContentEmpty(content)) {
    return {};
  }
  
  const metadata: Record<string, any> = {};
  
  // Extract headings
  const headings = extractHeadings(content);
  if (headings.length > 0) {
    metadata.headings = headings;
  }
  
  // Extract approximate word count
  metadata.wordCount = calculateWordCount(content);
  
  return metadata;
}

/**
 * Extracts headings from markdown content
 * 
 * @param content Markdown content
 * @returns Array of heading objects with level and text
 */
function extractHeadings(content: string): Array<{level: number, text: string}> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Array<{level: number, text: string}> = [];
  
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    headings.push({ level, text });
  }
  
  return headings;
}

/**
 * Calculates approximate word count for content
 * 
 * @param content Text content
 * @returns Approximate word count
 */
function calculateWordCount(content: string): number {
  return content.trim().split(/\s+/).length;
}
