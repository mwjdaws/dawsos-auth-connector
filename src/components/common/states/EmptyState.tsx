
import React from 'react';
import { Button } from '@/components/ui/button';
import { PackageOpen, RefreshCw } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({ 
  title, 
  description, 
  actionLabel, 
  onAction,
  icon = <PackageOpen className="h-10 w-10 text-muted-foreground/60" />
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border rounded-md">
      {icon}
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">{description}</p>
      
      {actionLabel && onAction && (
        <Button 
          variant="outline" 
          className="mt-4 gap-1" 
          onClick={onAction}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
