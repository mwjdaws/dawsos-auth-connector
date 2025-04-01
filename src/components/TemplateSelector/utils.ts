
import { KnowledgeTemplate } from '@/services/api/types';

/**
 * Parse a template content into blocks for analysis
 */
export const parseTemplateContent = (content: string): string[] => {
  // Simple parsing based on line breaks and separators
  const blocks = content
    .split(/\n\n+/)                      // Split on multiple newlines
    .filter(block => block.trim() !== '') // Remove empty blocks
    .map(block => block.trim());
  
  return blocks;
};

/**
 * Generate a structure object from template content
 */
export const generateStructureFromContent = (content: string): Record<string, any> => {
  const blocks = parseTemplateContent(content);
  
  // Find headers
  const headerBlocks = blocks.filter(block => block.startsWith('#'));
  
  // Basic structure detection
  const structure: Record<string, any> = {
    sections: [],
    fields: [],
    type: 'document'
  };
  
  // Parse headers into sections
  if (headerBlocks.length > 0) {
    structure.sections = headerBlocks.map(header => {
      const level = header.match(/^#+/)?.[0].length || 1;
      const title = header.replace(/^#+\s*/, '');
      
      return {
        title,
        level,
        required: false
      };
    });
  }
  
  // Look for potential input fields with placeholders
  const placeholderRegex = /\{\{([^}]+)\}\}/g;
  const placeholders: string[] = [];
  
  let match;
  const contentToSearch = content || '';
  
  while ((match = placeholderRegex.exec(contentToSearch)) !== null) {
    if (match[1]?.trim()) {
      placeholders.push(match[1].trim());
    }
  }
  
  // Add unique fields
  const uniqueFields = [...new Set(placeholders)];
  structure.fields = uniqueFields.map(field => ({
    name: field,
    type: 'text',
    required: false
  }));
  
  return structure;
};

/**
 * Generate title suggestions from template content
 */
export const generateTitleSuggestions = (template: KnowledgeTemplate): string[] => {
  const suggestions: string[] = [];
  
  // Use the template name
  suggestions.push(template.name);
  
  // Look for title in the content
  const lines = template.content.split('\n');
  const titleLine = lines.find(line => line.startsWith('# '));
  
  if (titleLine) {
    const title = titleLine.replace(/^#\s+/, '');
    if (title && !suggestions.includes(title)) {
      suggestions.push(title);
    }
  }
  
  return suggestions;
};

/**
 * Format a template for display
 */
export const formatTemplate = (template: KnowledgeTemplate) => {
  return {
    ...template,
    shortContent: template.content.substring(0, 100) + '...',
    updatedAt: template.updated_at ? new Date(template.updated_at).toLocaleString() : 'Unknown',
    isGlobal: template.is_global || false
  };
};
