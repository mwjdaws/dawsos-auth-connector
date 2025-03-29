
import React, { useState, useTransition } from 'react';
import { OntologyTerm, useOntologyTerms, useTermMutations } from '@/hooks/markdown-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, X, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface OntologyTermsPanelProps {
  sourceId?: string;
  editable?: boolean;
}

export function OntologyTermsPanel({ sourceId, editable = false }: OntologyTermsPanelProps) {
  const [isPending, startTransition] = useTransition();
  const [newTerm, setNewTerm] = useState('');
  const { sourceTerms: terms, relatedTerms, isLoading } = useOntologyTerms(sourceId);
  const { addTermByName, removeTerm, isAdding, isRemoving } = useTermMutations(sourceId);

  const handleAddTerm = () => {
    if (!newTerm.trim() || !sourceId) return;
    
    startTransition(() => {
      addTermByName(newTerm).then(() => {
        setNewTerm('');
      });
    });
  };

  const handleRemoveTerm = (termAssociationId: string) => {
    if (!sourceId) return;
    
    startTransition(() => {
      removeTerm(termAssociationId);
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium mb-2">Ontology Terms</h3>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium mb-2">Ontology Terms</h3>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {terms.length === 0 ? (
          <p className="text-sm text-muted-foreground">No ontology terms</p>
        ) : (
          terms.map((term) => (
            <Badge 
              key={term.associationId} 
              variant="secondary"
              className="flex items-center gap-1"
            >
              {term.domain && <span className="text-xs text-muted-foreground">{term.domain}:</span>}{' '}
              {term.term}
              {editable && (
                <button
                  onClick={() => handleRemoveTerm(term.associationId!)}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                  disabled={isRemoving}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))
        )}
        {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>
      
      {editable && (
        <div className="flex gap-2 items-center">
          <Input
            value={newTerm}
            onChange={(e) => setNewTerm(e.target.value)}
            placeholder="Add ontology term..."
            className="text-sm h-8"
            onKeyDown={(e) => e.key === 'Enter' && handleAddTerm()}
          />
          <Button 
            size="sm"
            variant="ghost"
            disabled={!newTerm.trim() || isAdding}
            onClick={handleAddTerm}
          >
            {isAdding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
      
      {relatedTerms.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Related Terms</h4>
          <div className="flex flex-wrap gap-2">
            {relatedTerms.map((term) => (
              <Badge 
                key={term.term_id} 
                variant="outline"
                className="text-xs"
              >
                {term.domain && <span className="text-xs text-muted-foreground">{term.domain}:</span>}{' '}
                {term.term}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
