
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';

interface TemplateEditorFooterProps {
  onCancel?: () => void;
  onSave: () => void;
  saving: boolean;
}

const TemplateEditorFooter: React.FC<TemplateEditorFooterProps> = ({
  onCancel,
  onSave,
  saving
}) => {
  return (
    <CardFooter className="flex justify-between">
      <Button
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        onClick={onSave}
        disabled={saving}
        className="flex items-center gap-2"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save Template
      </Button>
    </CardFooter>
  );
};

export default TemplateEditorFooter;
