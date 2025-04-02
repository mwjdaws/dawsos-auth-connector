
/**
 * Type compatibility utilities for handling nullable fields
 * and ensuring type safety across the application
 */

import { Tag } from '@/types/tag';
import { OntologyTerm } from '@/types/ontology';

/**
 * Ensures a tag object has all required properties with proper types
 */
export function sanitizeTag(tag: Partial<Tag> | null | undefined): Tag {
  if (!tag) {
    return {
      id: '',
      name: '',
      content_id: '',
      type_id: null,
      display_order: 0,
      type_name: ''
    };
  }
  
  return {
    id: tag.id || '',
    name: tag.name || '',
    content_id: tag.content_id || '',
    type_id: tag.type_id || null,
    display_order: typeof tag.display_order === 'number' ? tag.display_order : 0,
    type_name: tag.type_name || ''
  };
}

/**
 * Ensures an OntologyTerm object has all required properties with proper types
 */
export function sanitizeOntologyTerm(term: Partial<OntologyTerm> | null | undefined): OntologyTerm {
  if (!term) {
    return {
      id: '',
      term: '',
      description: '',
      domain: null,
      review_required: false
    };
  }
  
  return {
    id: term.id || '',
    term: term.term || '',
    description: term.description || '',
    domain: term.domain || null,
    review_required: typeof term.review_required === 'boolean' ? term.review_required : false,
    associationId: term.associationId
  };
}

/**
 * Type-safe string conversion
 */
export function ensureString(value: any, defaultValue = ''): string {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return String(value);
}

/**
 * Type-safe number conversion
 */
export function ensureNumber(value: any, defaultValue = 0): number {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Type-safe boolean conversion
 */
export function ensureBoolean(value: any, defaultValue = false): boolean {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return Boolean(value);
}

/**
 * Type-safe array conversion
 */
export function ensureArray<T>(value: T[] | null | undefined, defaultValue: T[] = []): T[] {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  if (!Array.isArray(value)) {
    return defaultValue;
  }
  return value;
}

/**
 * Converts null to undefined
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Converts undefined to null
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Safe function execution
 */
export function safeFunction<T extends (...args: any[]) => any>(
  fn: T | undefined | null,
  defaultReturn?: ReturnType<T>
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    if (typeof fn === 'function') {
      return fn(...args);
    }
    return defaultReturn as ReturnType<T>;
  };
}
