
/**
 * MetadataPanel Sections
 * 
 * This file exports all of the individual section components that make up the MetadataPanel.
 * Each section is responsible for displaying and managing a specific aspect of content metadata.
 * 
 * These components can be used independently or as part of the unified MetadataPanel.
 */

export { HeaderSection } from './HeaderSection';
export { ExternalSourceSection } from './ExternalSourceSection';
export { TagsSection } from './TagsSection';
export { OntologySection } from './OntologySection';
export { OntologyTermsSection } from './OntologyTermsSection';
export { ContentIdSection } from './ContentIdSection';
export { LoadingState } from './LoadingState';
export { DomainSection } from './DomainSection';
export { OntologySuggestionsPanel } from './OntologySuggestionsPanel';

// Aliases for backward compatibility
export { HeaderSection as CollapsibleHeader } from './HeaderSection';
