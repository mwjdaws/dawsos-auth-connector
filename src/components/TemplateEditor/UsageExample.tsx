
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import UseTemplate from './UseTemplate';

// This is just an example component to demonstrate how to use the UseTemplate component
const UsageExample: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const templateId = 'some-template-id'; // This would be a real template ID in your app
  
  const handleApplyTemplate = (templateContent: string) => {
    setContent(templateContent);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Usage Example</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-end">
          <UseTemplate 
            templateId={templateId}
            onApply={handleApplyTemplate}
            label="Apply Selected Template"
          />
        </div>
        
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Template content will appear here when applied"
          className="min-h-[200px]"
        />
      </CardContent>
    </Card>
  );
};

export default UsageExample;
