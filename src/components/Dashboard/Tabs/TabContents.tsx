
import React from "react";

export interface TabContentsProps {
  contentId: string;
  children: React.ReactNode;
}

export function TabContents({ contentId, children }: TabContentsProps) {
  return (
    <div className="p-4 border rounded-md">
      {children}
    </div>
  );
}
