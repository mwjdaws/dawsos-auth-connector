
/**
 * Markdown editor hooks bundle
 * 
 * This file re-exports all hooks related to the markdown editor
 * to provide a cleaner import experience.
 */

// Main hooks
export { useMarkdownEditor } from "./useMarkdownEditor";
export { useDocumentOperations } from "./useDocumentOperations";
export { useDocumentOperationHandlers } from "./useDocumentOperationHandlers";
export { useDocumentVersioning } from "./useDocumentVersioning";
export { useTemplateApplication } from "./useTemplateApplication";
export { useContentProcessor } from "./useContentProcessor";
export { useOntologyEnrichment } from "./useOntologyEnrichment";

// Type exports
export type { Tag, TagPosition } from "@/components/MetadataPanel/hooks/tag-operations/types";
export type { DocumentOperationsProps, DocumentOperationResult } from "./types";
