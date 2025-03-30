
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalSourceSection } from '../ExternalSourceSection';
import { TagsSection } from '../TagsSection';
import { HeaderSection } from '../HeaderSection';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SourceMetadata, Tag } from '../types';

interface MetadataContentProps {
  data: SourceMetadata | null;
  contentId: string;
  error: any;
  tags: Tag[];
  editable: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: (typeId?: string | null) => Promise<void>;
  onDeleteTag: (tagId: string) => Promise<void>;
  onRefresh: () => void;
  externalSourceUrl: string | null;
  lastCheckedAt: string | null;
  needsExternalReview: boolean;
  onMetadataChange?: () => void;
  showOntologyTerms?: boolean;
  className?: string;
}

// Error state component
interface ErrorStateProps {
  error: Error;
  title: string;
  retry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, title, retry }) => (
  <Alert variant="destructive" className="mb-4">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription>
      {error.message || 'An unexpected error occurred'}
      {retry && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={retry} 
          className="ml-2 h-7 px-2 text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1" /> Retry
        </Button>
      )}
    </AlertDescription>
  </Alert>
);

export const MetadataContent: React.FC<MetadataContentProps> = ({
  data,
  contentId,
  error,
  tags,
  editable,
  newTag,
  setNewTag,
  onAddTag,
  onDeleteTag,
  onRefresh,
  externalSourceUrl,
  lastCheckedAt,
  needsExternalReview,
  onMetadataChange,
  showOntologyTerms = true,
  className = ""
}) => {
  return (
    <Card className={className}>
      <HeaderSection 
        needsExternalReview={needsExternalReview}
        handleRefresh={onRefresh}
        isLoading={false}
      />
      
      <CardContent className="py-2">
        {error && (
          <ErrorState
            error={error instanceof Error ? error : new Error(String(error))}
            title="Error fetching metadata"
            retry={onRefresh}
          />
        )}
        
        {externalSourceUrl && (
          <ExternalSourceSection
            contentId={contentId}
            externalSourceUrl={externalSourceUrl}
            lastCheckedAt={lastCheckedAt}
            editable={editable}
            onMetadataChange={onMetadataChange}
          />
        )}
        
        <TagsSection
          tags={tags}
          contentId={contentId}
          editable={editable}
          newTag={newTag}
          setNewTag={setNewTag}
          onAddTag={onAddTag}
          onDeleteTag={onDeleteTag}
          onMetadataChange={onMetadataChange}
          className="mt-4"
        />
        
        {showOntologyTerms && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Ontology Terms</h3>
            <p className="text-sm text-muted-foreground">
              No ontology terms attached to this content
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
