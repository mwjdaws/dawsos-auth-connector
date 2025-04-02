
/**
 * Export all hooks for the MetadataPanel
 */

// Context hooks
export { useMetadataContext } from './useMetadataContext';
export { MetadataProvider } from './useMetadataContext';

// Panel management hooks
export { useMetadataPanel } from './useMetadataPanel';
export { usePanelContent } from './usePanelContent';

// Tag operations hooks
export * from './tag-operations';

// Ontology term hooks
export { useOntologyTerms } from './useOntologyTerms';

// Domain hooks
export { useDomain } from './useDomain';

// External source hooks
export { useSourceMetadata } from './useSourceMetadata';

// Edit mode hooks
export { useInlineMetadataEdit } from './useInlineMetadataEdit';

// Export types
export * from '../types';
