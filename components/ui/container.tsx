import * as React from "react"
import { cn } from "@/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const containerSizes = {
  sm: "max-w-3xl",
  md: "max-w-4xl", 
  lg: "max-w-7xl",
  xl: "max-w-none",
  full: "max-w-none"
} as const;

export function Container({ 
  className, 
  size = 'lg',
  children,
  ...props 
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8",
        containerSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}