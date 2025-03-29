
/**
 * MetadataPanel Component System
 * 
 * This package provides a complete system for displaying and editing content metadata.
 * It includes a main MetadataPanel component, modular section components, and hooks
 * for accessing metadata state and operations.
 * 
 * The system is designed to be:
 * - Modular: Section components can be used independently
 * - Type-safe: Comprehensive TypeScript interfaces
 * - Consistent: Unified styling and behavior across the application
 * - Extensible: Easy to add new sections or customize existing ones
 * 
 * @example
 * ```tsx
 * // Using the main component
 * import MetadataPanel from "@/components/MetadataPanel";
 * 
 * <MetadataPanel contentId="content-123" />
 * 
 * // Using individual sections
 * import { TagsSection } from "@/components/MetadataPanel";
 * 
 * <TagsSection tags={tags} editable={true} />
 * 
 * // Accessing metadata context outside the component
 * import { useMetadataContext } from "@/components/MetadataPanel";
 * 
 * const metadata = useMetadataContext(contentId);
 * ```
 */

// Export the default component
export { default } from './MetadataPanel';

// Export all sections
export * from './sections';

// Export the hooks
export { useMetadataPanel, useMetadataContext } from './hooks';

// Export types
export * from './types';
