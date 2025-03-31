
// Re-export all hook exports with proper naming
export { 
  useMetadataContext, 
  MetadataProvider, 
  type MetadataContextProps, 
  type MetadataProviderProps 
} from './useMetadataContext';

export { usePanelContent } from './usePanelContent';
export { usePanelState } from './usePanelState';
export { useMetadataPanel } from './useMetadataPanel';
export { useSourceMetadata } from './useSourceMetadata';
export { useInlineMetadataEdit } from './useInlineMetadataEdit';
export { useOntologyTerms } from './useOntologyTerms';
export { useExternalSource } from './useExternalSource';

// Re-export tag operation hooks 
export * from './tag-operations';
