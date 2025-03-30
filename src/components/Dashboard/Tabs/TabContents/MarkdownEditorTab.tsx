
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import MarkdownEditor from "@/components/MarkdownEditor/MarkdownEditor";

interface MarkdownEditorTabProps {
  contentId: string;
  onSaveDraft: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
}

export function MarkdownEditorTab({ 
  contentId,
  onSaveDraft,
  onPublish
}: MarkdownEditorTabProps) {
  // Bridge for externalSourceUrl compatibility
  const handleSaveDraft = (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string = "") => {
    onSaveDraft(id, title, content, templateId, externalSourceUrl);
  };

  const handlePublish = (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string = "") => {
    onPublish(id, title, content, templateId, externalSourceUrl);
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Markdown Editor</h2>
      <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-lg" />}>
        <MarkdownEditor 
          initialTitle="Draft Document"
          initialContent="# Start writing your content here"
          initialTemplateId={null}
          initialExternalSourceUrl=""
          sourceId={contentId !== `temp-${Date.now()}` ? contentId : null}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
        />
      </Suspense>
    </>
  );
}
