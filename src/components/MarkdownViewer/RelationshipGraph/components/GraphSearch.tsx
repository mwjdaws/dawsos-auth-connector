
import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { GraphData, GraphNode } from '../types';

interface GraphSearchProps {
  graphData: GraphData;
  onNodeFound: (nodeId: string) => void;
}

/**
 * GraphSearch Component
 * 
 * Provides a search interface to find nodes in the graph by name or title.
 */
export function GraphSearch({ graphData, onNodeFound }: GraphSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<GraphNode[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Search the graph data for nodes matching the search term
  const searchNodes = useCallback((term: string) => {
    if (!term.trim() || !graphData?.nodes?.length) {
      setSearchResults([]);
      return;
    }

    const normalizedTerm = term.toLowerCase().trim();
    
    const results = graphData.nodes.filter(node => {
      const nodeName = (node.name || '').toLowerCase();
      const nodeTitle = (node.title || '').toLowerCase();
      const nodeId = node.id.toLowerCase();
      
      return (
        nodeName.includes(normalizedTerm) || 
        nodeTitle.includes(normalizedTerm) ||
        nodeId.includes(normalizedTerm)
      );
    }).slice(0, 5); // Limit to 5 results
    
    setSearchResults(results);
  }, [graphData]);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchNodes(value);
    setShowResults(!!value.trim());
  };

  // Handle clicking on a search result
  const handleResultClick = (nodeId: string) => {
    onNodeFound(nodeId);
    setShowResults(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="relative w-full max-w-sm">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search nodes..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-8"
          onFocus={() => setShowResults(!!searchTerm.trim())}
          onBlur={() => {
            // Delay hiding to allow for clicks on results
            setTimeout(() => setShowResults(false), 200);
          }}
        />
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="absolute mt-1 w-full bg-background border rounded-md shadow-md z-10">
          <ul>
            {searchResults.map(node => (
              <li 
                key={node.id}
                className="px-4 py-2 hover:bg-accent cursor-pointer"
                onMouseDown={() => handleResultClick(node.id)}
              >
                <div className="font-medium">{node.name || node.title || 'Unnamed Node'}</div>
                <div className="text-xs text-muted-foreground truncate">ID: {node.id}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {showResults && searchTerm.trim() && searchResults.length === 0 && (
        <div className="absolute mt-1 w-full bg-background border rounded-md shadow-md z-10 p-4 text-center">
          <p className="text-muted-foreground">No matching nodes found</p>
        </div>
      )}
    </div>
  );
}
