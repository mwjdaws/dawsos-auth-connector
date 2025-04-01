
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export interface TemplateEditorFooterProps {
  onCancel?: (() => void);
  onSave: () => Promise<void>;
  saving: boolean;
}

/**
 * Footer component for the Template Editor with save and cancel buttons
 */
const TemplateEditorFooter: React.FC<TemplateEditorFooterProps> = ({ 
  onCancel, 
  onSave, 
  saving 
}) => {
  return (
    <CardFooter className="flex justify-end space-x-2">
      {onCancel && (
        <Button 
          variant="outline" 
          type="button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </Button>
      )}
      <Button 
        onClick={onSave}
        disabled={saving}
      >
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Template'
        )}
      </Button>
    </CardFooter>
  );
};

export default TemplateEditorFooter;
