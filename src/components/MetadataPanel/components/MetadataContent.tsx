
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useMetadataContext } from '../providers/MetadataQueryProvider';
import { TagsSection } from '../sections/TagsSection';

interface MetadataContentProps {
  showOntologyTerms?: boolean;
  showDomain?: boolean;
}

/**
 * MetadataContent Component
 * 
 * Displays metadata content including tags, external sources, and ontology terms
 */
export function MetadataContent({ 
  showOntologyTerms = true,
  showDomain = false
}: MetadataContentProps) {
  const {
    tags,
    ontologyTerms,
    sourceMetadata,
    isEditable,
    isLoading,
    error,
    refreshMetadata,
    handleDeleteTag
  } = useMetadataContext();
  
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load metadata. {error.message}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Tags Section */}
      <TagsSection
        tags={tags}
        contentId={tags.length > 0 ? tags[0].content_id : ''}
        editable={isEditable}
        newTag=""
        setNewTag={() => {}}
        onAddTag={async () => {}}
        onDeleteTag={handleDeleteTag}
      />
      
      {/* Placeholder for other sections */}
      {showOntologyTerms && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Ontology Terms</h3>
          <p className="text-xs text-muted-foreground">
            {ontologyTerms.length === 0 
              ? 'No ontology terms associated with this content.'
              : `${ontologyTerms.length} term(s) associated`}
          </p>
        </div>
      )}
      
      {showDomain && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Domain</h3>
          <p className="text-xs text-muted-foreground">
            No domain information available.
          </p>
        </div>
      )}
    </div>
  );
}
