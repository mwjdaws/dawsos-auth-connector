
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { KnowledgeTemplate } from "@/services/api/types";
import { PlusCircle, Globe, User, FileText } from "lucide-react";
import { TemplatePreview } from "./TemplatePreview";

interface TemplateDropdownProps {
  templates: KnowledgeTemplate[];
  loading: boolean;
  onTemplateChange: (templateId: string) => void;
}

export const TemplateDropdown = ({
  templates,
  loading,
  onTemplateChange
}: TemplateDropdownProps) => {
  return (
    <Select onValueChange={onTemplateChange} disabled={loading}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a template" />
      </SelectTrigger>
      <SelectContent>
        {templates.map((template) => (
          <HoverCard key={template.id} openDelay={300} closeDelay={100}>
            <HoverCardTrigger asChild>
              <SelectItem value={template.id}>
                <div className="flex items-center gap-2">
                  {template.is_global ? (
                    <Globe className="h-4 w-4 text-blue-500" />
                  ) : (
                    <User className="h-4 w-4 text-green-500" />
                  )}
                  {template.name}
                </div>
              </SelectItem>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">{template.name}</span>
                  {template.is_global && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Global
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <TemplatePreview template={template} />
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
        <SelectItem value="create-new" className="text-primary font-medium">
          <div className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Custom Template
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
