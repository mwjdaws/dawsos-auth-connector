
import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CopyButtonProps extends ButtonProps {
  value: string;
  onCopy?: () => void;
  showToast?: boolean;
  toastMessage?: string;
  timeout?: number;
}

export function CopyButton({
  value,
  onCopy,
  showToast = true,
  toastMessage = 'Copied to clipboard',
  timeout = 2000,
  children,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    if (!value) return;
    
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      
      if (showToast) {
        toast({
          title: 'Success',
          description: toastMessage,
        });
      }
      
      if (onCopy) {
        onCopy();
      }
      
      setTimeout(() => {
        setCopied(false);
      }, timeout);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Button 
      onClick={handleCopy} 
      size="icon" 
      variant="ghost" 
      {...props}
    >
      {children || (
        copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}
