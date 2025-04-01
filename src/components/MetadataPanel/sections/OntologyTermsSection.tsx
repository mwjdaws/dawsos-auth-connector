
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, PlusCircle, X } from 'lucide-react';
import { OntologyTerm } from '../types';

interface OntologyTermsSectionProps {
  ontologyTerms: OntologyTerm[];
  contentId: string;
  editable: boolean;
  showDomain?: boolean;
  className?: string;
}

/**
 * OntologyTermsSection Component
 * 
 * Displays and manages ontology terms for a content item
 */
export function OntologyTermsSection({
  ontologyTerms,
  contentId,
  editable,
  showDomain = false,
  className = ''
}: OntologyTermsSectionProps) {
  // Group terms by domain if needed
  const groupedTerms = showDomain
    ? groupTermsByDomain(ontologyTerms)
    : { 'All Terms': ontologyTerms };
  
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-1.5">
          <Lightbulb className="h-4 w-4" />
          Ontology Terms
        </h3>
        
        {editable && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">
              {ontologyTerms.length} terms
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 p-0 px-1"
            >
              <PlusCircle className="h-3 w-3 mr-1" />
              <span className="text-xs">Add</span>
            </Button>
          </div>
        )}
      </div>
      
      {Object.entries(groupedTerms).map(([domain, terms]) => (
        <div key={domain} className="space-y-2">
          {showDomain && terms.length > 0 && (
            <h4 className="text-xs font-medium text-muted-foreground">
              {domain}
            </h4>
          )}
          
          <div className="flex flex-wrap gap-1.5">
            {terms.length > 0 ? (
              terms.map((term) => (
                <Badge
                  key={term.id}
                  variant="outline"
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50"
                >
                  {term.term}
                  {editable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => {/* Handle delete */}}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </Badge>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">
                <span>No ontology terms</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper function to group terms by domain
function groupTermsByDomain(terms: OntologyTerm[]): Record<string, OntologyTerm[]> {
  return terms.reduce<Record<string, OntologyTerm[]>>((groups, term) => {
    const domain = term.domain || 'Uncategorized';
    if (!groups[domain]) {
      groups[domain] = [];
    }
    groups[domain].push(term);
    return groups;
  }, {});
}
