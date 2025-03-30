
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Search, Book } from 'lucide-react';
import { KnowledgeSource } from '@/services/api/types';
import { useKnowledgeSourcesQuery } from '@/hooks/markdown-editor/useKnowledgeSources';
import { Skeleton } from '@/components/ui/skeleton';

interface KnowledgeSourceBrowserProps {
  onSelectSource: (source: KnowledgeSource) => void;
}

// Interface for source data with nullable fields from the API
interface ApiSourceData {
  id: string;
  title: string;
  content: string;
  created_at: string | null;
  created_by: string | null;
  external_content_hash: string | null;
  external_source_checked_at: string | null;
  external_source_url: string | null;
  is_published: boolean;
  published_at: string | null;
  template_id: string | null;
  updated_at: string | null;
  user_id: string | null;
}

export function KnowledgeSourceBrowser({ onSelectSource }: KnowledgeSourceBrowserProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: sources, isLoading, error } = useKnowledgeSourcesQuery(searchTerm);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Safely transform API source data to KnowledgeSource format
  const handleSourceSelect = (apiSource: ApiSourceData) => {
    const source: KnowledgeSource = {
      id: apiSource.id,
      title: apiSource.title,
      content: apiSource.content,
      createdAt: apiSource.created_at || new Date().toISOString(),
      updatedAt: apiSource.updated_at || new Date().toISOString(),
      externalSourceUrl: apiSource.external_source_url || undefined,
      externalSourceCheckedAt: apiSource.external_source_checked_at || undefined,
      externalContentHash: apiSource.external_content_hash || undefined,
      needsExternalReview: apiSource.is_published
    };
    
    onSelectSource(source);
  };

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Knowledge Source Browser</DialogTitle>
        <DialogDescription>
          Browse and select a knowledge source to load into the editor
        </DialogDescription>
      </DialogHeader>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search knowledge sources..."
          className="pl-8"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="h-[300px] overflow-y-auto border rounded-md p-1">
        {isLoading ? (
          <div className="space-y-2 p-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center text-destructive p-4 text-center">
            <p>Error loading knowledge sources. Please try again.</p>
          </div>
        ) : sources && sources.length > 0 ? (
          <div className="space-y-1">
            {sources.map((source) => (
              <Button
                key={source.id}
                variant="ghost"
                className="w-full justify-start text-left h-auto py-3"
                onClick={() => handleSourceSelect(source)}
              >
                <div className="flex items-start gap-2">
                  <Book className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="font-medium line-clamp-1">{source.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {source.content?.substring(0, 80)}...
                    </p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground p-4 text-center">
            <p>No knowledge sources found. Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
