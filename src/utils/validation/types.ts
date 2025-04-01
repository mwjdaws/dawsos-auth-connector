
/**
 * Validation Result Types
 */

// Basic validation result interface
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  resultType: string;
}

// Content ID validation result
export interface ContentIdValidationResult extends ValidationResult {
  contentExists: boolean;
  resultType: "contentId";
}

// Tag validation result
export interface TagValidationResult extends ValidationResult {
  resultType: "tag";
}

// Ontology term validation result
export interface OntologyTermValidationResult extends ValidationResult {
  resultType: "ontologyTerm";
}

// Document validation result
export interface DocumentValidationResult extends ValidationResult {
  resultType: "document";
}

// Factory functions to create validation results with proper typing
export function createValidResult(resultType: string = "generic"): ValidationResult {
  return {
    isValid: true,
    errorMessage: null,
    resultType
  };
}

export function createInvalidResult(errorMessage: string, resultType: string = "generic"): ValidationResult {
  return {
    isValid: false,
    errorMessage,
    resultType
  };
}

export function createContentIdValidationResult(
  isValid: boolean,
  contentExists: boolean = false,
  errorMessage: string | null = null
): ContentIdValidationResult {
  return {
    isValid,
    contentExists,
    errorMessage,
    resultType: "contentId"
  };
}

export function createTagValidationResult(
  isValid: boolean,
  errorMessage: string | null = null
): TagValidationResult {
  return {
    isValid,
    errorMessage,
    resultType: "tag"
  };
}

export function createOntologyTermValidationResult(
  isValid: boolean,
  errorMessage: string | null = null
): OntologyTermValidationResult {
  return {
    isValid,
    errorMessage,
    resultType: "ontologyTerm"
  };
}

export function createDocumentValidationResult(
  isValid: boolean,
  errorMessage: string | null = null
): DocumentValidationResult {
  return {
    isValid,
    errorMessage,
    resultType: "document"
  };
}
