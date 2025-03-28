
import React from "react";
import { ChevronRight, ChevronDown, AlertTriangle } from "lucide-react";

interface CollapsibleHeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  needsExternalReview: boolean;
}

export function CollapsibleHeader({
  isCollapsed,
  setIsCollapsed,
  needsExternalReview
}: CollapsibleHeaderProps) {
  return (
    <div className="p-4 border-b">
      <button
        className="flex w-full items-center justify-between"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Metadata</h2>
          {needsExternalReview && (
            <div className="flex items-center text-yellow-600 dark:text-yellow-500">
              <AlertTriangle className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">Needs Review</span>
            </div>
          )}
        </div>
        {isCollapsed ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
