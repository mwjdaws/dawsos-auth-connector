
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { KnowledgeSource } from '@/services/api/types';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Book } from 'lucide-react';

interface KnowledgeSourceBrowserProps {
  onSelectSource: (source: KnowledgeSource) => void;
}

export function KnowledgeSourceBrowser({ onSelectSource }: KnowledgeSourceBrowserProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: sources, isLoading, error } = useQuery({
    queryKey: ['knowledgeSources', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('knowledge_sources')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }
      
      const { data, error } = await query.limit(20);
      
      if (error) throw error;
      return data as KnowledgeSource[];
    }
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Knowledge Sources</CardTitle>
        <CardDescription>
          Browse and select from existing knowledge sources
        </CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search knowledge sources..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error ? (
          <div className="text-destructive py-4 text-center">
            Error loading knowledge sources
          </div>
        ) : sources && sources.length > 0 ? (
          <ScrollArea className="h-[300px] pr-3">
            <div className="space-y-2">
              {sources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-center justify-between p-3 rounded-md border hover:bg-muted cursor-pointer"
                  onClick={() => onSelectSource(source)}
                >
                  <div className="flex items-center gap-2">
                    <Book className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium truncate">{source.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(source.updated_at || '').toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    onSelectSource(source);
                  }}>
                    Select
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No knowledge sources found
          </div>
        )}
      </CardContent>
    </Card>
  );
}
