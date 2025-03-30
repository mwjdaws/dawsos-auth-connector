
/**
 * Operations for ontology term suggestions
 */
import { supabase } from '@/integrations/supabase/client';

interface TermOperationParams {
  termId: string;
  sourceId: string;
  userId: string;
}

interface NoteRelationParams {
  noteId: string;
  sourceId: string;
  userId: string;
}

/**
 * Apply a term suggestion by connecting it to the source
 */
export async function applyTermSuggestion({ 
  termId, 
  sourceId, 
  userId 
}: TermOperationParams): Promise<boolean> {
  if (!termId || !sourceId) return false;
  
  try {
    // First check if this connection already exists
    const { data: existing, error: checkError } = await supabase
      .from('knowledge_source_ontology_terms')
      .select('id')
      .eq('knowledge_source_id', sourceId)
      .eq('ontology_term_id', termId)
      .limit(1);
    
    if (checkError) throw new Error(checkError.message);
    
    // If it already exists, we're done
    if (existing && existing.length > 0) {
      return true;
    }
    
    // Create the connection
    const { error } = await supabase
      .from('knowledge_source_ontology_terms')
      .insert({
        knowledge_source_id: sourceId,
        ontology_term_id: termId,
        created_by: userId || null,
        review_required: false
      });
    
    if (error) throw new Error(error.message);
    
    return true;
  } catch (err) {
    console.error('Error applying term suggestion:', err);
    return false;
  }
}

/**
 * Reject a term suggestion by marking it as rejected
 */
export async function rejectTermSuggestion({ 
  termId, 
  sourceId, 
  userId 
}: TermOperationParams): Promise<boolean> {
  if (!termId || !sourceId) return false;
  
  try {
    // In a real implementation, we would store rejected suggestions
    // For now, just return success
    return true;
  } catch (err) {
    console.error('Error rejecting term suggestion:', err);
    return false;
  }
}

/**
 * Apply a note relationship suggestion by creating a link
 */
export async function applyNoteRelationship({ 
  noteId, 
  sourceId, 
  userId 
}: NoteRelationParams): Promise<boolean> {
  if (!noteId || !sourceId) return false;
  
  try {
    // First check if this link already exists
    const { data: existing, error: checkError } = await supabase
      .from('note_links')
      .select('id')
      .eq('source_id', sourceId)
      .eq('target_id', noteId)
      .limit(1);
    
    if (checkError) throw new Error(checkError.message);
    
    // If it already exists, we're done
    if (existing && existing.length > 0) {
      return true;
    }
    
    // Create the link
    const { error } = await supabase
      .from('note_links')
      .insert({
        source_id: sourceId,
        target_id: noteId,
        created_by: userId || null,
        link_type: 'AI-suggested'
      });
    
    if (error) throw new Error(error.message);
    
    return true;
  } catch (err) {
    console.error('Error applying note relationship:', err);
    return false;
  }
}

/**
 * Reject a note relationship suggestion
 */
export async function rejectNoteRelationship({ 
  noteId, 
  sourceId, 
  userId 
}: NoteRelationParams): Promise<boolean> {
  if (!noteId || !sourceId) return false;
  
  try {
    // In a real implementation, we would store rejected relationships
    // For now, just return success
    return true;
  } catch (err) {
    console.error('Error rejecting note relationship:', err);
    return false;
  }
}

/**
 * Apply multiple term suggestions at once
 */
export async function batchApplyTermSuggestions({
  sourceId,
  userId,
  termIds
}: {
  sourceId: string;
  userId: string;
  termIds: string[];
}): Promise<boolean> {
  if (!sourceId || !termIds.length) return false;
  
  try {
    // Create connections for each term
    const connections = termIds.map(termId => ({
      knowledge_source_id: sourceId,
      ontology_term_id: termId,
      created_by: userId || null,
      review_required: true
    }));
    
    const { error } = await supabase
      .from('knowledge_source_ontology_terms')
      .insert(connections);
    
    if (error) throw new Error(error.message);
    
    return true;
  } catch (err) {
    console.error('Error batch applying term suggestions:', err);
    return false;
  }
}
