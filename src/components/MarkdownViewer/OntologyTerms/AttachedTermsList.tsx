
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { OntologyTerm } from "@/hooks/markdown-editor/types";

interface AttachedTermsListProps {
  terms: OntologyTerm[];
  editable: boolean;
  onRemoveTerm: (associationId: string) => void;
}

export function AttachedTermsList({ terms, editable, onRemoveTerm }: AttachedTermsListProps) {
  if (terms.length === 0) {
    return <p className="text-sm text-muted-foreground">No ontology terms attached</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {terms.map((term) => (
        <Badge 
          key={term.associationId || term.id} 
          variant="secondary"
          className="flex items-center gap-1 group"
        >
          {term.domain && (
            <span className="text-xs opacity-70">{term.domain}:</span>
          )}
          {term.term}
          {editable && term.associationId && (
            <button 
              onClick={() => onRemoveTerm(term.associationId!)}
              className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-1"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </Badge>
      ))}
    </div>
  );
}
