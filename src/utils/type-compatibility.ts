
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
 * Safely converts a value that could be null/undefined to a string
 */
export function safeString(value: string | null | undefined): string {
  return value || '';
}

/**
 * Safely converts a value that could be null/undefined to a number
 */
export function safeNumber(value: number | null | undefined, defaultValue = 0): number {
  return typeof value === 'number' ? value : defaultValue;
}

/**
 * Safely converts a value that could be null/undefined to a boolean
 */
export function safeBoolean(value: boolean | null | undefined, defaultValue = false): boolean {
  return typeof value === 'boolean' ? value : defaultValue;
}

/**
 * Safely converts a value that could be null/undefined to an array
 */
export function safeArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

/**
 * Safely handles functions that could be undefined
 */
export function safeFunction<T extends (...args: any[]) => any>(
  fn: T | undefined,
  defaultReturn?: ReturnType<T>
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    if (typeof fn === 'function') {
      return fn(...args);
    }
    return defaultReturn as ReturnType<T>;
  };
}
