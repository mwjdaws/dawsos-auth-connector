
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { OntologyTerm } from '@/types/ontology';

interface OntologySuggestionsPanelProps {
  sourceId: string;
  onAddTerm?: (termId: string) => void;
}

export function OntologySuggestionsPanel({ sourceId, onAddTerm }: OntologySuggestionsPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<OntologyTerm[]>([]);

  const handleGenerateSuggestions = () => {
    setIsLoading(true);
    // In a real implementation, this would fetch suggestions from an API
    setTimeout(() => {
      setIsLoading(false);
      // For now, we're just simulating an empty result
      setSuggestions([]);
    }, 1500);
  };

  const handleAddTerm = (termId: string) => {
    if (onAddTerm) {
      onAddTerm(termId);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-4 border rounded-md p-3 bg-muted/50">
        <h4 className="text-sm font-medium mb-2">Suggested Terms</h4>
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 border rounded-md p-3 bg-muted/50">
      <h4 className="text-sm font-medium mb-2">Suggested Terms</h4>
      <p className="text-sm text-muted-foreground mb-4">
        No suggestions available for this content at the moment.
      </p>
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full"
        onClick={handleGenerateSuggestions}
      >
        Generate Suggestions
      </Button>
    </div>
  );
}
