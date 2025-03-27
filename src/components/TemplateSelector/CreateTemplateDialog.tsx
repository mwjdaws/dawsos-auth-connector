
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NewTemplateForm } from "./types";

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newTemplate: NewTemplateForm;
  onNewTemplateChange: (template: NewTemplateForm) => void;
  onSave: () => void;
  loading: boolean;
}

export const CreateTemplateDialog = ({
  open,
  onOpenChange,
  newTemplate,
  onNewTemplateChange,
  onSave,
  loading
}: CreateTemplateDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
          <DialogDescription>
            Create a custom template for reuse in future knowledge sources.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="template-name" className="text-sm font-medium">
              Template Name
            </label>
            <Input
              id="template-name"
              placeholder="e.g., Meeting Notes, Project Plan"
              value={newTemplate.name}
              onChange={(e) => onNewTemplateChange({ 
                ...newTemplate, 
                name: e.target.value 
              })}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="template-content" className="text-sm font-medium">
              Template Content
            </label>
            <Textarea
              id="template-content"
              placeholder="# Title
## Section 1
Content goes here...

## Section 2
More content..."
              rows={10}
              value={newTemplate.content}
              onChange={(e) => onNewTemplateChange({ 
                ...newTemplate, 
                content: e.target.value 
              })}
              className="font-mono text-sm"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={loading}>
            Save Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
