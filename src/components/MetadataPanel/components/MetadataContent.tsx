
import React from 'react';
import { useMetadataContext } from '../hooks/useMetadataContext';
import { ExternalSourceSection } from '../sections/ExternalSourceSection';
import { TagsSection } from '../sections/TagsSection';
import { OntologyTermsSection } from '../sections/OntologyTermsSection';
import { DomainSection } from '../sections/DomainSection';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface MetadataContentProps {
  showOntologyTerms?: boolean;
  showDomain?: boolean;
}

export const MetadataContent: React.FC<MetadataContentProps> = ({
  showOntologyTerms = true,
  showDomain = false
}) => {
  const {
    contentId,
    tags,
    ontologyTerms = [],
    externalSource,
    domain,
    isEditable,
    isLoading,
    error
  } = useMetadataContext();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error.message || 'Failed to load metadata'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <ExternalSourceSection 
        contentId={contentId}
        externalSource={{
          external_source_url: externalSource?.external_source_url || null,
          needs_external_review: externalSource?.needs_external_review || false,
          external_source_checked_at: externalSource?.external_source_checked_at || null
        }}
        editable={isEditable}
      />
      
      <TagsSection 
        tags={tags || []}
        contentId={contentId}
        editable={isEditable}
      />
      
      {showOntologyTerms && (
        <OntologyTermsSection 
          contentId={contentId}
          ontologyTerms={ontologyTerms}
          editable={isEditable}
        />
      )}
      
      {showDomain && domain !== undefined && (
        <DomainSection 
          domain={domain}
        />
      )}
    </div>
  );
};
