"use client";

import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactElement;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((props: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...props, id };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter(toast => toast.id !== id));
    }, 5000);
    
    return {
      id,
      dismiss: () => setToasts((prev) => prev.filter(toast => toast.id !== id)),
      update: (props: Partial<Toast>) => {
        setToasts((prev) => prev.map(toast => 
          toast.id === id ? { ...toast, ...props } : toast
        ));
      }
    };
  }, []);

  const dismiss = useCallback((toastId?: string) => {
    setToasts((prev) => 
      toastId ? prev.filter(toast => toast.id !== toastId) : []
    );
  }, []);

  return {
    toasts,
    toast,
    dismiss,
  };
}