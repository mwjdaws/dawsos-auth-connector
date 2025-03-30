
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { GraphNode, GraphSearchProps } from './graph-renderer/GraphRendererTypes';

export function GraphSearch({ nodes, onNodeFound }: GraphSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const handleSelectNode = (nodeId: string) => {
    setOpen(false);
    setSearchValue('');
    onNodeFound(nodeId);
  };

  // Filter nodes based on search query
  const filteredNodes = nodes.filter(node => 
    node.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    node.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-xs">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-start text-sm text-muted-foreground"
            size="sm"
          >
            <Search className="mr-2 h-4 w-4" />
            Search...
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-full" align="start">
          <Command>
            <CommandInput 
              ref={inputRef}
              placeholder="Search nodes..." 
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>No results found</CommandEmpty>
              <CommandGroup>
                {filteredNodes.map(node => (
                  <CommandItem
                    key={node.id}
                    value={node.id}
                    onSelect={handleSelectNode}
                  >
                    <span>{node.title || node.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
