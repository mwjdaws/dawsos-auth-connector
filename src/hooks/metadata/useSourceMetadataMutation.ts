
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryKeys } from '@/utils/query-keys';
import { toast } from '@/hooks/use-toast';

/**
 * Hook for updating source metadata
 */
export function useSourceMetadataMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      sourceId, 
      metadata 
    }: { 
      sourceId: string; 
      metadata: {
        title?: string;
        external_source_url?: string | null;
        needs_external_review?: boolean;
        template_id?: string | null;
      };
    }) => {
      const { data, error } = await supabase
        .from('knowledge_sources')
        .update(metadata)
        .eq('id', sourceId)
        .select();
      
      if (error) throw error;
      
      return data?.[0];
    },
    
    onSuccess: (_, variables) => {
      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.metadata.byId(variables.sourceId) 
      });
      
      toast({
        title: "Metadata Updated",
        description: "Source metadata has been updated successfully.",
      });
    },
    
    onError: (error: Error) => {
      toast({
        title: "Error Updating Metadata",
        description: error.message || "Failed to update source metadata",
        variant: "destructive",
      });
    },
  });
}
