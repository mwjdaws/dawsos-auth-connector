
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface TemplateGlobalToggleProps {
  isGlobal: boolean;
  setIsGlobal: (isGlobal: boolean) => void;
}

const TemplateGlobalToggle: React.FC<TemplateGlobalToggleProps> = ({ 
  isGlobal, 
  setIsGlobal 
}) => {
  return (
    <div className="flex items-center space-x-2 py-2">
      <Switch
        id="template-global"
        checked={isGlobal}
        onCheckedChange={setIsGlobal}
      />
      <Label htmlFor="template-global">
        Global Template <span className="text-xs text-muted-foreground">(available to all users)</span>
      </Label>
    </div>
  );
};

export default TemplateGlobalToggle;
