
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { OntologyTermsPanel } from '@/components/MarkdownViewer/OntologyTermsPanel';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export interface OntologyTermsSectionProps {
  contentId: string;
  editable?: boolean;
  showCreateTerm?: boolean;
  onCreateTerm?: () => void;
  onMetadataChange?: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export function OntologyTermsSection({
  contentId,
  editable = false,
  showCreateTerm = false,
  onCreateTerm,
  onMetadataChange,
  isLoading = false,
  error = null
}: OntologyTermsSectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium mb-2">Ontology Terms</h3>
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-3/4" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div>
        <h3 className="text-sm font-medium mb-2">Ontology Terms</h3>
        <div className="text-sm text-destructive">{error.message}</div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Ontology Terms</h3>
        {editable && showCreateTerm && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-7 px-2"
            onClick={onCreateTerm}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        )}
      </div>
      
      <OntologyTermsPanel contentId={contentId} />
    </div>
  );
}
