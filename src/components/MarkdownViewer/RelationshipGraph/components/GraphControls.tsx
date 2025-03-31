
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GraphData } from '../types';
import { GraphZoomControl } from './GraphZoomControl';

interface GraphControlsProps {
  graphData: GraphData;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onResetZoom: () => void;
  onNodeFound: (nodeId: string) => void;
}

/**
 * GraphControls Component
 * 
 * Provides controls for interacting with the graph, including search, zoom, and reset.
 */
export function GraphControls({
  graphData,
  zoom,
  onZoomChange,
  onResetZoom,
  onNodeFound
}: GraphControlsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Search for a node by name or title
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    // Find a node that matches the search term
    const foundNode = graphData.nodes.find(node => 
      (node.name && node.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (node.title && node.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    if (foundNode) {
      onNodeFound(foundNode.id);
    }
  };
  
  return (
    <div className="px-4 py-2 border-t border-b flex flex-wrap items-center justify-between gap-2">
      <form onSubmit={handleSearch} className="flex items-center space-x-2 flex-1">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <Button type="submit" variant="outline" size="sm">Find</Button>
      </form>
      
      <GraphZoomControl 
        zoomLevel={zoom}
        onZoomChange={onZoomChange}
        onResetZoom={onResetZoom}
      />
    </div>
  );
}

export default GraphControls;
