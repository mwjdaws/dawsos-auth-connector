
/**
 * GraphSearch Component
 * 
 * Provides search functionality for finding nodes within the graph.
 * Supports auto-complete and dropdown selection.
 */
import React, { useState, useMemo, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { GraphData, GraphNode } from '../types';

export interface GraphSearchProps {
  graphData: GraphData;
  onNodeSelect: (nodeId: string) => void;
}

export function GraphSearch({ 
  graphData, 
  onNodeSelect 
}: GraphSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Filter nodes based on search term
  const filteredNodes = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const lowercaseTerm = searchTerm.toLowerCase();
    return graphData.nodes
      .filter(node => {
        const title = (node.title || '').toLowerCase();
        const name = (node.name || '').toLowerCase();
        return title.includes(lowercaseTerm) || name.includes(lowercaseTerm);
      })
      .slice(0, 5); // Limit to 5 results
  }, [searchTerm, graphData.nodes]);
  
  // Handle node selection from dropdown
  const handleNodeSelect = useCallback((node: GraphNode) => {
    setSearchTerm(node.title || node.name || '');
    setIsDropdownOpen(false);
    onNodeSelect(node.id);
  }, [onNodeSelect]);
  
  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    // Find the first matching node
    const node = graphData.nodes.find(node => {
      const title = (node.title || '').toLowerCase();
      const name = (node.name || '').toLowerCase();
      return title.toLowerCase().includes(searchTerm.toLowerCase()) || 
             name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    if (node) {
      onNodeSelect(node.id);
    }
  }, [searchTerm, graphData.nodes, onNodeSelect]);
  
  return (
    <form className="relative" onSubmit={handleSubmit}>
      <DropdownMenu open={isDropdownOpen && filteredNodes.length > 0} onOpenChange={setIsDropdownOpen}>
        <div className="flex gap-1">
          <DropdownMenuTrigger asChild>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search nodes..."
              className="w-full pr-10"
            />
          </DropdownMenuTrigger>
          
          <Button type="submit" size="sm" className="px-3">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <DropdownMenuContent align="start" className="w-[300px]">
          {filteredNodes.map((node) => (
            <DropdownMenuItem 
              key={node.id}
              onClick={() => handleNodeSelect(node)}
              className="flex flex-col items-start"
            >
              <span className="font-medium">{node.title || node.name}</span>
              {node.type && (
                <span className="text-xs text-muted-foreground">{node.type}</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </form>
  );
}
