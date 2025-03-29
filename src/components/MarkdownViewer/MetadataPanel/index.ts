
/**
 * @deprecated Use the unified components from '@/components/MetadataPanel' instead.
 * These re-exports exist for backward compatibility and will be removed in a future version.
 */

// Re-export the MetadataPanel component
export { default as MetadataPanel } from '@/components/MetadataPanel';

// Re-export all sections from the unified location
export {
  HeaderSection,
  ExternalSourceSection,
  TagsSection,
  ContentIdSection,
  DomainSection,
  OntologyTermsSection,
  LoadingState
} from '@/components/MetadataPanel/sections';

// For backward compatibility, maintain existing named exports
export { HeaderSection as CollapsibleHeader } from '@/components/MetadataPanel/sections';
