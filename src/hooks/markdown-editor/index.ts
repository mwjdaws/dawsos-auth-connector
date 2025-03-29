// Re-export hooks and types
export { useMarkdownEditor } from './useMarkdownEditor';
export { useAutosave } from './useAutosave';
export { useContentProcessor } from './useContentProcessor';
export { useContentState } from './useContentState';
export { useContentLoader } from './useContentLoader';
export { useDocumentVersioning } from './useDocumentVersioning';
export { useOntologySuggestions } from './useOntologySuggestions';
export { useTemplateHandling } from './useTemplateHandling';
export { useWikiLinks } from './useWikiLinks';
export { useNoteLinks } from './useNoteLinks';
export { useKnowledgeSources } from './useKnowledgeSources';
export { useDocumentOperations } from './useDocumentOperations';
export { useDocumentOperationHandlers } from './useDocumentOperationHandlers';

// Re-export types
export type { DocumentOperationsProps } from './types';

// Re-export ontology terms related hooks and types
export { useOntologyTerms } from './useOntologyTerms';
export { useTermMutations } from './ontology-terms/useTermMutations';
export type { OntologyTerm, RelatedTerm } from './ontology-terms/types';
export { useOntologyEnrichment } from './useOntologyEnrichment';

// Re-export ontology enrichment related hooks and types
export type { 
  OntologySuggestion, 
  RelatedNote, 
  EnrichmentResult, 
  EnrichmentOptions,
  EnrichmentMetadata 
} from './ontology-enrichment/types';

// Re-export draft operations
export { useDraftOperations } from './useDraftOperations';
export { usePublishOperations } from './usePublishOperations';
