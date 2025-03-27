
import { useState } from "react";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

// Sample markdown content for demonstration with wikilinks
const sampleMarkdown = `# Markdown Viewer Example

This is a demonstration of the **MarkdownViewer** component with various Markdown elements:

## Features

- Renders Markdown content
- Displays associated metadata
- Supports editing metadata when in edit mode
- Handles [[wikilinks]] for special navigation

### Code Example

\`\`\`typescript
function greeting(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`

> This is a blockquote that demonstrates the styling capabilities.

Visit the [[documentation]] for more information about using this component.
`;

const MarkdownViewerPage = () => {
  const [editable, setEditable] = useState(true);
  const contentId = "sample-123"; // In a real app, this would be dynamic
  
  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Markdown Viewer Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4" />
            <AlertTitle>Wikilinks Support</AlertTitle>
            <AlertDescription>
              This markdown viewer supports [[wikilinks]] syntax. Try clicking on the wikilinks in the example below.
            </AlertDescription>
          </Alert>
          
          <div className="flex items-center space-x-2 mb-6">
            <Switch 
              id="edit-mode"
              checked={editable}
              onCheckedChange={setEditable}
            />
            <Label htmlFor="edit-mode">
              {editable ? "Edit Mode (Metadata is editable)" : "View Mode (Read-only)"}
            </Label>
          </div>
          
          <MarkdownViewer 
            content={sampleMarkdown} 
            contentId={contentId}
            editable={editable}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MarkdownViewerPage;
