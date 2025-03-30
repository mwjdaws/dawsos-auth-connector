
/**
 * Markdown editor types
 */
import { ReactNode } from 'react';

// Tag type
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string;
  type_name?: string;
}

// Tag position type (for reordering)
export interface TagPosition {
  id: string;
  position: number;
  name: string;
}

// Ontology term interface
export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain: string;
  review_required?: boolean;
}

// Related term interface
export interface RelatedTerm {
  id: string;
  term: string;
  description: string;
  domain: string;
  relation_type: string;
}

// Document operation result
export interface DocumentOperationResult {
  success: boolean;
  documentId?: string;
  message?: string;
  error?: Error | null;
}

// Document operations props
export interface DocumentOperationsProps {
  documentId: string | null;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
}

// Suggestion types for ontology enrichment
export interface OntologySuggestion {
  id: string;
  term: string;
  description?: string;
  domain?: string;
  score?: number;
  applied?: boolean;
  rejected?: boolean;
}

export interface RelatedNote {
  id: string;
  title: string;
  score?: number;
  applied?: boolean;
  rejected?: boolean;
}

export interface OntologySuggestions {
  terms: OntologySuggestion[];
  relatedNotes: RelatedNote[];
}

// Markdown editor props
export interface MarkdownEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialTemplateId?: string | null;
  initialExternalSourceUrl?: string;
  documentId?: string | null;
  sourceId?: string | null;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
}

// Tooltip content type for graph renderer
export type TooltipContent = ReactNode | string | null;

// Graph data types
export interface GraphNode {
  id: string;
  label: string;
  type: string;
  color?: string;
  domain?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  label?: string;
  type?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
