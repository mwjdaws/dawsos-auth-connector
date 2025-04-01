
/**
 * Generate structure from template content
 * 
 * This function analyzes template content and generates a structure object
 * that can be used to understand the template's organization.
 * 
 * @param content The template content to analyze
 * @returns A structured representation of the content
 */
export function generateStructureFromContent(content: string) {
  const structure = {
    sections: [],
    totalWordCount: 0,
    hasHeadings: false,
    hasLists: false,
    hasCodeBlocks: false
  };
  
  if (!content) return structure;
  
  // Count total words
  structure.totalWordCount = content.split(/\s+/).filter(Boolean).length;
  
  // Check for headings
  structure.hasHeadings = /^#{1,6}\s+.+$/m.test(content);
  
  // Check for lists
  structure.hasLists = /^[\s-*+][\s\w].+$/m.test(content);
  
  // Check for code blocks
  structure.hasCodeBlocks = /```[\s\S]*?```/.test(content);
  
  // Extract sections based on headings
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    
    structure.sections.push({
      level,
      title,
      position: match.index
    });
  }
  
  return structure;
}

/**
 * Generate an empty template with predefined sections
 * 
 * @returns A string containing a basic template structure
 */
export function generateEmptyTemplate() {
  return `# Title

## Introduction
Enter an introduction here...

## Main Content
Enter your main content here...

## Conclusion
Enter a conclusion here...
`;
}

/**
 * Validate template content
 * 
 * @param content The template content to validate
 * @returns Object with validation result and any error messages
 */
export function validateTemplateContent(content: string) {
  if (!content) {
    return { isValid: false, message: 'Template content cannot be empty' };
  }
  
  if (content.length < 10) {
    return { isValid: false, message: 'Template content is too short' };
  }
  
  if (!content.includes('#')) {
    return { isValid: false, message: 'Template should include at least one heading' };
  }
  
  return { isValid: true, message: null };
}
