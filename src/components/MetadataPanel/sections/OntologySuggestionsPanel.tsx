
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, X, Plus } from 'lucide-react';
import { handleError } from '@/utils/errors/handle';

export interface OntologySuggestion {
  id: string;
  term: string;
  score: number;
  applied: boolean;
  rejected: boolean;
}

export interface OntologySuggestionsResult {
  terms: OntologySuggestion[];
  relatedNotes: any[];
}

export interface UseOntologySuggestionsProps {
  contentId: string;
  limit?: number;
}

// Simplified hook for demonstration
const useOntologySuggestions = ({ contentId }: UseOntologySuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<OntologySuggestionsResult>({
    terms: [],
    relatedNotes: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleAccept = async (suggestionId: string) => {
    // Implement accept logic
    console.log("Accepting suggestion", suggestionId);
  };

  const handleReject = async (suggestionId: string) => {
    // Implement reject logic
    console.log("Rejecting suggestion", suggestionId);
  };

  return {
    suggestions,
    isLoading,
    error,
    handleAccept,
    handleReject
  };
};

interface OntologySuggestionsPanelProps {
  contentId: string;
  showTitle?: boolean;
}

export function OntologySuggestionsPanel({ 
  contentId, 
  showTitle = true 
}: OntologySuggestionsPanelProps) {
  const { 
    suggestions, 
    isLoading,
    error,
    handleAccept,
    handleReject
  } = useOntologySuggestions({ contentId });

  const [searchQuery, setSearchQuery] = useState("");

  // Filter suggestions based on search query
  const filteredSuggestions = suggestions.terms.filter(s => 
    s.term.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          {showTitle && <h3 className="text-sm font-medium mb-3">Suggested Ontology Terms</h3>}
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          {showTitle && <h3 className="text-sm font-medium mb-3">Suggested Ontology Terms</h3>}
          <div className="text-sm text-destructive">{error.message}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        {showTitle && <h3 className="text-sm font-medium mb-3">Suggested Ontology Terms</h3>}
        
        {filteredSuggestions.length === 0 && (
          <p className="text-sm text-muted-foreground">No ontology term suggestions available.</p>
        )}
        
        {filteredSuggestions.length > 0 && (
          <div className="space-y-2">
            {filteredSuggestions.map(suggestion => (
              <div key={suggestion.id} className="flex items-center justify-between p-2 border rounded-md">
                <div>
                  <p className="text-sm font-medium">{suggestion.term}</p>
                  <p className="text-xs text-muted-foreground">Score: {suggestion.score.toFixed(2)}</p>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-7 w-7 p-0"
                    onClick={() => handleAccept(suggestion.id)}
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-7 w-7 p-0"
                    onClick={() => handleReject(suggestion.id)}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
