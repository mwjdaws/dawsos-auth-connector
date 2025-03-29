
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { GraphNode } from '../types';
import { toast } from '@/hooks/use-toast';

interface GraphSearchProps {
  nodes: GraphNode[];
  onNodeFound: (nodeId: string) => void;
}

export function GraphSearch({ nodes, onNodeFound }: GraphSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GraphNode[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const fuseRef = useRef<Fuse<GraphNode> | null>(null);

  // Initialize Fuse.js for fuzzy search
  useEffect(() => {
    if (nodes.length > 0) {
      fuseRef.current = new Fuse(nodes, {
        keys: ['name'],
        threshold: 0.3,
        distance: 100
      });
    }
  }, [nodes]);

  // Handle search
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim() || !fuseRef.current) {
      setSearchResults([]);
      return;
    }

    const results = fuseRef.current.search(searchQuery);
    setSearchResults(results.map(result => result.item));
    
    // If we have results, highlight the first one
    if (results.length > 0) {
      onNodeFound(results[0].item.id);
      toast({
        title: "Search Results",
        description: `Found ${results.length} matching node${results.length === 1 ? '' : 's'}`,
      });
    } else {
      toast({
        title: "No Results",
        description: "No matching nodes found",
        variant: "destructive",
      });
    }
  }, [searchQuery, onNodeFound]);

  // Handle Enter key press
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex flex-col gap-2 p-2 bg-card rounded-md shadow-sm">
      <div className="flex space-x-2">
        <div className="relative flex-grow">
          <Input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search nodes..."
            className="pr-8"
          />
          {searchQuery && (
            <button 
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={handleSearch}
          disabled={!searchQuery.trim()}
        >
          <Search size={16} className="mr-1" />
          Search
        </Button>
      </div>
      
      {searchResults.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {searchResults.length} result{searchResults.length > 1 ? 's' : ''} found
        </div>
      )}
    </div>
  );
}
