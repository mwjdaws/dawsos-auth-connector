
// Re-export hooks 
export { useContentProcessor } from './useContentProcessor';
export { useMarkdownMetadata } from './useMarkdownMetadata';
export { useTagManagement } from './useTagManagement';
export { useOntologyTerms } from './useOntologyTerms';
export { useTermMutations } from './useTermMutations';

// Re-export types from markdown-editor for compatibility
export type { 
  OntologyTerm, 
  RelatedTerm, 
  OntologySuggestion, 
  RelatedNote, 
  OntologyDomain 
} from '../markdown-editor/types/ontology';

// Wikilinks processor
export { processWikilinks } from '@/components/MarkdownViewer/utils/wikilinksProcessor';
