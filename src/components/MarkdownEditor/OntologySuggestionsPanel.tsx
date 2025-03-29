
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOntologySuggestions } from '@/hooks/markdown-editor/useOntologySuggestions';
import { Lightbulb, Tag, FileText, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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
}) => {
  const {
    suggestions,
    isLoading,
    analyzeContent,
    applySuggestedTerm,
    applySuggestedLink
  } = useOntologySuggestions();
  
  const [activeTab, setActiveTab] = useState<string>('terms');
  const [analyzedContent, setAnalyzedContent] = useState<string>('');
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(false);
  
  // Check if content is different from what was analyzed
  const contentChanged = analyzedContent !== content;
  
  // Analyze content initially and when it changes significantly
  useEffect(() => {
    const shouldAnalyze = 
      !hasAnalyzed || 
      (content.length > 100 && Math.abs(content.length - analyzedContent.length) > 50);
    
    if (sourceId && shouldAnalyze && content.trim().length > 20) {
      performAnalysis();
    }
  }, [sourceId, content, hasAnalyzed]);
  
  const performAnalysis = async () => {
    await analyzeContent(content, title, sourceId);
    setAnalyzedContent(content);
    setHasAnalyzed(true);
  };
  
  const handleApplyTerm = async (termId: string) => {
    const success = await applySuggestedTerm(termId, sourceId);
    if (success && onApplySuggestion) {
      onApplySuggestion();
    }
  };
  
  const handleApplyLink = async (targetId: string) => {
    const success = await applySuggestedLink(targetId, sourceId);
    if (success && onApplySuggestion) {
      onApplySuggestion();
    }
  };
  
  // Don't render if there's not enough content to analyze
  if (content.trim().length < 20) {
    return null;
  }
  
  // Show analysis prompt if content has changed significantly
  if (hasAnalyzed && contentChanged) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <Lightbulb className="h-4 w-4 mr-2" /> Content Changed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <CardDescription className="text-xs">
              The content has changed. Would you like to analyze again for new suggestions?
            </CardDescription>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={performAnalysis}
              disabled={isLoading}
              className="ml-2"
            >
              {isLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : "Analyze"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center">
          <Lightbulb className="h-4 w-4 mr-2" /> Content Analysis
        </CardTitle>
        <CardDescription className="text-xs">
          Suggested terms and related documents based on content
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="terms" className="text-xs flex items-center">
                  <Tag className="h-3 w-3 mr-1" /> Terms ({suggestions.terms.length})
                </TabsTrigger>
                <TabsTrigger value="notes" className="text-xs flex items-center">
                  <FileText className="h-3 w-3 mr-1" /> Notes ({suggestions.notes.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="terms" className="mt-0">
                {suggestions.terms.length > 0 ? (
                  <div className="grid gap-2">
                    {suggestions.terms.map(term => (
                      <div key={term.id} className="flex justify-between items-center p-2 bg-muted/50 rounded text-xs">
                        <div className="flex flex-col">
                          <span className="font-medium">{term.term}</span>
                          <span className="text-muted-foreground text-[10px]">{term.description || 'No description'}</span>
                          {term.domain && <Badge variant="outline" className="text-[9px] px-1 py-0 mt-1 h-4 w-fit">{term.domain}</Badge>}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-[10px]"
                          onClick={() => handleApplyTerm(term.id)}
                        >
                          Apply
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center p-2">
                    No ontology term suggestions found
                  </p>
                )}
              </TabsContent>
              
              <TabsContent value="notes" className="mt-0">
                {suggestions.notes.length > 0 ? (
                  <div className="grid gap-2">
                    {suggestions.notes.map(note => (
                      <div key={note.id} className="flex justify-between items-center p-2 bg-muted/50 rounded text-xs">
                        <div className="flex flex-col">
                          <span className="font-medium">{note.title}</span>
                          {note.score && <span className="text-muted-foreground text-[10px]">Relevance: {Math.round(note.score)}%</span>}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-[10px]"
                          onClick={() => handleApplyLink(note.id)}
                        >
                          Link
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center p-2">
                    No related note suggestions found
                  </p>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end mt-2">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={performAnalysis}
                className="h-7 text-xs"
                disabled={isLoading}
              >
                {isLoading ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1" /> Refresh
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
