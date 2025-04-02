
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag, X, Plus, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { OntologyTerm } from '@/types/ontology';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface OntologyTermsSectionProps {
  contentId: string;
  ontologyTerms: OntologyTerm[];
  editable: boolean;
  isLoading?: boolean;
  error?: Error | null;
  showCreateTerm?: boolean;
  onAddTerm?: (term: string) => Promise<void>;
  onRemoveTerm?: (termId: string) => Promise<void>;
}

export function OntologyTermsSection({
  contentId,
  ontologyTerms,
  editable,
  isLoading = false,
  error = null,
  showCreateTerm = false,
  onAddTerm,
  onRemoveTerm
}: OntologyTermsSectionProps) {
  const [newTerm, setNewTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [showTermInput, setShowTermInput] = useState(showCreateTerm);

  const handleNewTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTerm(e.target.value);
  };

  const handleAddTerm = async () => {
    if (!newTerm.trim() || !onAddTerm) return;

    setIsAdding(true);
    try {
      await onAddTerm(newTerm.trim());
      setNewTerm('');
      setShowTermInput(false);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveTerm = async (termId: string) => {
    if (!onRemoveTerm) return;

    setIsRemoving(termId);
    try {
      await onRemoveTerm(termId);
    } finally {
      setIsRemoving(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTerm();
    } else if (e.key === 'Escape') {
      setShowTermInput(false);
      setNewTerm('');
    }
  };

  if (isLoading) {
    return (
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Ontology Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Ontology Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              {error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const hasTerms = ontologyTerms && ontologyTerms.length > 0;

  // Group terms by domain for better organization
  const termsByDomain: Record<string, OntologyTerm[]> = {};
  if (hasTerms) {
    ontologyTerms.forEach(term => {
      const domain = term.domain || 'Uncategorized';
      if (!termsByDomain[domain]) {
        termsByDomain[domain] = [];
      }
      termsByDomain[domain].push(term);
    });
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Ontology Terms</CardTitle>
      </CardHeader>
      <CardContent>
        {hasTerms ? (
          <div className="space-y-4">
            {Object.entries(termsByDomain).map(([domain, terms]) => (
              <div key={domain} className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground">{domain}</h4>
                <div className="flex flex-wrap gap-2">
                  {terms.map(term => (
                    <Badge key={term.id} variant="secondary" className="gap-1">
                      <Tag className="h-3 w-3 mr-1" />
                      {term.term}
                      {editable && onRemoveTerm && (
                        <button
                          onClick={() => handleRemoveTerm(term.id)}
                          className="ml-1 hover:text-destructive"
                          disabled={!!isRemoving}
                        >
                          {isRemoving === term.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            No ontology terms associated with this content
          </div>
        )}

        {editable && !showTermInput && onAddTerm && (
          <Button
            size="sm"
            variant="outline"
            className="mt-4"
            onClick={() => setShowTermInput(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Term
          </Button>
        )}

        {editable && showTermInput && onAddTerm && (
          <div className="mt-4 space-y-2">
            <Input
              placeholder="Enter ontology term"
              value={newTerm}
              onChange={handleNewTermChange}
              onKeyDown={handleKeyDown}
              disabled={isAdding}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAddTerm}
                disabled={isAdding || !newTerm.trim()}
              >
                {isAdding && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Add
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowTermInput(false);
                  setNewTerm('');
                }}
                disabled={isAdding}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
