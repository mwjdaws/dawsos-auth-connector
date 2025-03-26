
import React from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownPanelProps {
  markdown: string;
  className?: string;
}

const MarkdownPanel: React.FC<MarkdownPanelProps> = ({ markdown, className }) => {
  return (
    <div className={cn("prose prose-slate dark:prose-invert max-w-none", className)}>
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
};

export default MarkdownPanel;
