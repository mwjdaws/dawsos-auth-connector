
// Re-export all template-related functions individually to avoid circular references
// This pattern prevents circular dependencies by being explicit about what is exported
export { 
  fetchKnowledgeTemplates, 
  fetchKnowledgeTemplateById 
} from './knowledgeTemplateFetchers';

export { 
  createKnowledgeTemplate, 
  updateKnowledgeTemplate, 
  deleteKnowledgeTemplate, 
  duplicateKnowledgeTemplate 
} from './knowledgeTemplateMutators';

export * from './knowledgeTemplateApplications';
export * from './knowledgeTemplateBase';
