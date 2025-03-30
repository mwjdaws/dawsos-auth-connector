
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';

interface TemplateEditorHeaderProps {
  isEditing: boolean;
}

const TemplateEditorHeader: React.FC<TemplateEditorHeaderProps> = ({ isEditing }) => {
  return (
    <CardHeader>
      <CardTitle>{isEditing ? 'Edit Template' : 'Create Template'}</CardTitle>
    </CardHeader>
  );
};

export default TemplateEditorHeader;
