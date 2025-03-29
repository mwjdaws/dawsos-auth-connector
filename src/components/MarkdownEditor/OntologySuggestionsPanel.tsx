
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Link, Tag, Loader2, Check, X } from 'lucide-react';
import { useOntologySuggestions } from '@/hooks/markdown-editor/useOntologySuggestions';

interface OntologySuggestionsPanelProps {
  content: string;
  title: string;
  sourceId?: string;
  onAnalyze?: () => void;
  onApplySuggestion?: () => void;
}

export function OntologySuggestionsPanel({
  content,
  title,
  sourceId,
  onAnalyze,
  onApplySuggestion
}: OntologySuggestionsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  
  const {
    suggestions,
    isLoading,
    analyzeContent,
    applySuggestedTerm,
    applySuggestedLink
  } = useOntologySuggestions();
  
  // When content changes significantly, collapse the panel
  useEffect(() => {
    setIsOpen(false);
    setAppliedIds(new Set());
  }, [content]);
  
  // Trigger analysis when the panel is opened
  const handleAnalyze = async () => {
    if (onAnalyze) onAnalyze();
    
    if (!isOpen) {
      setIsOpen(true);
      await analyzeContent(content, title, sourceId);
    } else {
      setIsOpen(false);
    }
  };
  
  // Apply a suggested ontology term
  const handleApplyTerm = async (termId: string) => {
    if (!sourceId) return;
    
    const success = await applySuggestedTerm(termId, sourceId);
    
    if (success) {
      setAppliedIds(prev => new Set([...prev, termId]));
      if (onApplySuggestion) onApplySuggestion();
    }
  };
  
  // Apply a suggested note link
  const handleApplyLink = async (noteId: string) => {
    if (!sourceId) return;
    
    const success = await applySuggestedLink(noteId, sourceId);
    
    if (success) {
      setAppliedIds(prev => new Set([...prev, noteId]));
      if (onApplySuggestion) onApplySuggestion();
    }
  };
  
  // Determine if we have any suggestions to show
  const hasSuggestions = 
    suggestions.terms.length > 0 || 
    suggestions.notes.length > 0;
  
  return (
    <div className="mt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleAnalyze} 
        className="w-full flex justify-between items-center"
        disabled={!content || content.length < 20 || isLoading}
      >
        <span className="flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Tag className="h-4 w-4" />
          )}
          {isOpen ? 'Hide Suggestions' : 'Analyze for Related Terms & Notes'}
        </span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
      
      {isOpen && (
        <Collapsible 
          open={isExpanded} 
          onOpenChange={setIsExpanded}
          className="mt-2 bg-muted/50 rounded-md p-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">
              {!hasSuggestions ? 'No suggestions found' : 'AI Suggestions'}
            </h3>
            {hasSuggestions && (
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-auto">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            )}
          </div>
          
          <CollapsibleContent className="mt-2 space-y-4">
            {suggestions.terms.length > 0 && (
              <Card className="p-3">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Suggested Ontology Terms
                </h4>
                <div className="flex flex-wrap gap-2">
                  {suggestions.terms.map((term) => {
                    const isApplied = appliedIds.has(term.id);
                    return (
                      <Badge 
                        key={term.id}
                        variant={isApplied ? "outline" : "secondary"}
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => !isApplied && handleApplyTerm(term.id)}
                      >
                        {term.term}
                        {isApplied ? (
                          <Check className="h-3 w-3 ml-1 text-green-500" />
                        ) : (
                          <span className="text-xs ml-1 opacity-70">
                            {Math.round(term.score)}%
                          </span>
                        )}
                      </Badge>
                    );
                  })}
                </div>
              </Card>
            )}
            
            {suggestions.notes.length > 0 && (
              <Card className="p-3">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  Suggested Related Notes
                </h4>
                <div className="space-y-2">
                  {suggestions.notes.map((note) => {
                    const isApplied = appliedIds.has(note.id);
                    return (
                      <div 
                        key={note.id}
                        className={`
                          flex justify-between items-center p-2 rounded
                          ${isApplied ? 'bg-green-100 dark:bg-green-900/20' : 'bg-muted'}
                        `}
                      >
                        <span className="text-sm truncate max-w-[240px]">
                          {note.title}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs opacity-70">
                            {Math.round(note.score)}%
                          </span>
                          {isApplied ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => handleApplyLink(note.id)}
                            >
                              <Link className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
            
            {!hasSuggestions && (
              <div className="text-sm text-muted-foreground">
                No relevant terms or notes found. Try adding more specific content to your document.
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
