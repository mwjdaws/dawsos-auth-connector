
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { OntologyTerm } from "@/utils/api-utils";
import { useQueryClient, useMutation } from "@tanstack/react-query"; 
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { queryKeys } from "@/utils/query-keys";

interface OntologySectionProps {
  sourceId: string;
  terms?: OntologyTerm[];
  editable?: boolean;
  className?: string;
}

export const OntologySection: React.FC<OntologySectionProps> = ({
  sourceId,
  terms = [],
  editable = false,
  className
}) => {
  const [newTerm, setNewTerm] = useState("");
  const queryClient = useQueryClient();
  
  // Add term mutation
  const addTermMutation = useMutation({
    mutationFn: async (termName: string) => {
      if (!termName.trim()) throw new Error("Term name is required");
      
      // Check if term already exists
      const { data: existingTerms, error: searchError } = await supabase
        .from('ontology_terms')
        .select('id, term')
        .ilike('term', termName.trim());
        
      if (searchError) throw searchError;
      
      let termId;
      
      // If term exists, use it, otherwise create a new one
      if (existingTerms && existingTerms.length > 0) {
        termId = existingTerms[0].id;
      } else {
        // Create new ontology term
        const { data: newTermData, error: createError } = await supabase
          .from('ontology_terms')
          .insert({ term: termName.trim() })
          .select();
          
        if (createError) throw createError;
        termId = newTermData?.[0]?.id;
      }
      
      if (!termId) throw new Error("Failed to create or find term");
      
      // Associate term with knowledge source
      const { data, error } = await supabase
        .from('knowledge_source_ontology_terms')
        .insert({
          knowledge_source_id: sourceId,
          ontology_term_id: termId,
          review_required: false
        })
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
        `);
        
      if (error) {
        // Check if it's a unique constraint violation (term already associated)
        if (error.code === '23505') {
          throw new Error("This term is already associated with this content");
        }
        throw error;
      }
      
      return data?.[0];
    },
    onSuccess: () => {
      setNewTerm("");
      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: queryKeys.ontologyTerms.byContentId(sourceId) });
      toast({
        title: "Term Added",
        description: "Ontology term has been added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Adding Term",
        description: error.message || "Failed to add ontology term",
        variant: "destructive",
      });
    }
  });
  
  // Remove term mutation
  const removeTermMutation = useMutation({
    mutationFn: async (associationId: string) => {
      const { error } = await supabase
        .from('knowledge_source_ontology_terms')
        .delete()
        .eq('id', associationId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: queryKeys.ontologyTerms.byContentId(sourceId) });
      toast({
        title: "Term Removed",
        description: "Ontology term has been removed successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Removing Term",
        description: error.message || "Failed to remove ontology term",
        variant: "destructive",
      });
    }
  });
  
  const handleAddTerm = () => {
    if (!newTerm.trim()) return;
    addTermMutation.mutate(newTerm);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTerm.trim()) {
      e.preventDefault();
      handleAddTerm();
    }
  };
  
  const handleRemoveTerm = (associationId: string) => {
    removeTermMutation.mutate(associationId);
  };

  return (
    <div className={className}>
      <h3 className="text-sm font-medium mb-2">Ontology Terms</h3>
      
      {editable && (
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Add ontology term..."
            value={newTerm}
            onChange={(e) => setNewTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            disabled={addTermMutation.isPending}
          />
          
          <Button 
            size="sm" 
            onClick={handleAddTerm}
            disabled={!newTerm.trim() || addTermMutation.isPending}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      )}
      
      {terms.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {terms.map((term) => (
            <Badge 
              key={term.id} 
              variant={term.review_required ? "outline" : "secondary"}
              className={`flex items-center gap-1 ${term.review_required ? 'border-yellow-400' : ''}`}
            >
              {term.term}
              {editable && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemoveTerm(term.id)}
                  disabled={removeTermMutation.isPending}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No ontology terms</p>
      )}
    </div>
  );
};

export default OntologySection;
