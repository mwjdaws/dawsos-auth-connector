
import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface TagGeneratorProps {
  isLoading: boolean;
  onGenerateTags: (text: string) => void;
}

export function TagGenerator({ isLoading, onGenerateTags }: TagGeneratorProps) {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear typing indicator after a delay
  useEffect(() => {
    if (isTyping && typingTimerRef.current === null) {
      typingTimerRef.current = setTimeout(() => {
        setIsTyping(false);
        typingTimerRef.current = null;
      }, 1000);
    }
    
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, [isTyping]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setIsTyping(true);
  };

  const handleGenerate = () => {
    if (text.trim()) {
      console.log("TagGenerator: Calling onGenerateTags with text:", text.substring(0, 50) + "...");
      onGenerateTags(text);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Ctrl+Enter or Cmd+Enter to generate tags
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (text.trim() && !isLoading) {
        handleGenerate();
      }
    }
  };

  return (
    <div className="space-y-4">
      <Textarea 
        ref={textAreaRef}
        value={text} 
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder="Paste content here..."
        className="min-h-[150px]"
      />
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {isTyping ? 'Typing...' : 
           text ? `${text.length} characters` : 'Paste content to generate tags'}
        </div>
        <Button 
          onClick={handleGenerate}
          disabled={isLoading || !text.trim()}
          className="min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : "Suggest Tags"}
        </Button>
      </div>
    </div>
  );
}
