
import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { GraphData } from '../types';

export interface GraphSearchProps {
  graphData: GraphData;
  onNodeFound: (nodeId: string) => void;
}

/**
 * GraphSearch Component
 * 
 * This component provides search functionality for the graph,
 * allowing users to find nodes by typing in a search term.
 */
export function GraphSearch({ graphData, onNodeFound }: GraphSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: string; title: string }>>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim().length === 0) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      return;
    }
    
    // Filter nodes based on search term
    const results = graphData.nodes
      .filter(node => 
        (node.name?.toLowerCase().includes(term.toLowerCase()) || 
         node.title?.toLowerCase().includes(term.toLowerCase())))
      .map(node => ({ id: node.id, title: node.title || node.name || node.id }))
      .slice(0, 10); // Limit to 10 results
    
    setSearchResults(results);
    setIsDropdownOpen(results.length > 0);
  };
  
  // Handle selecting a search result
  const handleResultClick = (nodeId: string) => {
    onNodeFound(nodeId);
    setIsDropdownOpen(false);
    setSearchResults([]);
    setSearchTerm('');
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search nodes..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-8 pr-4 py-2 w-full rounded-md"
        />
      </div>
      
      {isDropdownOpen && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md max-h-60 overflow-y-auto">
          <ul className="py-1">
            {searchResults.map(result => (
              <li 
                key={result.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm truncate"
                onClick={() => handleResultClick(result.id)}
              >
                {result.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
