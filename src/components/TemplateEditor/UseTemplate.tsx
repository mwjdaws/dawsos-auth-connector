
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, FileText } from 'lucide-react';
import { fetchKnowledgeTemplateById } from '@/services/api/templates';
import { useToast } from '@/hooks/use-toast';

interface UseTemplateProps {
  templateId: string;
  onApply: (content: string) => void;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
  label?: string;
  className?: string;
}

const UseTemplate: React.FC<UseTemplateProps> = ({
  templateId,
  onApply,
  variant = 'outline',
  size = 'sm',
  label = 'Use Template',
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleClick = async () => {
    if (!templateId) {
      toast({
        title: "No template selected",
        description: "Please select a template first",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const template = await fetchKnowledgeTemplateById(templateId);
      
      // Call the onApply callback with the template content
      onApply(template.content);
      
      // Show success toast
      toast({
        title: "Template Applied",
        description: `Template "${template.name}" has been applied successfully`,
      });
      
      // Optional: Log usage statistics
      // This is a placeholder for where you could log template usage
      console.log('Template used:', templateId);
      
    } catch (error) {
      console.error('Error applying template:', error);
      toast({
        title: "Error",
        description: "Failed to apply template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center gap-2 ${className}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileText className="h-4 w-4" />
      )}
      {label}
    </Button>
  );
};

export default UseTemplate;
