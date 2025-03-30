
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KnowledgeTemplate } from "@/services/api/types";

interface TemplateSelectorCardProps {
  onSelectTemplate: (template: KnowledgeTemplate) => void;
  onCreateFromTemplate: () => void;
  selectedTemplate: KnowledgeTemplate | null;
}

export function TemplateSelectorCard({ 
  onSelectTemplate, 
  onCreateFromTemplate, 
  selectedTemplate 
}: TemplateSelectorCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Template Selection</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search templates..."
              className="pl-9"
            />
          </div>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-[120px]">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="global">Global</SelectItem>
              <SelectItem value="custom">My Templates</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Select a template to use as a starting point for new content.
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          disabled={!selectedTemplate}
          onClick={onCreateFromTemplate}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create From Template
        </Button>
      </CardFooter>
    </Card>
  );
}

export default TemplateSelectorCard;
