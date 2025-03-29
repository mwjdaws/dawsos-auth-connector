
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useOntologyTerms, OntologyTerm, RelatedTerm } from "@/hooks/markdown-editor";
import { Check, Plus, Tag, X } from "lucide-react";

interface OntologyTermsPanelProps {
  sourceId?: string;
  editable?: boolean;
}

export function OntologyTermsPanel({ sourceId, editable = false }: OntologyTermsPanelProps) {
  const [isAddingTerms, setIsAddingTerms] = useState(false);
  const [newTerm, setNewTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('attached');
  
  const {
    sourceTerms,
    relatedTerms,
    allTerms,
    domains,
    isLoading,
    isAdding,
    isRemoving,
    searchTerm,
    setSearchTerm,
    selectedDomain,
    setSelectedDomain,
    addTerm,
    removeTerm,
    addTermByName
  } = useOntologyTerms(sourceId);

  // Filter out terms that are already attached to avoid duplicates
  const attachedTermIds = new Set(sourceTerms.map(term => term.id));
  const availableTerms = allTerms.filter(term => !attachedTermIds.has(term.id));
  
  const handleAddTerm = (termId: string) => {
    addTerm(termId);
  };

  const handleRemoveTerm = (associationId: string) => {
    removeTerm(associationId);
  };

  const handleAddCustomTerm = () => {
    if (newTerm.trim()) {
      addTermByName(newTerm, selectedDomain || undefined);
      setNewTerm('');
    }
  };

  // Toggle the term selector UI
  const toggleAddTerms = () => {
    setIsAddingTerms(!isAddingTerms);
    if (!isAddingTerms) {
      setSearchTerm('');
      setSelectedDomain(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Ontology Terms</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-slate-100 animate-pulse">
            Loading...
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Ontology Terms</h3>
        {editable && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleAddTerms}
            aria-expanded={isAddingTerms}
          >
            {isAddingTerms ? <X className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
            {isAddingTerms ? 'Close' : 'Add Terms'}
          </Button>
        )}
      </div>

      {/* Display attached terms */}
      {!isAddingTerms && (
        <>
          {sourceTerms.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {sourceTerms.map((term) => (
                <Badge 
                  key={term.associationId} 
                  variant="secondary"
                  className="flex items-center gap-1 group"
                >
                  {term.domain && (
                    <span className="text-xs opacity-70">{term.domain}:</span>
                  )}
                  {term.term}
                  {editable && (
                    <button 
                      onClick={() => handleRemoveTerm(term.associationId!)}
                      className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No ontology terms attached</p>
          )}

          {/* Display related terms */}
          {relatedTerms.length > 0 && (
            <>
              <Separator className="my-2" />
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground">Related Terms</h4>
                <div className="flex flex-wrap gap-2">
                  {relatedTerms.map((term) => (
                    <Badge 
                      key={`${term.term_id}-${term.relation_type}`} 
                      variant="outline"
                      className="bg-slate-50 hover:bg-slate-100 cursor-pointer"
                      onClick={() => editable && !attachedTermIds.has(term.term_id) && addTerm(term.term_id)}
                    >
                      {term.term}
                      <span className="text-xs opacity-70 ml-1">
                        ({term.relation_type})
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Term selector UI */}
      {isAddingTerms && (
        <div className="border rounded-md p-4 space-y-4">
          <Tabs defaultValue="browse" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browse">Browse Terms</TabsTrigger>
              <TabsTrigger value="create">Add New Term</TabsTrigger>
            </TabsList>
            
            <TabsContent value="browse" className="space-y-4">
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
                            onClick={() => handleAddTerm(term.id)}
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
            </TabsContent>
            
            <TabsContent value="create" className="space-y-4">
              <div className="space-y-2">
                <div className="grid gap-2">
                  <label htmlFor="new-term" className="text-sm font-medium">
                    Term Name
                  </label>
                  <Input
                    id="new-term"
                    placeholder="Enter new term..."
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="term-domain" className="text-sm font-medium">
                    Domain (optional)
                  </label>
                  <Select 
                    value={selectedDomain || ''} 
                    onValueChange={(value) => setSelectedDomain(value || null)}
                  >
                    <SelectTrigger id="term-domain">
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Domain</SelectItem>
                      {domains.map((domain) => (
                        <SelectItem key={domain} value={domain}>
                          {domain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  className="w-full"
                  onClick={handleAddCustomTerm}
                  disabled={!newTerm.trim() || isAdding}
                >
                  {isAdding ? "Adding..." : "Add New Term"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
