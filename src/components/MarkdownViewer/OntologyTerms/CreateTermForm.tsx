
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateTermFormProps {
  newTerm: string;
  setNewTerm: (value: string) => void;
  selectedDomain: string | null;
  setSelectedDomain: (value: string | null) => void;
  domains: string[];
  onAddTerm: () => void;
  isAdding: boolean;
}

export function CreateTermForm({ 
  newTerm, 
  setNewTerm, 
  selectedDomain, 
  setSelectedDomain, 
  domains, 
  onAddTerm, 
  isAdding 
}: CreateTermFormProps) {
  return (
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
        onClick={onAddTerm}
        disabled={!newTerm.trim() || isAdding}
      >
        {isAdding ? "Adding..." : "Add New Term"}
      </Button>
    </div>
  );
}
