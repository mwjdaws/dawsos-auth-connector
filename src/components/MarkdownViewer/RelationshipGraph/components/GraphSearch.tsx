
/**
 * GraphSearch Component
 * 
 * Provides search functionality for graph nodes
 */
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';
import { GraphData } from '../types';

export interface GraphSearchProps {
  graphData: GraphData;
  onNodeSelect: (nodeId: string) => void;
}

export function GraphSearch({ graphData, onNodeSelect }: GraphSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    const searchLower = searchTerm.toLowerCase();
    const foundNode = graphData.nodes.find(node => 
      (node.name?.toLowerCase().includes(searchLower) || 
       node.title?.toLowerCase().includes(searchLower))
    );
    
    if (foundNode) {
      onNodeSelect(foundNode.id);
    }
  };
  
  return (
    <form onSubmit={handleSearch} className="relative flex w-full max-w-sm items-center">
      <Input
        type="text"
        placeholder="Search nodes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pr-10"
      />
      <Button 
        type="submit" 
        size="sm"
        variant="ghost" 
        className="absolute right-0 h-full px-3"
      >
        <SearchIcon className="h-4 w-4" />
      </Button>
    </form>
  );
}
