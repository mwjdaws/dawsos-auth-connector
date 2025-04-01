
// Re-export the OntologyTerm type for components to use
export * from './types';

// Main editor hooks
export * from './useMarkdownEditor';
export * from './ontology-terms/types';
export * from './ontology-enrichment/useOntologyEnrichment';
export * from './ontology-suggestions/useOntologySuggestions';

// Document operations
export * from './useDocumentOperations';
export * from './draft-operations/useDraftOperations';
export * from './publish-operations/usePublishOperations';

// Version control
export * from './versioning/useVersionControl';
export * from './versioning/useVersionCreation';
export * from './versioning/useVersionFetching';
export * from './versioning/useVersionRestoration';
