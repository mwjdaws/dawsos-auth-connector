
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TemplateNameFieldProps {
  name: string;
  setName: (name: string) => void;
}

const TemplateNameField: React.FC<TemplateNameFieldProps> = ({ name, setName }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="template-name">Template Name</Label>
      <Input
        id="template-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter template name"
        className="w-full"
      />
    </div>
  );
};

export default TemplateNameField;
