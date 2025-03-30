
// This file is re-exporting template functionality for backward compatibility
// To avoid circular dependencies, we're directly importing and re-exporting specific functions
import { 
  fetchKnowledgeTemplates, 
  fetchKnowledgeTemplateById 
} from './templates/knowledgeTemplateFetchers';

import { 
  createKnowledgeTemplate, 
  updateKnowledgeTemplate, 
  deleteKnowledgeTemplate, 
  duplicateKnowledgeTemplate 
} from './templates/knowledgeTemplateMutators';

import * as applications from './templates/knowledgeTemplateApplications';
import * as base from './templates/knowledgeTemplateBase';

// Re-export everything individually
export { 
  fetchKnowledgeTemplates, 
  fetchKnowledgeTemplateById,
  createKnowledgeTemplate, 
  updateKnowledgeTemplate, 
  deleteKnowledgeTemplate, 
  duplicateKnowledgeTemplate 
};

// Re-export namespaces
export * from './templates/knowledgeTemplateApplications';
export * from './templates/knowledgeTemplateBase';
