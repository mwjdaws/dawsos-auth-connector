
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagPillProps {
  tag: string;
  onClick?: (tag: string) => void;
  variant?: "secondary" | "primary" | "related" | "suggested" | "outline";
}

export function TagPill({ 
  tag, 
  onClick,
  variant = "secondary" 
}: TagPillProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(tag);
    }
  };

  return (
    <Badge 
      variant={variant} 
      className={cn(
        "cursor-pointer hover:opacity-80 transition-opacity",
        variant === "related" && "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
        variant === "suggested" && "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
        variant === "outline" && "bg-background text-foreground border-muted-foreground/20"
      )}
      onClick={handleClick}
    >
      {tag}
    </Badge>
  );
}
