
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface OntologySectionProps {
  sourceId: string;
  editable: boolean;
}

/**
 * Section for displaying and managing ontology terms
 */
export const OntologySection: React.FC<OntologySectionProps> = ({
  sourceId,
  editable
}) => {
  // Fetch ontology terms using React Query
  const { data: terms, isLoading } = useQuery({
    queryKey: ['ontologyTerms', sourceId],
    queryFn: async () => {
      // In a real implementation, this would be an API call
      return [
        { id: '1', term: 'Sample Term 1', domain: 'Test' },
        { id: '2', term: 'Sample Term 2', domain: 'Test' },
      ];
    },
    enabled: !!sourceId
  });
  
  if (isLoading) {
    return (
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Ontology Terms</h3>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }
  
  if (!terms || terms.length === 0) {
    return (
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Ontology Terms</h3>
        <p className="text-sm text-muted-foreground">No ontology terms associated</p>
      </div>
    );
  }
  
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Ontology Terms</h3>
      <div className="space-y-2">
        {terms.map((term) => (
          <div 
            key={term.id}
            className="flex justify-between items-center p-2 bg-secondary rounded-md"
          >
            <div>
              <p className="text-sm font-medium">{term.term}</p>
              {term.domain && (
                <p className="text-xs text-muted-foreground">{term.domain}</p>
              )}
            </div>
            {editable && (
              <button className="text-xs text-destructive">Remove</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
