
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

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
      {onCancel && (
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </Button>
      )}
      <Button 
        onClick={onSave}
        disabled={saving}
        className="ml-auto"
      >
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : 'Save Template'}
      </Button>
    </CardFooter>
  );
};

export default TemplateEditorFooter;
