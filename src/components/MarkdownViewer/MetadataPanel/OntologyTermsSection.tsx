
import React from "react";
import { Badge } from "@/components/ui/badge";

interface OntologyTerm {
  id: string;
  term: string;
  description?: string;
}

interface OntologyTermsSectionProps {
  ontologyTerms: OntologyTerm[];
}

export function OntologyTermsSection({ ontologyTerms }: OntologyTermsSectionProps) {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Ontology Terms</h3>
      {ontologyTerms.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {ontologyTerms.map((term) => (
            <Badge 
              key={term.id} 
              variant="outline"
              className="bg-green-50"
            >
              {term.term}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No ontology terms available</p>
      )}
    </div>
  );
}
