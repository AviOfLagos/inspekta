import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'default' | 'muted' | 'accent';
}

const sectionSizes = {
  sm: "py-12",
  md: "py-16", 
  lg: "py-20",
  xl: "py-24"
} as const;

const sectionBackgrounds = {
  default: "bg-background",
  muted: "bg-muted/30",
  accent: "bg-primary text-primary-foreground"
} as const;

export function Section({ 
  className, 
  size = 'md',
  background = 'default',
  children,
  ...props 
}: SectionProps) {
  return (
    <section
      className={cn(
        sectionSizes[size],
        sectionBackgrounds[background],
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}