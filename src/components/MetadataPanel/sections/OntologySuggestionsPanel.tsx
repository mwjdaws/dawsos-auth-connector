
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { useOntologySuggestions } from "@/hooks/markdown-editor/useOntologySuggestions";
import { OntologySuggestion } from "@/hooks/markdown-editor/types/ontology-suggestions";

interface OntologySuggestionsPanelProps {
  contentId: string;
  onApplySuggestion?: (termId: string) => void;
}

export const OntologySuggestionsPanel: React.FC<OntologySuggestionsPanelProps> = ({
  contentId,
  onApplySuggestion
}) => {
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const [rejectedSuggestions, setRejectedSuggestions] = useState<Set<string>>(new Set());

  // Fetch suggestions
  const { suggestions, isLoading, error, refreshSuggestions } = useOntologySuggestions(contentId);

  const handleApplySuggestion = (suggestion: OntologySuggestion) => {
    setAppliedSuggestions(prev => {
      const newSet = new Set(prev);
      newSet.add(suggestion.id);
      return newSet;
    });
    
    if (onApplySuggestion) {
      onApplySuggestion(suggestion.id);
    }
  };

  const handleRejectSuggestion = (suggestionId: string) => {
    setRejectedSuggestions(prev => {
      const newSet = new Set(prev);
      newSet.add(suggestionId);
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">Loading suggestions...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <p className="text-sm text-destructive">Error loading suggestions</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={() => refreshSuggestions && refreshSuggestions()}
        >
          Retry
        </Button>
      </Card>
    );
  }

  const availableSuggestions = suggestions?.filter(
    s => !appliedSuggestions.has(s.id) && !rejectedSuggestions.has(s.id)
  ) || [];

  if (availableSuggestions.length === 0) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">No suggestions available</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-sm font-medium mb-2">Suggested Ontology Terms</h3>
      <div className="space-y-2">
        {availableSuggestions.map((suggestion) => (
          <div key={suggestion.id} className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className="px-2 py-1 bg-background/50"
            >
              {suggestion.term}
              {suggestion.domain && (
                <span className="ml-1 text-xs text-muted-foreground">
                  ({suggestion.domain})
                </span>
              )}
            </Badge>
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-green-500 hover:text-green-600 hover:bg-green-50"
                onClick={() => handleApplySuggestion(suggestion)}
                aria-label={`Apply ${suggestion.term}`}
              >
                <Check size={14} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                onClick={() => handleRejectSuggestion(suggestion.id)}
                aria-label={`Reject ${suggestion.term}`}
              >
                <X size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
