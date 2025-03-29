
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/error-handling';
import { toast } from '@/hooks/use-toast';
import { RelatedNote } from './types';

/**
 * Apply a suggested link by creating a relationship between documents
 */
export const applySuggestedLink = async (
  targetId: string, 
  sourceId: string,
  notes: RelatedNote[]
): Promise<{ success: boolean; updatedNotes: RelatedNote[] }> => {
  try {
    // Check if this note is already applied
    const updatedNotes = [...notes];
    const noteIndex = updatedNotes.findIndex(note => note.id === targetId);
    
    if (noteIndex === -1) {
      console.warn(`Note ${targetId} not found in suggestions`);
      return { success: false, updatedNotes };
    }
    
    // If already applied, do nothing
    if (updatedNotes[noteIndex].applied) {
      return { success: true, updatedNotes };
    }
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    
    // Create relationship in database
    const { error } = await supabase
      .from('note_links')
      .insert({
        source_id: sourceId,
        target_id: targetId,
        created_by: userId,
        link_type: 'related'
      });
    
    if (error) {
      if (error.code === '23505') {
        // Ignore unique constraint violations
        console.log('Link already exists between these documents');
      } else {
        console.error('Error applying note link:', error);
        throw error;
      }
    }
    
    // Update UI state
    updatedNotes[noteIndex] = {
      ...updatedNotes[noteIndex],
      applied: true,
      rejected: false
    };
    
    toast({
      title: 'Link Applied',
      description: `Added link to "${updatedNotes[noteIndex].title}"`,
    });
    
    return { success: true, updatedNotes };
  } catch (error) {
    handleError(
      error,
      "Failed to apply note link suggestion",
      { level: "warning", technical: true }
    );
    return { success: false, updatedNotes: notes };
  }
};

/**
 * Reject a suggested link by marking it as rejected in the UI only
 */
export const rejectSuggestedLink = (
  noteId: string,
  notes: RelatedNote[]
): { success: boolean; updatedNotes: RelatedNote[] } => {
  const updatedNotes = [...notes];
  const noteIndex = updatedNotes.findIndex(note => note.id === noteId);
  
  if (noteIndex === -1) {
    return { success: false, updatedNotes };
  }
  
  updatedNotes[noteIndex] = {
    ...updatedNotes[noteIndex],
    rejected: true,
    applied: false
  };
  
  return { success: true, updatedNotes };
};
