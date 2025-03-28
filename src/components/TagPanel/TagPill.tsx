
import React from "react";

interface TagPillProps {
  tag: string;
  onClick: (tag: string) => void;
  variant?: "primary" | "related" | "suggested";
  className?: string;
}

export function TagPill({ 
  tag, 
  onClick, 
  variant = "primary",
  className = "" 
}: TagPillProps) {
  // Map variants to color classes
  const variantClasses = {
    primary: "bg-blue-100 hover:bg-blue-200",
    related: "bg-green-100 hover:bg-green-200",
    suggested: "bg-purple-100 hover:bg-purple-200"
  };

  const baseClasses = "px-2 py-1 rounded-xl text-sm cursor-pointer transition-colors";
  const colorClasses = variantClasses[variant];

  return (
    <span
      className={`${baseClasses} ${colorClasses} ${className}`}
      onClick={() => onClick(tag)}
      role="button"
      tabIndex={0}
      aria-label={`Tag: ${tag}. Click to filter or navigate.`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick(tag);
        }
      }}
    >
      {tag}
    </span>
  );
}
