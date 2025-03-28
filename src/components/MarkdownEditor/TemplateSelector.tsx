
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { FileText } from 'lucide-react';
import { KnowledgeTemplate } from '@/services/api/types';

interface TemplateSelectorProps {
  templateId: string | null;
  templates: KnowledgeTemplate[];
  isLoading: boolean;
  onChange: (value: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  templateId, 
  templates, 
  isLoading, 
  onChange 
}) => {
  return (
    <div className="w-full">
      <label htmlFor="template" className="block text-sm font-medium mb-1">
        Template
      </label>
      <Select 
        onValueChange={onChange} 
        value={templateId || "none"}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a template" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">
            <div className="flex items-center">
              <span>No template</span>
            </div>
          </SelectItem>
          
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{template.name}</span>
                {template.is_global && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                    Global
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TemplateSelector;
