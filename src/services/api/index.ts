
// Re-export all API functions and types, but avoid circular dependencies
export * from './types';
export * from './base';
export * from './knowledgeSources';
export * from './knowledgeSourceVersions';
// Export templates with caution to avoid circular dependencies
export { 
  fetchKnowledgeTemplates,
  fetchKnowledgeTemplateById,
  createKnowledgeTemplate,
  updateKnowledgeTemplate,
  deleteKnowledgeTemplate,
  duplicateKnowledgeTemplate
} from './templates';
export * from './enrichment';
