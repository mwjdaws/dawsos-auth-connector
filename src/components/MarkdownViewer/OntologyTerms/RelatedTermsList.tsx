
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RelatedTerm } from "@/hooks/markdown-editor/ontology-terms/types";

interface RelatedTermsListProps {
  terms: RelatedTerm[];
  editable: boolean;
  attachedTermIds: Set<string>;
  onAddTerm: (termId: string) => void;
}

export function RelatedTermsList({ terms, editable, attachedTermIds, onAddTerm }: RelatedTermsListProps) {
  if (terms.length === 0) {
    return null;
  }

  return (
    <>
      <Separator className="my-2" />
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground">Related Terms</h4>
        <div className="flex flex-wrap gap-2">
          {terms.map((term) => (
            <Badge 
              key={`${term.term_id}-${term.relation_type}`} 
              variant="outline"
              className="bg-slate-50 hover:bg-slate-100 cursor-pointer"
              onClick={() => editable && !attachedTermIds.has(term.term_id) && onAddTerm(term.term_id)}
            >
              {term.term}
              <span className="text-xs opacity-70 ml-1">
                ({term.relation_type})
              </span>
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
}
