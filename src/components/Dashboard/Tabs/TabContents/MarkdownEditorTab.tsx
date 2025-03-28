import { Skeleton } from "@/components/ui/skeleton";
import MarkdownEditor from "@/components/MarkdownEditor/MarkdownEditor";
import { Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentVersioning } from "@/hooks/markdown-editor/useDocumentVersioning";

interface MarkdownEditorTabProps {
  contentId: string;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null) => void;
}

export function MarkdownEditorTab({ 
  contentId, 
  onSaveDraft, 
  onPublish 
}: MarkdownEditorTabProps) {
  const { user } = useAuth();
  const { createVersion } = useDocumentVersioning();
  
  // Sample data - keeping the same as original
  const sampleMarkdown = `# Sample Markdown
  
This is an example of markdown content with metadata displayed above.

## Features
- Renders markdown content
- Displays metadata like tags and ontology terms
- Supports additional custom metadata fields
  
> This is a blockquote that demonstrates markdown rendering capabilities.

### Code Example
\`\`\`typescript
const greeting = "Hello World";
console.log(greeting);
\`\`\`
`;

  // Use the contentId as sourceId if it's not a temporary ID
  const sourceId = contentId && !contentId.startsWith('temp-') ? contentId : undefined;
  const isNewDocument = !sourceId;

  // Create a wrapper for onSaveDraft to properly handle version creation
  const handleSaveDraft = (id: string, title: string, content: string, templateId: string | null) => {
    // Create a version if this is an existing document
    if (id && !id.startsWith('temp-')) {
      createVersion(id, content, { title, action: "save_draft" });
    }
    
    // Call the original onSaveDraft handler
    if (onSaveDraft) {
      onSaveDraft(id, title, content, templateId);
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Markdown Editor</h2>
      <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-lg" />}>
        <MarkdownEditor 
          initialTitle={isNewDocument ? "Draft Document" : ""}
          initialContent={isNewDocument ? sampleMarkdown : ""}
          initialTemplateId={null}
          sourceId={sourceId}
          documentId={contentId !== `temp-${Date.now()}` ? contentId : undefined}
          onSaveDraft={handleSaveDraft}
          onPublish={onPublish}
        />
      </Suspense>
    </>
  );
}
