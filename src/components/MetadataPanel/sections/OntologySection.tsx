
/**
 * OntologySection Component
 * 
 * Displays and manages ontology terms associated with a content source.
 * Provides UI for viewing, approving, and rejecting ontology terms.
 * 
 * @example
 * ```tsx
 * <OntologySection
 *   sourceId="ks-123456"
 *   editable={true}
 * />
 * ```
 */
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Plus } from "lucide-react";
import { useOntologyTerms } from '@/hooks/markdown-editor/useOntologyTerms';

interface OntologySectionProps {
  sourceId: string;
  editable?: boolean;
  className?: string;
}

// Define a local interface that extends OntologyTerm with review_required
interface SourceOntologyTerm {
  associationId: string;
  id: string;
  term: string;
  description?: string;
  domain?: string;
  review_required?: boolean;
}

export const OntologySection: React.FC<OntologySectionProps> = ({
  sourceId,
  editable = false,
  className
}) => {
  const {
    sourceTerms,
    relatedTerms,
    isLoading,
    addTerm,
    removeTerm
  } = useOntologyTerms(sourceId);

  // Cast sourceTerms to the local interface that includes review_required
  const typedSourceTerms = sourceTerms as SourceOntologyTerm[];

  // Organize terms by review status
  const reviewRequired = typedSourceTerms.filter(term => term.review_required);
  const approvedTerms = typedSourceTerms.filter(term => !term.review_required);

  return (
    <div className={className}>
      <h3 className="text-sm font-medium mb-2">Ontology Terms</h3>
      
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading terms...</p>
      ) : (
        <div className="space-y-4">
          {reviewRequired.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-amber-600">Needs Review</h4>
              <div className="flex flex-wrap gap-2">
                {reviewRequired.map((term) => (
                  <div key={term.id} className="flex items-center gap-1">
                    <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                      {term.term}
                    </Badge>
                    
                    {editable && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-green-500 hover:text-green-700 hover:bg-green-50"
                          onClick={() => {
                            // Approve term logic (would need to be implemented)
                            console.log("Approve term:", term.id);
                          }}
                          title="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeTerm(term.associationId)}
                          title="Remove"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {approvedTerms.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-green-600">Approved</h4>
              <div className="flex flex-wrap gap-2">
                {approvedTerms.map((term) => (
                  <Badge 
                    key={term.id}
                    variant="outline"
                    className="bg-green-50 text-green-800 border-green-200"
                  >
                    {term.term}
                    {editable && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                        onClick={() => removeTerm(term.associationId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {sourceTerms.length === 0 && (
            <p className="text-sm text-muted-foreground">No ontology terms attached</p>
          )}
          
          {relatedTerms.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">Related Terms</h4>
              <div className="flex flex-wrap gap-2">
                {relatedTerms.map((term) => (
                  <div key={term.term_id} className="flex items-center gap-1">
                    <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                      {term.term}
                    </Badge>
                    
                    {editable && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => addTerm(term.term_id)}
                        title="Add to this source"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OntologySection;
