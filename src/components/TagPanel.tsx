
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function TagPanel() {
  const [text, setText] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleTagging = async () => {
    const res = await fetch("/api/tagger", {
      method: "POST",
      body: JSON.stringify({ content: text }),
    });
    const data = await res.json();
    setTags(data.tags || []);
  };

  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste content here..." />
      <Button onClick={handleTagging}>Suggest Tags</Button>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="px-2 py-1 bg-blue-100 rounded-xl text-sm">{tag}</span>
        ))}
      </div>
    </div>
  );
}

export default TagPanel;
