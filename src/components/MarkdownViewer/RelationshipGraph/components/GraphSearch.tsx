
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GraphNode } from '../types';
import { ensureString } from '@/types/compat';

interface GraphSearchProps {
  nodes: GraphNode[];
  onSelectNode: (nodeId: string) => void;
}

export function GraphSearch({ nodes, onSelectNode }: GraphSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GraphNode[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter nodes based on search input
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = nodes.filter(node => {
      const title = ensureString(node.title).toLowerCase();
      const name = ensureString(node.name).toLowerCase();
      return title.includes(query) || name.includes(query);
    });

    setSearchResults(results.slice(0, 10)); // Limit to top 10 results
  }, [searchQuery, nodes]);

  // Clear search input and results
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    inputRef.current?.focus();
  };

  // Handle node selection from search results
  const handleNodeSelect = (nodeId: string) => {
    if (nodeId) {
      onSelectNode(nodeId);
      handleClearSearch();
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search nodes..."
          className="pl-8 pr-8"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1.5 h-6 w-6 p-0"
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      {searchResults.length > 0 && (
        <ScrollArea className="h-[200px] border rounded-md p-2">
          <div className="space-y-1">
            {searchResults.map((node) => (
              <Button
                key={node.id}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => handleNodeSelect(node.id)}
              >
                <span className="truncate">{node.title || node.name}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
