
import React from 'react';
import { Input } from '@/components/ui/input';
import TemplateSelector from './TemplateSelector';
import { KnowledgeTemplate } from '@/services/api/types';

interface EditorHeaderProps {
  title: string;
  setTitle: (title: string) => void;
  templateId: string | null;
  templates: KnowledgeTemplate[];
  isLoadingTemplates: boolean;
  onTemplateChange: (value: string) => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  title,
  setTitle,
  templateId,
  templates,
  isLoadingTemplates,
  onTemplateChange
}) => {
  return (
    <div className="mb-4">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 items-start">
        <div className="w-full md:w-2/3">
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title"
            className="w-full"
          />
        </div>
        <div className="w-full md:w-1/3">
          <TemplateSelector
            templateId={templateId}
            templates={templates}
            isLoading={isLoadingTemplates}
            onChange={onTemplateChange}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorHeader;
