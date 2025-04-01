
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GraphData } from '../types';

/**
 * Props for the GraphSearch component
 */
export interface GraphSearchProps {
  graphData: GraphData;
  onNodeFound: (nodeId: string) => void;
  disabled?: boolean;
}

/**
 * GraphSearch Component
 * 
 * Provides search functionality for finding nodes in the graph.
 */
export function GraphSearch({ 
  graphData, 
  onNodeFound,
  disabled = false
}: GraphSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: string; name: string }>>([]);
  const [showResults, setShowResults] = useState(false);

  // Update search results when search term changes
  useEffect(() => {
    if (!searchTerm.trim() || !graphData.nodes.length) {
      setSearchResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = graphData.nodes
      .filter(node => 
        (node.name || node.title || '').toLowerCase().includes(term) || 
        (node.id || '').toLowerCase().includes(term)
      )
      .map(node => ({
        id: node.id,
        name: node.name || node.title || node.id
      }))
      .slice(0, 5); // Limit to 5 results

    setSearchResults(results);
  }, [searchTerm, graphData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      onNodeFound(searchResults[0].id);
    }
  };

  const handleResultClick = (nodeId: string) => {
    onNodeFound(nodeId);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="flex">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            onBlur={() => {
              // Delay hiding results to allow for clicks
              setTimeout(() => setShowResults(false), 200);
            }}
            className="pr-10"
            disabled={disabled}
          />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
            disabled={disabled || searchResults.length === 0}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {showResults && searchResults.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {searchResults.map((result) => (
              <li
                key={result.id}
                className="px-3 py-2 cursor-pointer hover:bg-muted"
                onClick={() => handleResultClick(result.id)}
              >
                {result.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
