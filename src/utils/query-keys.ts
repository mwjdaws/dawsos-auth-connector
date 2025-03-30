
/**
 * Query key factory for React Query
 * 
 * This module provides a centralized way to define query keys for React Query
 * to ensure consistency and avoid typos or mismatches across the application.
 * 
 * Query keys are structured as arrays to support nested invalidation patterns.
 */

export const queryKeys = {
  metadata: {
    all: ['metadata'] as const,
    byId: (id: string) => [...queryKeys.metadata.all, id] as const,
    source: (id: string) => [...queryKeys.metadata.all, 'source', id] as const,
  },
  
  tags: {
    all: ['tags'] as const,
    byContentId: (contentId: string) => [...queryKeys.tags.all, 'content', contentId] as const,
    byType: (typeId: string) => [...queryKeys.tags.all, 'type', typeId] as const,
    summary: ['tags', 'summary'] as const,
  },
  
  ontologyTerms: {
    all: ['ontologyTerms'] as const,
    byContentId: (contentId: string) => [...queryKeys.ontologyTerms.all, 'content', contentId] as const,
    byDomain: (domain: string) => [...queryKeys.ontologyTerms.all, 'domain', domain] as const,
    related: (id: string) => [...queryKeys.ontologyTerms.all, 'related', id] as const,
  },
  
  templates: {
    all: ['templates'] as const,
    byId: (id: string) => [...queryKeys.templates.all, id] as const,
  },
  
  knowledgeSources: {
    all: ['knowledgeSources'] as const,
    byId: (id: string) => [...queryKeys.knowledgeSources.all, id] as const,
    versions: (id: string) => [...queryKeys.knowledgeSources.all, id, 'versions'] as const,
    exists: (id: string) => [...queryKeys.knowledgeSources.all, 'exists', id] as const,
  },
  
  relationships: {
    all: ['relationships'] as const,
    bySourceId: (id: string) => [...queryKeys.relationships.all, 'source', id] as const,
    byTermId: (id: string) => [...queryKeys.relationships.all, 'term', id] as const,
    graph: (id: string) => [...queryKeys.relationships.all, 'graph', id] as const,
  },
};
