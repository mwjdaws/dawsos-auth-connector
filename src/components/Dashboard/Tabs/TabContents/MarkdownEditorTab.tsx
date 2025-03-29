import { Skeleton } from "@/components/ui/skeleton";
import MarkdownEditor from "@/components/MarkdownEditor/MarkdownEditor";
import { Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentVersioning } from "@/hooks/markdown-editor/useDocumentVersioning";

interface MarkdownEditorTabProps {
  contentId: string;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
}

export function MarkdownEditorTab({ 
  contentId, 
  onSaveDraft, 
  onPublish 
}: MarkdownEditorTabProps) {
  const { user } = useAuth();
  const { createVersion } = useDocumentVersioning();
  
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

  const sourceId = contentId && !contentId.startsWith('temp-') ? contentId : undefined;
  const isNewDocument = !sourceId;

  const handleSaveDraft = (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => {
    if (id && !id.startsWith('temp-')) {
      createVersion(id, content, { title, action: "save_draft" });
    }
    
    if (onSaveDraft) {
      onSaveDraft(id, title, content, templateId, externalSourceUrl);
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
          initialExternalSourceUrl=""
          sourceId={sourceId}
          documentId={contentId !== `temp-${Date.now()}` ? contentId : undefined}
          onSaveDraft={handleSaveDraft}
          onPublish={onPublish}
        />
      </Suspense>
    </>
  );
}
