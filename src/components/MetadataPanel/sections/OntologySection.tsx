
import React, { useState, useEffect } from 'react';
import { useOntologyTerms } from '@/hooks/metadata/useOntologyTerms';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { OntologySuggestionsPanel } from './OntologySuggestionsPanel';
import { OntologyTerm } from '@/types/ontology';

export interface OntologySectionProps {
  sourceId: string;
  editable: boolean;
  onTermAdded?: () => void;
  onTermRemoved?: () => void;
}

export function OntologySection({
  sourceId,
  editable,
  onTermAdded,
  onTermRemoved
}: OntologySectionProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { terms, isLoading, error, handleAddTerm, handleRemoveTerm } = useOntologyTerms(sourceId);

  // Handle term changes
  useEffect(() => {
    if (onTermAdded || onTermRemoved) {
      // Future implementation: track changes and call callbacks
    }
  }, [terms, onTermAdded, onTermRemoved]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Ontology Terms</h3>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-28" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Ontology Terms</h3>
        <div className="text-sm text-destructive">
          Error loading ontology terms: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Ontology Terms</h3>
        {editable && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSuggestions(!showSuggestions)}
          >
            {showSuggestions ? 'Hide Suggestions' : 'Get Suggestions'}
          </Button>
        )}
      </div>

      {terms && terms.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {terms.map((term: OntologyTerm) => (
            <Badge
              key={term.id}
              variant="secondary"
              className="flex items-center gap-1 py-1"
            >
              {term.domain && (
                <span className="text-xs text-muted-foreground">{term.domain}:</span>
              )}
              <span>{term.term}</span>
              {editable && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-2"
                  onClick={() => handleRemoveTerm(term.id)}
                >
                  <span className="sr-only">Remove</span>
                  <span aria-hidden="true">×</span>
                </Button>
              )}
            </Badge>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground italic">
          No ontology terms associated with this content.
        </div>
      )}

      {showSuggestions && editable && (
        <OntologySuggestionsPanel
          sourceId={sourceId}
          onAddTerm={handleAddTerm}
        />
      )}
    </div>
  );
}
