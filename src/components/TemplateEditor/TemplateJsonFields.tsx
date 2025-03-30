
import React from 'react';
import { Label } from '@/components/ui/label';
import { JsonEditor } from './JsonEditor';

interface TemplateJsonFieldsProps {
  metadata: string;
  setMetadata: (metadata: string) => void;
  structure: string;
  setStructure: (structure: string) => void;
}

const TemplateJsonFields: React.FC<TemplateJsonFieldsProps> = ({
  metadata,
  setMetadata,
  structure,
  setStructure
}) => {
  return (
    <>
      <div className="space-y-4 pt-4">
        <Label htmlFor="template-metadata">Metadata (JSON)</Label>
        <JsonEditor
          id="template-metadata"
          value={metadata}
          onChange={setMetadata}
          height="150px"
        />
      </div>

      <div className="space-y-4 pt-4">
        <Label htmlFor="template-structure">Structure (JSON)</Label>
        <JsonEditor
          id="template-structure"
          value={structure}
          onChange={setStructure}
          height="150px"
        />
      </div>
    </>
  );
};

export default TemplateJsonFields;
