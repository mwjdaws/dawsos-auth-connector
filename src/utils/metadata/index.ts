
/**
 * Central metadata utilities for the application
 */
import { getEnrichmentMetadata } from './enrichmentMetadata';
import { isContentEmpty, extractContentMetadata } from './contentMetadata';
import { transformTagData, filterDuplicateTags } from './tagUtils';

// Re-export all metadata utilities
export {
  // Enrichment metadata
  getEnrichmentMetadata,
  
  // Content metadata
  isContentEmpty,
  extractContentMetadata,
  
  // Tag utilities
  transformTagData,
  filterDuplicateTags
};
