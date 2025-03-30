
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errors';

interface UseInlineMetadataEditProps {
  contentId: string;
  onMetadataChange?: () => void;
}

export function useInlineMetadataEdit({ contentId, onMetadataChange }: UseInlineMetadataEditProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Updates the external source URL for a knowledge source
   */
  const updateExternalSourceUrl = useCallback(async (newUrl: string) => {
    if (!contentId) return;
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('knowledge_sources')
        .update({ 
          external_source_url: newUrl,
          needs_external_review: Boolean(newUrl)
        })
        .eq('id', contentId);
        
      if (error) throw error;
      
      // Notify parent component that metadata has changed
      if (onMetadataChange) {
        onMetadataChange();
      }
      
      // Show success toast
      toast({
        title: "Source updated",
        description: "External source URL has been updated successfully",
      });
      
    } catch (error) {
      handleError(error, "Failed to update external source URL", {
        level: "error",
        context: { contentId, newUrl }
      });
      throw error; // Re-throw to allow the inline edit component to handle the error state
    } finally {
      setIsUpdating(false);
    }
  }, [contentId, onMetadataChange]);

  /**
   * Updates a field in the knowledge source
   */
  const updateMetadataField = useCallback(async (field: string, value: any) => {
    if (!contentId || !field) return;
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('knowledge_sources')
        .update({ [field]: value })
        .eq('id', contentId);
        
      if (error) throw error;
      
      // Notify parent component that metadata has changed
      if (onMetadataChange) {
        onMetadataChange();
      }
      
      // Show success toast
      toast({
        title: "Field updated",
        description: `The ${field} has been updated successfully`,
      });
      
    } catch (error) {
      handleError(error, `Failed to update ${field}`, {
        level: "error",
        context: { contentId, field, value }
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [contentId, onMetadataChange]);

  return {
    updateExternalSourceUrl,
    updateMetadataField,
    isUpdating
  };
}
