
/**
 * Document Types
 * 
 * Types related to document structure and content
 */

export interface DocumentMetadata {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  template?: string | null;
  external_source_url?: string | null;
}

export interface DocumentContent {
  id: string;
  content: string;
  versionId?: string;
}

export interface Document {
  metadata: DocumentMetadata;
  content: DocumentContent;
}

export interface DocumentValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  resultType: 'document';
}
