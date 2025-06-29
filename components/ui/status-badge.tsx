import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: 'ACTIVE' | 'PENDING' | 'SOLD' | 'RENTED' | string;
  variant?: 'default' | 'outline';
  className?: string;
}

const statusStyles = {
  ACTIVE: "bg-green-500/10 text-green-700 border-green-200 dark:text-green-400 dark:border-green-800",
  PENDING: "bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:text-yellow-400 dark:border-yellow-800", 
  SOLD: "bg-red-500/10 text-red-700 border-red-200 dark:text-red-400 dark:border-red-800",
  RENTED: "bg-primary/10 text-primary border-primary/20 dark:text-primary dark:border-primary/30",
  default: "bg-muted text-muted-foreground"
} as const;

export function StatusBadge({ status, variant = "default", className }: StatusBadgeProps) {
  const statusKey = status.toUpperCase() as keyof typeof statusStyles;
  const statusStyle = statusStyles[statusKey] || statusStyles.default;
  
  return (
    <Badge 
      variant={variant}
      className={cn(
        statusStyle,
        variant === "outline" && "border",
        className
      )}
    >
      {status}
    </Badge>
  );
}