
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Check, X, RefreshCw } from 'lucide-react';

export interface OntologySuggestionTerm {
  id: string;
  term: string;
  domain?: string;
  description?: string;
  score?: number;
  applied?: boolean;
  rejected?: boolean;
}

export interface OntologySuggestionsProps {
  sourceId: string;
  onAddTerm: (termId: string) => Promise<void>;
}

export function OntologySuggestionsPanel({ sourceId, onAddTerm }: OntologySuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<OntologySuggestionTerm[]>([]);
  const [error, setError] = useState<Error | null>(null);

  // Mock data for now - in a real implementation, this would fetch from an API
  useEffect(() => {
    const loadSuggestions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setSuggestions([
          { id: 'term1', term: 'Artificial Intelligence', domain: 'Technology', score: 95 },
          { id: 'term2', term: 'Neural Networks', domain: 'Technology', score: 88 },
          { id: 'term3', term: 'Machine Learning', domain: 'Technology', score: 92 },
          { id: 'term4', term: 'Natural Language Processing', domain: 'Technology', score: 85 }
        ]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error loading suggestions'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSuggestions();
  }, [sourceId]);

  const handleAddTerm = async (termId: string) => {
    try {
      await onAddTerm(termId);
      
      // Update local state
      setSuggestions(prevSuggestions => 
        prevSuggestions.map(s => 
          s.id === termId ? { ...s, applied: true, rejected: false } : s
        )
      );
    } catch (err) {
      console.error('Failed to add term:', err);
    }
  };

  const handleRejectTerm = (termId: string) => {
    setSuggestions(prevSuggestions => 
      prevSuggestions.map(s => 
        s.id === termId ? { ...s, rejected: true, applied: false } : s
      )
    );
  };

  const handleRefresh = () => {
    // In a real implementation, this would re-fetch suggestions
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const activeSuggestions = suggestions.filter(s => !s.applied && !s.rejected);
  const appliedSuggestions = suggestions.filter(s => s.applied);

  if (isLoading) {
    return (
      <div className="border rounded-md p-3 space-y-3 bg-gray-50">
        <div className="flex justify-between">
          <h4 className="text-sm font-medium">Suggested Terms</h4>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-36" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border rounded-md p-3 bg-red-50">
        <h4 className="text-sm font-medium text-red-600">Error Loading Suggestions</h4>
        <p className="text-sm text-red-500">{error.message}</p>
        <Button size="sm" variant="outline" className="mt-2" onClick={handleRefresh}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="border rounded-md p-3 space-y-3 bg-gray-50">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Suggested Terms</h4>
        <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {activeSuggestions.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No new suggestions available.</p>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {activeSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="flex items-center border rounded-md px-2 py-1 bg-white">
                <span className="text-sm mr-2">
                  {suggestion.domain && (
                    <span className="text-xs text-muted-foreground mr-1">{suggestion.domain}:</span>
                  )}
                  {suggestion.term}
                  {suggestion.score && (
                    <span className="text-xs text-muted-foreground ml-1">
                      ({Math.round(suggestion.score)}%)
                    </span>
                  )}
                </span>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleAddTerm(suggestion.id)}
                  >
                    <Check className="h-3 w-3 text-green-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleRejectTerm(suggestion.id)}
                  >
                    <X className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {activeSuggestions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                const highConfidenceTerms = activeSuggestions
                  .filter(s => (s.score || 0) > 85)
                  .map(s => s.id);
                
                if (highConfidenceTerms.length > 0) {
                  Promise.all(highConfidenceTerms.map(id => handleAddTerm(id)));
                }
              }}
            >
              Add All High-Confidence Terms
            </Button>
          )}
        </div>
      )}

      {appliedSuggestions.length > 0 && (
        <div>
          <h5 className="text-xs font-medium text-muted-foreground mb-2">Applied Terms</h5>
          <div className="flex flex-wrap gap-2">
            {appliedSuggestions.map(term => (
              <Badge key={term.id} variant="secondary">
                {term.domain && (
                  <span className="text-xs text-muted-foreground mr-1">{term.domain}:</span>
                )}
                {term.term}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
