
import React, { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Lightbulb, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { UseOntologySuggestionsResult } from '@/hooks/markdown-editor/types/ontology';
import { ensureString } from '@/utils/type-compatibility';

interface OntologySuggestionsPanelProps {
  content: string;
  title: string;
  sourceId: string;
  onApplySuggestion?: () => void;
}

export const OntologySuggestionsPanel: React.FC<OntologySuggestionsPanelProps> = ({ 
  content, 
  title, 
  sourceId,
  onApplySuggestion
}: OntologySuggestionsPanelProps) => {
  const [isPending, startTransition] = useTransition();
  const [isVisible, setIsVisible] = useState(false);
  
  // Mock implementation for development/testing
  const defaultSuggestions: UseOntologySuggestionsResult = {
    suggestions: {
      terms: [],
      relatedNotes: []
    },
    isLoading: false,
    error: null,
    refreshSuggestions: () => Promise.resolve(),
    applySuggestion: () => Promise.resolve(true),
    rejectSuggestion: () => Promise.resolve(true),
    applyNoteRelation: () => Promise.resolve(true),
    rejectNoteRelation: () => Promise.resolve(true),
    analyzeContent: (content: string, title: string, sourceId: string) => Promise.resolve(),
    applySuggestedTerm: () => Promise.resolve(true),
    rejectSuggestedTerm: () => Promise.resolve(true),
    applyAllSuggestedTerms: () => Promise.resolve(true)
  };
  
  // In a real implementation, you would use:
  // const { ... } = useOntologySuggestions();
  const {
    suggestions,
    isLoading,
    analyzeContent,
    applySuggestedTerm,
    rejectSuggestedTerm,
    applyAllSuggestedTerms
  } = defaultSuggestions;

  useEffect(() => {
    // Only load suggestions if panel is visible and content is substantial
    if (isVisible && content.length > 100 && sourceId) {
      startTransition(() => {
        analyzeContent(content, title, sourceId);
      });
    }
  }, [isVisible, content, title, sourceId, analyzeContent]);

  const handleApplyTerm = (termId: string) => {
    startTransition(() => {
      applySuggestedTerm(termId, sourceId).then(() => {
        if (onApplySuggestion) onApplySuggestion();
      });
    });
  };

  const handleRejectTerm = (termId: string) => {
    startTransition(() => {
      rejectSuggestedTerm(termId);
    });
  };

  const handleApplyAll = () => {
    if (!sourceId) return;
    
    startTransition(() => {
      applyAllSuggestedTerms(sourceId, 70).then(() => {
        if (onApplySuggestion) onApplySuggestion();
      });
    });
  };

  const handleRefresh = () => {
    if (!sourceId) return;
    
    startTransition(() => {
      analyzeContent(content, title, sourceId);
    });
  };

  if (!isVisible) {
    return (
      <Button 
        variant="outline" 
        className="mt-4 w-full" 
        onClick={() => setIsVisible(true)}
      >
        <Lightbulb className="mr-2 h-4 w-4" />
        Analyze for Ontology Terms
      </Button>
    );
  }

  return (
    <Card className="p-4 mt-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium">Suggested Ontology Terms</h3>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading || isPending}
          >
            <RefreshCw className={`h-4 w-4 ${(isLoading || isPending) ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsVisible(false)}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {(isLoading || isPending) ? (
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      ) : suggestions.terms.length === 0 ? (
        <p className="text-sm text-muted-foreground py-2">
          No term suggestions available. Try refreshing or modifying your content.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.terms
              .filter(term => !term.applied && !term.rejected)
              .map(term => (
                <div 
                  key={term.id} 
                  className="flex items-center gap-1 border rounded-lg px-2 py-1 text-sm"
                >
                  <span>
                    {term.domain && <span className="text-xs text-muted-foreground">{term.domain}:</span>}{' '}
                    {term.term}
                    {term.score && <span className="text-xs text-muted-foreground ml-1">({Math.round(term.score)}%)</span>}
                  </span>
                  <div className="flex">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5"
                      onClick={() => handleApplyTerm(term.id)}
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5"
                      onClick={() => handleRejectTerm(term.id)}
                    >
                      <XCircle className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>

          {suggestions.terms.filter(term => !term.applied && !term.rejected && (term.score || 0) >= 70).length > 1 && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleApplyAll}
            >
              Apply All High-Confidence Terms
            </Button>
          )}

          {suggestions.terms.filter(term => term.applied).length > 0 && (
            <div className="mt-3">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">Applied Terms</h4>
              <div className="flex flex-wrap gap-2">
                {suggestions.terms
                  .filter(term => term.applied)
                  .map(term => (
                    <Badge key={term.id} variant="secondary">
                      {term.domain && <span className="text-xs text-muted-foreground">{term.domain}:</span>}{' '}
                      {term.term}
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default OntologySuggestionsPanel;
