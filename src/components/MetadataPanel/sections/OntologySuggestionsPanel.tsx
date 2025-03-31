
/**
 * OntologySuggestionsPanel Component
 * 
 * Provides an enrichment UI for AI-suggested ontology terms.
 * Used to display, review, and add AI-generated ontology term suggestions.
 * 
 * @example
 * ```tsx
 * <OntologySuggestionsPanel
 *   contentId="ks-123456"
 *   onTermsAdded={() => refresh()}
 * />
 * ```
 */
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, RefreshCw, Search } from "lucide-react";
import { useOntologyTerms } from '@/hooks/markdown-editor/useOntologyTerms';
import { useOntologySuggestions } from '@/hooks/markdown-editor/useOntologySuggestions';

interface OntologySuggestionsPanelProps {
  contentId: string;
  onTermsAdded?: () => void;
  className?: string;
}

export const OntologySuggestionsPanel: React.FC<OntologySuggestionsPanelProps> = ({
  contentId,
  onTermsAdded,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { addTerm, addTermByName } = useOntologyTerms(contentId);
  
  // Use the correct hook for suggestions with empty content
  const {
    suggestions,
    isLoading,
    analyzeContent
  } = useOntologySuggestions();

  // Get current content for the source
  useEffect(() => {
    if (contentId) {
      // We would normally fetch content here, for now just analyze with empty content
      analyzeContent("", "", contentId);
    }
  }, [contentId, analyzeContent]);

  // Filter terms based on search query
  const filteredTerms = suggestions.terms ? suggestions.terms.filter(term => 
    term.term.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  // Function to add a term
  const handleAddTerm = async (termId: string) => {
    await addTerm(termId);
    if (onTermsAdded) {
      onTermsAdded();
    }
  };

  // Function to add a new term by name
  const handleAddNewTerm = async (termName: string) => {
    await addTermByName(termName);
    setSearchQuery("");
    if (onTermsAdded) {
      onTermsAdded();
    }
  };

  // Function to refresh suggestions
  const refreshSuggestions = () => {
    analyzeContent("", "", contentId);
  };

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium">AI-Suggested Terms</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshSuggestions}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search or add new term..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => handleAddNewTerm(searchQuery)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      ) : filteredTerms.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {filteredTerms.map((term) => (
            <Badge
              key={term.id}
              variant="outline"
              className="cursor-pointer flex items-center gap-1 py-1"
              onClick={() => handleAddTerm(term.id)}
            >
              <Plus className="h-3 w-3" />
              {term.term}
            </Badge>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground text-sm py-3">
          {searchQuery
            ? "No matching terms found. Click 'Add' to create a new term."
            : "No suggested terms available. Try refreshing."}
        </div>
      )}
    </div>
  );
}
