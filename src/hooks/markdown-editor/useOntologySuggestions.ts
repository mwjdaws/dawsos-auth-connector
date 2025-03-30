
/**
 * Hook for managing ontology suggestions
 */
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OntologySuggestion, RelatedNote, UseOntologySuggestionsResult } from './types/ontology';
import { useAuth } from '@/hooks/useAuth';
import { 
  applyTermSuggestion, 
  rejectTermSuggestion,
  applyNoteRelationship,
  rejectNoteRelationship
} from './ontology-suggestions/termOperations';

interface UseOntologySuggestionsProps {
  sourceId: string;
  content?: string;
}

export function useOntologySuggestions({ 
  sourceId, 
  content 
}: UseOntologySuggestionsProps): UseOntologySuggestionsResult {
  const [suggestions, setSuggestions] = useState<OntologySuggestion[]>([]);
  const [relatedNotes, setRelatedNotes] = useState<RelatedNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const refreshSuggestions = useCallback(async () => {
    if (!sourceId || !content) {
      setSuggestions([]);
      setRelatedNotes([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // This would typically call the suggest-ontology-terms edge function
      // For now, we'll simulate it with a placeholder
      
      // Example placeholder data
      const mockSuggestions: OntologySuggestion[] = [
        {
          id: 'suggestion-1',
          term: 'Example Term',
          description: 'This is an example suggested term',
          domain: 'Example Domain',
          score: 0.85,
          applied: false,
          rejected: false
        }
      ];
      
      const mockRelatedNotes: RelatedNote[] = [
        {
          id: 'note-1',
          title: 'Related Note Example',
          score: 0.75,
          applied: false,
          rejected: false
        }
      ];

      setSuggestions(mockSuggestions);
      setRelatedNotes(mockRelatedNotes);

    } catch (err: any) {
      console.error('Error fetching ontology suggestions:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [sourceId, content]);

  const handleApplySuggestion = async (termId: string): Promise<boolean> => {
    try {
      setError(null);
      const result = await applyTermSuggestion({
        termId,
        sourceId,
        userId: user?.id || ''
      });
      
      if (result) {
        setSuggestions(prev => 
          prev.map(s => s.id === termId 
            ? { ...s, applied: true, rejected: false } 
            : s
          )
        );
      }
      
      return result;
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    }
  };

  const handleRejectSuggestion = async (termId: string): Promise<boolean> => {
    try {
      setError(null);
      const result = await rejectTermSuggestion({
        termId,
        sourceId,
        userId: user?.id || ''
      });
      
      if (result) {
        setSuggestions(prev => 
          prev.map(s => s.id === termId 
            ? { ...s, rejected: true, applied: false } 
            : s
          )
        );
      }
      
      return result;
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    }
  };

  const handleApplyNoteRelation = async (noteId: string): Promise<boolean> => {
    try {
      setError(null);
      const result = await applyNoteRelationship({
        noteId,
        sourceId,
        userId: user?.id || ''
      });
      
      if (result) {
        setRelatedNotes(prev => 
          prev.map(n => n.id === noteId 
            ? { ...n, applied: true, rejected: false } 
            : n
          )
        );
      }
      
      return result;
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    }
  };

  const handleRejectNoteRelation = async (noteId: string): Promise<boolean> => {
    try {
      setError(null);
      const result = await rejectNoteRelationship({
        noteId,
        sourceId,
        userId: user?.id || ''
      });
      
      if (result) {
        setRelatedNotes(prev => 
          prev.map(n => n.id === noteId 
            ? { ...n, rejected: true, applied: false } 
            : n
          )
        );
      }
      
      return result;
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    }
  };

  return {
    suggestions,
    relatedNotes,
    isLoading,
    error,
    refreshSuggestions,
    applySuggestion: handleApplySuggestion,
    rejectSuggestion: handleRejectSuggestion,
    applyNoteRelation: handleApplyNoteRelation,
    rejectNoteRelation: handleRejectNoteRelation
  };
}

export default useOntologySuggestions;
