
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface JsonEditorProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

export const JsonEditor: React.FC<JsonEditorProps> = ({ 
  id, 
  value, 
  onChange,
  height = "200px"
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Validate JSON
    try {
      if (newValue.trim()) {
        JSON.parse(newValue);
        setError(null);
      } else {
        setError(null);
      }
    } catch (err) {
      setError("Invalid JSON format");
    }
  };

  return (
    <div className="space-y-2">
      <Textarea
        id={id}
        value={value}
        onChange={handleChange}
        placeholder="Enter JSON data"
        className="font-mono text-sm"
        style={{ height }}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};
