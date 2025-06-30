import { forwardRef } from 'react';
import { cn, interactiveElement } from '@/lib/utils';

interface InteractiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isInvalid?: boolean;
}

const InteractiveButton = forwardRef<HTMLButtonElement, InteractiveButtonProps>(
  ({ className, variant = 'default', size = 'md', isInvalid, children, ...props }, ref) => {
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const variantStyles = {
      default: '',
      destructive: 'text-destructive-foreground bg-destructive hover:bg-destructive/90',
      ghost: 'bg-transparent border-transparent',
    };

    return (
      <button
        ref={ref}
        className={cn(
          // Use the interactive element styles
          interactiveElement(),
          // Add size-specific styles
          sizeStyles[size],
          // Add variant-specific styles
          variantStyles[variant],
          // Custom additional classes
          className
        )}
        aria-invalid={isInvalid}
        {...props}
      >
        {children}
      </button>
    );
  }
);

InteractiveButton.displayName = 'InteractiveButton';

export { InteractiveButton };