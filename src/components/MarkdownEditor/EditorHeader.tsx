
import React from 'react';
import { Input } from '@/components/ui/input';
import TemplateSelector from './TemplateSelector';
import { KnowledgeTemplate } from '@/services/api/types';
import { ExternalLink } from 'lucide-react';

interface EditorHeaderProps {
  title: string;
  setTitle: (title: string) => void;
  templateId: string | null;
  externalSourceUrl: string;
  setExternalSourceUrl: (url: string) => void;
  templates: KnowledgeTemplate[];
  isLoadingTemplates: boolean;
  onTemplateChange: (value: string) => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  title,
  setTitle,
  templateId,
  externalSourceUrl,
  setExternalSourceUrl,
  templates,
  isLoadingTemplates,
  onTemplateChange
}) => {
  return (
    <div className="mb-4 space-y-4">
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
      
      <div className="w-full">
        <label htmlFor="externalSource" className="flex items-center gap-1 text-sm font-medium mb-1">
          <ExternalLink className="h-4 w-4" /> External Source URL
        </label>
        <Input
          id="externalSource"
          value={externalSourceUrl}
          onChange={(e) => setExternalSourceUrl(e.target.value)}
          placeholder="https://example.com/reference-document"
          className="w-full"
          type="url"
        />
      </div>
    </div>
  );
};

export default EditorHeader;
