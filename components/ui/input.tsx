import * as React from "react"

import { cn, interactiveElement } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  variant?: 'default' | 'interactive';
}

function Input({ className, type, variant = 'default', ...props }: InputProps) {
  const baseStyles = "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-10 w-full min-w-0 px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";
  
  if (variant === 'interactive') {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          baseStyles,
          interactiveElement(),
          className
        )}
        {...props}
      />
    );
  }

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        baseStyles,
        "dark:bg-input/30 border-input rounded-md border bg-transparent shadow-xs",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
