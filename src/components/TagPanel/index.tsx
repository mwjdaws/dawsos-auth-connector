
import { useState, useEffect, useTransition, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { TagList } from "./TagList";
import { useTagGeneration } from "@/hooks/useTagGeneration";
import { saveTags } from "@/utils/tagUtils";
import { supabase } from "@/integrations/supabase/client";

interface TagPanelProps {
  onTagsGenerated?: (contentId: string) => void;
}

export function TagPanel({ onTagsGenerated }: TagPanelProps) {
  const [text, setText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { user } = useAuth();
  const isMounted = useRef(true);
  
  const { 
    tags, 
    setTags,
    isLoading, 
    contentId,
    handleGenerateTags 
  } = useTagGeneration();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Set up Supabase Realtime listener for tag updates
  useEffect(() => {
    // Create a Supabase Realtime channel for global tag monitoring
    const channel = supabase
      .channel('global-tags')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'tags' },
        (payload) => {
          console.log('New tag added:', payload.new);
          // If this is specifically related to our content, update UI
          if (payload.new.content_id === contentId && isMounted.current) {
            toast({
              title: "Tag Saved",
              description: `Tag "${payload.new.name}" was successfully saved.`,
            });
          }
        }
      )
      .subscribe();

    // Clean up the subscription when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [contentId]);

  const handleTagging = async () => {
    const newContentId = await handleGenerateTags(text);
    console.log("TagPanel: handleTagging completed with contentId:", newContentId);
    
    // Notify parent component of the new contentId
    if (onTagsGenerated && newContentId) {
      console.log("TagPanel: Notifying parent of contentId:", newContentId);
      onTagsGenerated(newContentId);
    }
  };

  const handleSaveTags = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save tags",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const success = await saveTags(text, tags, contentId);
      if (success && onTagsGenerated) {
        // Notify parent component of the contentId when tags are saved
        console.log("Tags saved, notifying parent of contentId:", contentId);
        onTagsGenerated(contentId);
      }
    } finally {
      if (isMounted.current) {
        setIsSaving(false);
      }
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
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={handleTagging}
          disabled={isLoading || !text.trim()}
          className="mr-2"
        >
          {isLoading ? "Generating..." : "Suggest Tags"}
        </Button>
        {tags.length > 0 && (
          <Button
            onClick={handleSaveTags}
            disabled={isSaving || tags.length === 0 || !user}
            variant="outline"
          >
            {isSaving ? "Saving..." : (
              <span className="flex items-center gap-1">
                <Save className="h-4 w-4" />
                Save Tags
              </span>
            )}
          </Button>
        )}
      </div>
      {isPending && <div className="text-sm text-muted-foreground mt-2">Processing...</div>}
      <TagList tags={tags} isLoading={isLoading} />
    </div>
  );
}

export default TagPanel;
