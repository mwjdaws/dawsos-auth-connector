
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

  // Map our custom variants to badge variants that are supported
  const getBadgeVariant = () => {
    switch (variant) {
      case "primary":
        return "default"; // Map "primary" to "default" which is supported
      case "secondary":
        return "secondary";
      case "outline":
        return "outline";
      default:
        return "secondary"; // Default fallback
    }
  };

  return (
    <Badge 
      variant={getBadgeVariant()} 
      className={cn(
        "cursor-pointer hover:opacity-80 transition-opacity",
        variant === "related" && "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
        variant === "suggested" && "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
        variant === "outline" && "bg-background text-foreground border-muted-foreground/20",
        variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/80"
      )}
      onClick={handleClick}
    >
      {tag}
    </Badge>
  );
}
