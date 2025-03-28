
import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface TagGeneratorProps {
  isLoading: boolean;
  onGenerateTags: (text: string) => void;
}

export function TagGenerator({ isLoading, onGenerateTags }: TagGeneratorProps) {
  const [text, setText] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = () => {
    if (text.trim()) {
      console.log("TagGenerator: Calling onGenerateTags with text:", text.substring(0, 50) + "...");
      onGenerateTags(text);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea 
        ref={textAreaRef}
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
