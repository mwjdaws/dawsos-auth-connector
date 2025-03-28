
import { useState, useCallback, useTransition } from 'react';
import { useTagGenerationProcess } from './useTagGenerationProcess';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/error-handling';
import { toast } from '@/hooks/use-toast';

export function useTagGenerationCore() {
  const [contentId, setContentId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { isLoading, tags, setTags, generateTags } = useTagGenerationProcess();

  /**
   * Handle tag generation from content
   */
  const handleGenerateTags = useCallback(async (content: string): Promise<string | undefined> => {
    if (!content.trim()) {
      console.error('useTagGenerationCore: Empty content');
      toast({
        title: "Error",
        description: "Please provide content to generate tags",
        variant: "destructive"
      });
      return undefined;
    }

    try {
      // Generate a temporary or real content ID if needed
      let newContentId = contentId || `content-${Date.now()}`;
      console.log('useTagGenerationCore: Using contentId:', newContentId);
      
      // First generate tags from the content
      const generatedTags = await generateTags(content);
      
      if (!generatedTags || generatedTags.length === 0) {
        console.warn('useTagGenerationCore: No tags generated');
        toast({
          title: "Warning",
          description: "No tags could be generated from this content",
          variant: "destructive"
        });
        return undefined;
      }
      
      // Set the tags in the state
      setTags(generatedTags);
      
      try {
        // Create a simple content object in Supabase
        const { data: contentData, error: contentError } = await supabase
          .from('knowledge_sources')
          .upsert({
            id: newContentId,
            content: content.substring(0, 5000), // Limit content size
            title: `Generated from content at ${new Date().toLocaleString()}`
          })
          .select('id')
          .single();
        
        if (contentError) {
          console.error('useTagGenerationCore: Error saving content:', contentError);
          // We'll still return the ID so we can use it for tags
          toast({
            title: "Warning",
            description: "Content ID is temporary and won't be saved permanently",
            variant: "default"
          });
          return newContentId;
        }
        
        const finalContentId = contentData?.id || newContentId;
        console.log('useTagGenerationCore: Final contentId:', finalContentId);
        
        // Return the content ID for further operations
        return finalContentId;
      } catch (dbError) {
        console.error('useTagGenerationCore: Database error:', dbError);
        toast({
          title: "Warning",
          description: "Using temporary content ID for tag storage",
          variant: "default"
        });
        // Still return the contentId for tag usage
        return newContentId;
      }
    } catch (error) {
      console.error('useTagGenerationCore: Error in tag generation process:', error);
      handleError(
        error, 
        'Failed to generate tags',
        { level: 'error' }
      );
      return undefined;
    }
  }, [contentId, generateTags, setTags]);

  return {
    isLoading,
    isPending,
    contentId,
    setContentId,
    tags,
    setTags,
    handleGenerateTags,
    startTransition
  };
}
