
import { KnowledgeTemplate } from '@/types/knowledge';

/**
 * Format template into a readable option for selectors
 */
export function formatTemplateOption(template: KnowledgeTemplate | null) {
  if (!template) {
    return { label: 'No template', value: '' };
  }
  
  return {
    label: template.name || 'Unnamed Template',
    value: template.id,
    description: formatTemplateDescription(template)
  };
}

/**
 * Format template description for display
 */
function formatTemplateDescription(template: KnowledgeTemplate | null) {
  if (!template) return '';
  
  // Get first 50 characters of content
  const contentPreview = template.content && template.content.length > 50
    ? `${template.content.substring(0, 50)}...`
    : template.content || '';
  
  return contentPreview;
}

/**
 * Format multiple templates into options
 */
export function formatTemplateOptions(templates: KnowledgeTemplate[] | null | undefined) {
  if (!templates || !templates.length) {
    return [{ label: 'No templates available', value: '' }];
  }
  
  return templates.map(formatTemplateOption);
}
