
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { KnowledgeTemplate } from "@/services/api/types";

interface TemplatePreviewCardProps {
  selectedTemplate: KnowledgeTemplate | null;
}

export function TemplatePreviewCard({ selectedTemplate }: TemplatePreviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Selected Template</CardTitle>
        <CardDescription>
          Preview of the currently selected template
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectedTemplate ? (
          <div className="space-y-2">
            <div className="bg-muted p-2 rounded flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              <span className="font-medium">{selectedTemplate.name}</span>
            </div>
            <div className="max-h-[200px] overflow-y-auto p-3 border rounded-md text-sm font-mono">
              {selectedTemplate.content.slice(0, 200)}
              {selectedTemplate.content.length > 200 && '...'}
            </div>
          </div>
        ) : (
          <div className="text-center p-6 text-muted-foreground">
            <FileText size={48} className="mx-auto mb-2 opacity-30" />
            <p>Select a template to preview</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
