
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook for managing links between knowledge sources
 */
export function useNoteLinks() {
  /**
   * Create a new link between two knowledge sources
   */
  const createNoteLink = useCallback(async (
    sourceId: string,
    targetId: string,
    linkType: 'wikilink' | 'manual' | 'AI-suggested'
  ) => {
    try {
      const { error } = await supabase
        .from('note_links')
        .insert({
          source_id: sourceId,
          target_id: targetId,
          link_type: linkType,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) {
        // Ignore unique constraint violations as these are expected
        // when the same link is processed multiple times
        if (error.code !== '23505') { // PostgreSQL unique violation code
          console.error('Error creating note link:', error);
          toast({
            title: 'Error creating link',
            description: error.message,
            variant: 'destructive'
          });
        }
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Unexpected error creating note link:', error);
      return false;
    }
  }, []);

  /**
   * Delete a link between two knowledge sources
   */
  const deleteNoteLink = useCallback(async (
    sourceId: string,
    targetId: string,
    linkType: 'wikilink' | 'manual' | 'AI-suggested'
  ) => {
    try {
      const { error } = await supabase
        .from('note_links')
        .delete()
        .match({
          source_id: sourceId,
          target_id: targetId,
          link_type: linkType
        });

      if (error) {
        console.error('Error deleting note link:', error);
        toast({
          title: 'Error deleting link',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Unexpected error deleting note link:', error);
      return false;
    }
  }, []);

  /**
   * Find knowledge sources that match the given title (for wikilinks)
   */
  const findSourcesByTitle = useCallback(async (title: string) => {
    try {
      const { data, error } = await supabase
        .from('knowledge_sources')
        .select('id, title')
        .ilike('title', title)
        .limit(5);

      if (error) {
        console.error('Error finding sources by title:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Unexpected error finding sources by title:', error);
      return [];
    }
  }, []);

  return {
    createNoteLink,
    deleteNoteLink,
    findSourcesByTitle
  };
}

/**
 * Hook for querying inbound and outbound links for a knowledge source
 */
export function useSourceLinks(sourceId?: string) {
  // Query for outbound links (links from this source to others)
  const outboundLinksQuery = useQuery({
    queryKey: ['noteLinks', 'outbound', sourceId],
    queryFn: async () => {
      if (!sourceId) return [];
      
      const { data, error } = await supabase
        .from('note_links')
        .select(`
          id, 
          link_type,
          target_id,
          knowledge_sources:target_id (id, title)
        `)
        .eq('source_id', sourceId);
        
      if (error) {
        console.error('Error fetching outbound links:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!sourceId
  });
  
  // Query for inbound links (links from other sources to this one)
  const inboundLinksQuery = useQuery({
    queryKey: ['noteLinks', 'inbound', sourceId],
    queryFn: async () => {
      if (!sourceId) return [];
      
      const { data, error } = await supabase
        .from('note_links')
        .select(`
          id, 
          link_type,
          source_id,
          knowledge_sources:source_id (id, title)
        `)
        .eq('target_id', sourceId);
        
      if (error) {
        console.error('Error fetching inbound links:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!sourceId
  });

  return {
    outboundLinks: outboundLinksQuery.data || [],
    inboundLinks: inboundLinksQuery.data || [],
    isLoading: outboundLinksQuery.isLoading || inboundLinksQuery.isLoading,
    error: outboundLinksQuery.error || inboundLinksQuery.error
  };
}
