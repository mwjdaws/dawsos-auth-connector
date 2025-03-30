
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryKeys } from '@/utils/query-keys';

interface RealtimeOptions {
  contentId?: string;
  enabled?: boolean;
}

/**
 * Hook to set up realtime updates for metadata, tags, and ontology terms
 */
export function useRealtimeUpdates({ contentId, enabled = true }: RealtimeOptions) {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    if (!enabled || !contentId) return;
    
    // Subscribe to tags changes
    const tagsChannel = supabase
      .channel('tags-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'tags',
          filter: `content_id=eq.${contentId}`
        },
        (payload) => {
          console.log('Tags changed:', payload);
          
          // Invalidate tags queries for this content
          queryClient.invalidateQueries({ 
            queryKey: queryKeys.tags.byContentId(contentId) 
          });
        }
      )
      .subscribe();
    
    // Subscribe to ontology term changes
    const ontologyChannel = supabase
      .channel('ontology-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'knowledge_source_ontology_terms',
          filter: `knowledge_source_id=eq.${contentId}`
        },
        (payload) => {
          console.log('Ontology terms changed:', payload);
          
          // Invalidate ontology terms queries for this content
          queryClient.invalidateQueries({ 
            queryKey: queryKeys.ontologyTerms.byContentId(contentId) 
          });
        }
      )
      .subscribe();
    
    // Subscribe to source metadata changes
    const metadataChannel = supabase
      .channel('metadata-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'knowledge_sources',
          filter: `id=eq.${contentId}`
        },
        (payload) => {
          console.log('Source metadata changed:', payload);
          
          // Invalidate metadata queries for this content
          queryClient.invalidateQueries({ 
            queryKey: queryKeys.metadata.byId(contentId) 
          });
        }
      )
      .subscribe();
    
    // Cleanup function to unsubscribe
    return () => {
      tagsChannel.unsubscribe();
      ontologyChannel.unsubscribe();
      metadataChannel.unsubscribe();
    };
  }, [contentId, enabled, queryClient]);
}
