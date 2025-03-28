
import { useState, useEffect } from 'react';
import { TagPill } from './TagPill';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TagListProps {
  tags: string[];
  isLoading: boolean;
  knowledgeSourceId?: string;
  onTagClick?: (tag: string) => void;
}

export function TagList({ 
  tags, 
  isLoading, 
  knowledgeSourceId, 
  onTagClick 
}: TagListProps) {
  const [relatedTags, setRelatedTags] = useState<string[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch related tags if a knowledge source ID is provided
  useEffect(() => {
    if (!knowledgeSourceId) return;
    
    async function fetchRelatedTags() {
      setIsLoadingRelated(true);
      setError(null);
      
      try {
        console.log('TagList: Fetching related tags for', knowledgeSourceId);
        
        const { data, error } = await supabase.functions.invoke('get-related-tags', {
          body: { knowledgeSourceId }
        });
        
        if (error) {
          console.error('TagList: Error fetching related tags:', error);
          setError('Failed to load related tags');
          setRelatedTags([]);
        } else if (data && Array.isArray(data.tags)) {
          console.log('TagList: Got related tags:', data.tags);
          setRelatedTags(data.tags);
        } else {
          console.log('TagList: No related tags found or invalid format:', data);
          setRelatedTags([]);
        }
      } catch (err) {
        console.error('TagList: Exception fetching related tags:', err);
        setError('An unexpected error occurred');
        setRelatedTags([]);
      } finally {
        setIsLoadingRelated(false);
      }
    }
    
    fetchRelatedTags();
  }, [knowledgeSourceId]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center">
          <Skeleton className="h-4 w-20 mr-2" />
          <Skeleton className="h-4 w-8" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-16 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  const displayTags = [...tags];
  const displayRelatedTags = relatedTags.filter(tag => !tags.includes(tag));

  if (displayTags.length === 0 && displayRelatedTags.length === 0 && !isLoadingRelated) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No tags generated yet. Use the form above to generate tags.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {displayTags.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Generated Tags</h3>
          <div className="flex flex-wrap gap-2">
            {displayTags.map((tag, index) => (
              <TagPill 
                key={`${tag}-${index}`} 
                tag={tag} 
                onClick={onTagClick} 
              />
            ))}
          </div>
        </div>
      )}
      
      {isLoadingRelated && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Loading related tags...</h3>
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-full" />
            ))}
          </div>
        </div>
      )}
      
      {displayRelatedTags.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Related Tags</h3>
          <div className="flex flex-wrap gap-2">
            {displayRelatedTags.map((tag, index) => (
              <TagPill 
                key={`related-${tag}-${index}`}
                tag={tag} 
                onClick={onTagClick}
                variant="outline"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
