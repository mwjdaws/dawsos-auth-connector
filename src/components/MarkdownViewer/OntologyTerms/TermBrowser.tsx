
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { OntologyTerm } from "@/hooks/markdown-editor";

interface TermBrowserProps {
  availableTerms: OntologyTerm[];
  domains: string[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedDomain: string | null;
  setSelectedDomain: (value: string | null) => void;
  onAddTerm: (termId: string) => void;
  isAdding: boolean;
}

export function TermBrowser({ 
  availableTerms, 
  domains, 
  searchTerm, 
  setSearchTerm, 
  selectedDomain, 
  setSelectedDomain, 
  onAddTerm, 
  isAdding 
}: TermBrowserProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Input
          placeholder="Search terms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        
        <Select value={selectedDomain || ''} onValueChange={(value) => setSelectedDomain(value || null)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by domain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Domains</SelectItem>
            {domains.map((domain) => (
              <SelectItem key={domain} value={domain}>
                {domain}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[200px] w-full rounded-md border">
        <div className="p-4">
          {availableTerms.length > 0 ? (
            <div className="space-y-2">
              {availableTerms.map((term) => (
                <div
                  key={term.id}
                  className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-slate-100"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{term.term}</p>
                    {term.domain && (
                      <p className="text-xs text-muted-foreground">
                        Domain: {term.domain}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onAddTerm(term.id)}
                    disabled={isAdding}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              No matching terms found
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
