
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, AlertTriangle } from 'lucide-react';
import { OntologyTerm } from '@/types/ontology';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AttachedTermsListProps {
  terms: OntologyTerm[];
  onRemoveTerm?: (termId: string, associationId?: string) => void;
  isEditable?: boolean;
}

export const AttachedTermsList: React.FC<AttachedTermsListProps> = ({
  terms,
  onRemoveTerm,
  isEditable = false
}) => {
  if (!terms || terms.length === 0) {
    return <p className="text-muted-foreground italic text-sm">No ontology terms attached</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {terms.map((term) => (
        <TooltipProvider key={term.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant={term.review_required ? "outline" : "default"} 
                className="flex items-center gap-1 px-2 py-1 max-w-[200px]"
              >
                {term.review_required && <AlertTriangle className="h-3 w-3 text-yellow-500" />}
                <span className="truncate">{term.term}</span>
                {isEditable && onRemoveTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                    onClick={() => onRemoveTerm(term.id, term.associationId)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove term</span>
                  </Button>
                )}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">{term.term}</p>
              <p className="text-sm">{term.description || 'No description available'}</p>
              {term.domain && <p className="text-xs mt-1">Domain: {term.domain}</p>}
              {term.review_required && (
                <p className="text-xs text-yellow-500 mt-1">This term requires review</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default AttachedTermsList;
