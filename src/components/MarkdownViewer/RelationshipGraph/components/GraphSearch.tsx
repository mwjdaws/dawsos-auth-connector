
import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { GraphData } from '../types';

interface GraphSearchProps {
  graphData: GraphData;
  onNodeFound: (nodeId: string) => void;
  disabled?: boolean;
}

export function GraphSearch({
  graphData,
  onNodeFound,
  disabled = false
}: GraphSearchProps) {
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  
  // Prepare searchable nodes
  const searchableNodes = useMemo(() => {
    if (!graphData || !graphData.nodes) return [];
    
    return graphData.nodes.map(node => ({
      id: node.id,
      label: node.name || node.title || node.id,
      type: node.type || 'unknown'
    }));
  }, [graphData]);
  
  // Filter nodes based on search input
  const filteredNodes = useMemo(() => {
    if (!searchValue) return searchableNodes;
    
    const lowerSearch = searchValue.toLowerCase();
    return searchableNodes.filter(node => 
      node.label.toLowerCase().includes(lowerSearch) ||
      node.id.toLowerCase().includes(lowerSearch) ||
      node.type.toLowerCase().includes(lowerSearch)
    );
  }, [searchableNodes, searchValue]);
  
  const handleSelect = (nodeId: string) => {
    if (nodeId && onNodeFound) {
      onNodeFound(nodeId);
      setOpen(false);
      setSearchValue('');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          role="combobox" 
          className="w-[250px] justify-start"
          disabled={disabled}
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="truncate">
            {searchValue || 'Search nodes...'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Search nodes..." 
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>No nodes found.</CommandEmpty>
            <CommandGroup heading="Nodes">
              {filteredNodes.slice(0, 10).map((node) => (
                <CommandItem
                  key={node.id}
                  value={node.id}
                  onSelect={() => handleSelect(node.id)}
                >
                  <span className="truncate">{node.label}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {node.type}
                  </span>
                </CommandItem>
              ))}
              {filteredNodes.length > 10 && (
                <CommandItem disabled>
                  <span className="text-xs text-muted-foreground">
                    + {filteredNodes.length - 10} more results
                  </span>
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
