
import { supabase } from "@/integrations/supabase/client";
import { isValidContentId } from "@/utils/content-validation";
import { toast } from "@/hooks/use-toast";

/**
 * Type for a tag in the system
 */
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string | null;
}

/**
 * Type for ontology term data
 */
export interface OntologyTerm {
  id: string;
  term: string;
  description?: string | null;
  domain?: string | null;
  review_required?: boolean;
}

/**
 * Type for source metadata
 */
export interface SourceMetadata {
  id: string;
  title: string;
  content: string;
  external_source_url?: string | null;
  external_source_checked_at?: string | null;
  needs_external_review?: boolean;
  template_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetches tags for a specific content
 */
export async function fetchContentTags(contentId: string): Promise<Tag[]> {
  if (!contentId || !isValidContentId(contentId)) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('content_id', contentId);
    
  if (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
  
  return data || [];
}

/**
 * Adds a new tag to content
 */
export async function addTag(contentId: string, name: string, typeId?: string): Promise<Tag> {
  if (!contentId || !isValidContentId(contentId) || !name.trim()) {
    throw new Error('Invalid content ID or tag name');
  }
  
  // Check for existing tag with same name
  const { data: existingTags, error: checkError } = await supabase
    .from('tags')
    .select('id')
    .eq('name', name.trim().toLowerCase())
    .eq('content_id', contentId);
    
  if (checkError) throw checkError;
  
  if (existingTags && existingTags.length > 0) {
    throw new Error('Tag already exists for this content');
  }
  
  // Insert new tag
  const { data, error } = await supabase
    .from('tags')
    .insert({
      name: name.trim().toLowerCase(),
      content_id: contentId,
      type_id: typeId || null
    })
    .select();
    
  if (error) throw error;
  
  if (!data || data.length === 0) {
    throw new Error('Failed to create tag');
  }
  
  return data[0];
}

/**
 * Deletes a tag by ID
 */
export async function deleteTag(tagId: string): Promise<void> {
  if (!tagId) {
    throw new Error('Invalid tag ID');
  }
  
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', tagId);
    
  if (error) throw error;
}

/**
 * Fetches ontology terms for a specific content
 */
export async function fetchContentOntologyTerms(contentId: string): Promise<OntologyTerm[]> {
  if (!contentId || !isValidContentId(contentId)) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('knowledge_source_ontology_terms')
    .select(`
      id,
      ontology_term_id,
      review_required,
      ontology_terms:ontology_term_id (
        id,
        term,
        description,
        domain
      )
    `)
    .eq('knowledge_source_id', contentId);
    
  if (error) {
    console.error('Error fetching ontology terms:', error);
    throw error;
  }
  
  // Transform the data to a simpler structure
  return (data || []).map(item => ({
    id: item.id,
    term_id: item.ontology_term_id,
    term: item.ontology_terms.term,
    description: item.ontology_terms.description,
    domain: item.ontology_terms.domain,
    review_required: item.review_required
  }));
}

/**
 * Fetches source metadata for content
 */
export async function fetchSourceMetadata(contentId: string): Promise<SourceMetadata | null> {
  if (!contentId || !isValidContentId(contentId)) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('knowledge_sources')
    .select('*')
    .eq('id', contentId)
    .maybeSingle();
    
  if (error) {
    console.error('Error fetching source metadata:', error);
    throw error;
  }
  
  return data;
}

/**
 * Verifies if content exists in the database
 */
export async function checkContentExists(contentId: string): Promise<boolean> {
  if (!contentId || !isValidContentId(contentId)) {
    return false;
  }
  
  try {
    const { data, error } = await supabase
      .from('knowledge_sources')
      .select('id')
      .eq('id', contentId)
      .maybeSingle();
      
    if (error) {
      console.error('Error checking content existence:', error);
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error('Exception checking content existence:', err);
    return false;
  }
}
