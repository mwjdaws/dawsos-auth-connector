
import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface TagGeneratorProps {
  isLoading: boolean;
  onGenerateTags: (text: string) => void;
}

export function TagGenerator({ isLoading, onGenerateTags }: TagGeneratorProps) {
  const [text, setText] = useState("");

  const handleGenerate = () => {
    if (text.trim()) {
      onGenerateTags(text);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Paste content here..."
        className="min-h-[150px]"
      />
      <Button 
        onClick={handleGenerate}
        disabled={isLoading || !text.trim()}
      >
        {isLoading ? "Generating..." : "Suggest Tags"}
      </Button>
    </div>
  );
}
