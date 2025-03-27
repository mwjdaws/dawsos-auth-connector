
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, User } from "lucide-react";

interface TemplateFilterTabsProps {
  currentFilter: 'all' | 'global' | 'custom';
  onFilterChange: (filter: 'all' | 'global' | 'custom') => void;
}

export const TemplateFilterTabs = ({ 
  currentFilter, 
  onFilterChange 
}: TemplateFilterTabsProps) => {
  return (
    <div className="mb-4">
      <Tabs 
        defaultValue={currentFilter} 
        onValueChange={(value) => onFilterChange(value as 'all' | 'global' | 'custom')}
        className="w-full"
      >
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="global" className="flex items-center gap-1">
            <Globe className="h-4 w-4" /> Global
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-1">
            <User className="h-4 w-4" /> Custom
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
