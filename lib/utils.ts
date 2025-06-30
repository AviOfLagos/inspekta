import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const protocol =
  process.env.NODE_ENV === 'production' ? 'https' : 'http';
export const rootDomain =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Interactive element styles with comprehensive focus and validation states
export const interactiveElementStyles = `
  focus-visible:border-ring 
  focus-visible:ring-ring/50 
  focus-visible:ring-[3px] 
  aria-invalid:ring-destructive/20 
  dark:aria-invalid:ring-destructive/40 
  aria-invalid:border-destructive 
  border 
  bg-background 
  shadow-xs 
  hover:bg-accent 
  hover:text-accent-foreground 
  dark:bg-input/30 
  dark:border-input 
  dark:hover:bg-input/50 
  rounded-lg
`;

// Utility function to apply interactive element styles with custom classes
export function interactiveElement(...additionalClasses: ClassValue[]) {
  return cn(interactiveElementStyles, ...additionalClasses);
}
