
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, RefreshCcw, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { OntologyTerm } from '@/hooks/markdown-editor/ontology-terms/types';
import { useOntologyTerms } from '@/hooks/markdown-viewer/useOntologyTerms';
import { useTermMutations } from '@/hooks/markdown-viewer/useTermMutations';

interface OntologyTermsPanelProps {
  contentId: string;
}

export const OntologyTermsPanel: React.FC<OntologyTermsPanelProps> = ({ contentId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { terms, isLoading, error, handleRefresh } = useOntologyTerms({ contentId });
  const { addTerm, deleteTerm, isAdding, isDeleting } = useTermMutations({ contentId });

  const filteredTerms = terms.filter(term =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTerm = async (term: OntologyTerm) => {
    if (!contentId) {
      toast({
        title: "Error",
        description: "Content ID is missing",
        variant: "destructive",
      });
      return;
    }

    await addTerm(term.id, false);
  };

  const handleDeleteTerm = async (termId: string) => {
    if (!contentId) {
      toast({
        title: "Error",
        description: "Content ID is missing",
        variant: "destructive",
      });
      return;
    }

    await deleteTerm(termId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ontology Terms</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search terms..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error.message}</p>
        ) : filteredTerms.length === 0 ? (
          <p className="text-sm text-muted-foreground">No terms found.</p>
        ) : (
          <div className="space-y-2">
            {filteredTerms.map((term) => (
              <div key={term.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{term.term}</p>
                  <p className="text-xs text-muted-foreground">{term.domain}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteTerm(term.id)}
                  disabled={isDeleting}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button
          variant="secondary"
          className="w-full justify-center"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
