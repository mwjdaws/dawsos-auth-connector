
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
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, RefreshCw, Search, Check } from "lucide-react";
import { useOntologyTerms } from '@/hooks/markdown-editor/useOntologyTerms';
import { useOntologyEnrichment } from '@/hooks/markdown-editor/useOntologyEnrichment';

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
  const { 
    suggestedTerms, 
    isLoading, 
    error,
    refreshSuggestions
  } = useOntologyEnrichment(contentId);

  // Filter terms based on search query
  const filteredTerms = suggestedTerms.filter(term => 
    term.term.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search terms or add new..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 pr-16"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-7"
            onClick={() => handleAddNewTerm(searchQuery)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-4/5" />
          <Skeleton className="h-8 w-2/3" />
        </div>
      ) : error ? (
        <Card className="p-3 bg-red-50 border-red-200 text-red-800">
          <p className="text-sm">Error loading suggestions. Please try refreshing.</p>
        </Card>
      ) : filteredTerms.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {filteredTerms.map((term) => (
            <div key={term.id} className="flex items-center">
              <Badge 
                variant="outline"
                className="bg-blue-50 text-blue-800 border-blue-200 flex items-center"
              >
                {term.term}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 ml-1"
                  onClick={() => handleAddTerm(term.id)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </Badge>
            </div>
          ))}
        </div>
      ) : suggestedTerms.length > 0 ? (
        <p className="text-sm text-muted-foreground">No terms match your search.</p>
      ) : (
        <Card className="p-3 bg-muted/20 border">
          <p className="text-sm text-muted-foreground text-center">
            No suggested terms available. Click Refresh to generate suggestions.
          </p>
        </Card>
      )}
    </div>
  );
};

export default OntologySuggestionsPanel;
