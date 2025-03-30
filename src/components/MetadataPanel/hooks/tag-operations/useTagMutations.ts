
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UseTagMutationsProps, Tag, TagPosition } from './types';
import { useToast } from '@/hooks/use-toast';

export function useTagMutations({ 
  contentId, 
  setTags,
  tags
}: UseTagMutationsProps) {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isDeletingTag, setIsDeletingTag] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const { toast } = useToast();
  
  // Add a tag
  const addTag = async ({ 
    name, 
    contentId: tagContentId, 
    typeId 
  }: { 
    name: string; 
    contentId: string; 
    typeId?: string 
  }): Promise<boolean> => {
    if (!name.trim()) return false;
    
    setIsAddingTag(true);
    
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert({
          name: name.trim(),
          content_id: tagContentId,
          type_id: typeId || null
        })
        .select('id, name, content_id, type_id')
        .single();
      
      if (error) {
        throw error;
      }
      
      // Add tag to state
      const newTag: Tag = {
        id: data.id,
        name: data.name,
        content_id: data.content_id || tagContentId, // Fallback to the provided contentId
        type_id: data.type_id
      };
      
      setTags(prev => [...prev, newTag]);
      
      toast({
        title: "Tag Added",
        description: `Tag "${name}" has been added successfully.`
      });
      
      return true;
    } catch (error) {
      console.error('Error adding tag:', error);
      
      toast({
        title: "Error Adding Tag",
        description: "Failed to add tag. Please try again.",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsAddingTag(false);
    }
  };
  
  // Delete a tag
  const deleteTag = async ({ 
    tagId, 
    contentId: tagContentId 
  }: { 
    tagId: string; 
    contentId: string 
  }): Promise<boolean> => {
    setIsDeletingTag(true);
    
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId)
        .eq('content_id', tagContentId);
      
      if (error) {
        throw error;
      }
      
      // Remove tag from state
      setTags(prev => prev.filter(tag => tag.id !== tagId));
      
      toast({
        title: "Tag Removed",
        description: "Tag has been removed successfully."
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting tag:', error);
      
      toast({
        title: "Error Removing Tag",
        description: "Failed to remove tag. Please try again.",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsDeletingTag(false);
    }
  };
  
  // Reorder tags
  const reorderTags = async (positions: TagPosition[]): Promise<boolean> => {
    setIsReordering(true);
    
    try {
      // For now, we just update the client state
      // In the future, this would update the order in the database
      
      // Sort the existing tags based on the new positions
      const reorderedTags = [...tags].sort((a, b) => {
        const posA = positions.find(p => p.id === a.id)?.position || 0;
        const posB = positions.find(p => p.id === b.id)?.position || 0;
        return posA - posB;
      });
      
      setTags(reorderedTags);
      
      toast({
        title: "Tags Reordered",
        description: "Tags have been reordered successfully."
      });
      
      return true;
    } catch (error) {
      console.error('Error reordering tags:', error);
      
      toast({
        title: "Error Reordering Tags",
        description: "Failed to reorder tags. Please try again.",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsReordering(false);
    }
  };
  
  return {
    addTag,
    deleteTag,
    reorderTags,
    isAddingTag,
    isDeletingTag,
    isReordering
  };
}
