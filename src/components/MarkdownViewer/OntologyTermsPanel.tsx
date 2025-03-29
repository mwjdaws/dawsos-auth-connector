
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X } from "lucide-react";
import { useOntologyTerms } from "@/hooks/markdown-editor";
import { 
  AttachedTermsList, 
  RelatedTermsList, 
  TermBrowser, 
  CreateTermForm 
} from "./OntologyTerms";

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
          <div className="bg-slate-100 animate-pulse px-3 py-1 rounded-full text-sm">
            Loading...
          </div>
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

      {/* Display attached and related terms when not in adding mode */}
      {!isAddingTerms && (
        <>
          <AttachedTermsList 
            terms={sourceTerms} 
            editable={editable} 
            onRemoveTerm={removeTerm} 
          />
          
          <RelatedTermsList 
            terms={relatedTerms} 
            editable={editable} 
            attachedTermIds={attachedTermIds} 
            onAddTerm={addTerm} 
          />
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
              <TermBrowser 
                availableTerms={availableTerms}
                domains={domains}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedDomain={selectedDomain}
                setSelectedDomain={setSelectedDomain}
                onAddTerm={addTerm}
                isAdding={isAdding}
              />
            </TabsContent>
            
            <TabsContent value="create" className="space-y-4">
              <CreateTermForm 
                newTerm={newTerm}
                setNewTerm={setNewTerm}
                selectedDomain={selectedDomain}
                setSelectedDomain={setSelectedDomain}
                domains={domains}
                onAddTerm={handleAddCustomTerm}
                isAdding={isAdding}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
