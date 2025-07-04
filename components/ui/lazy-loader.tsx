'use client';

import { Suspense, lazy, ComponentType, ReactNode, useState, useEffect, useRef, RefObject } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyLoaderProps {
  children: ReactNode;
  fallback?: ReactNode;
  delay?: number;
}

// Generic lazy loader component
export function LazyLoader({ children, fallback, delay = 0 }: LazyLoaderProps) {
  const LoadingFallback = fallback || <ComponentSkeleton />;
  
  return (
    <Suspense fallback={LoadingFallback}>
      {delay > 0 ? <DelayedComponent delay={delay}>{children}</DelayedComponent> : children}
    </Suspense>
  );
}

// Delayed component wrapper
function DelayedComponent({ children, delay }: { children: ReactNode; delay: number }) {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  return show ? <>{children}</> : <ComponentSkeleton />;
}

// Default component skeleton
function ComponentSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}

// Property card skeleton
export function PropertyCardSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}

// Navigation skeleton
export function NavigationSkeleton() {
  return (
    <div className="flex items-center justify-between p-4">
      <Skeleton className="h-8 w-32" />
      <div className="flex space-x-4">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

// User profile skeleton
export function UserProfileSkeleton() {
  return (
    <div className="flex items-center space-x-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

// HOC for lazy loading components
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode,
  delay?: number
) {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }));
  
  return function WrappedComponent(props: P) {
    return (
      <LazyLoader fallback={fallback} delay={delay}>
        <LazyComponent {...props} />
      </LazyLoader>
    );
  };
}

// Intersection observer hook for lazy loading
export function useIntersectionObserver(
  elementRef: RefObject<HTMLDivElement | null>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
        ...options,
      }
    );
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [elementRef, options]);
  
  return isIntersecting;
}

// Lazy loading container
export function LazyContainer({
  children,
  className,
  fallback = <ComponentSkeleton />,
  rootMargin = '50px',
}: {
  children: ReactNode;
  className?: string;
  fallback?: ReactNode;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(ref, { rootMargin });
  
  return (
    <div ref={ref} className={className}>
      {isIntersecting ? children : fallback}
    </div>
  );
}

// Virtualized list for large datasets

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  overscan?: number;
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className,
  overscan = 5,
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    items.length - 1
  );
  
  const start = Math.max(0, visibleStart - overscan);
  const end = Math.min(items.length - 1, visibleEnd + overscan);
  
  const visibleItems = [];
  for (let i = start; i <= end; i++) {
    visibleItems.push({
      index: i,
      item: items[i],
    });
  }
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };
  
  return (
    <div
      ref={scrollElementRef}
      className={className}
      style={{ height: containerHeight, overflowY: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map(({ index, item }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: index * itemHeight,
              height: itemHeight,
              width: '100%',
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Progressive enhancement wrapper
export function ProgressiveEnhancement({
  children,
  fallback,
  condition = true,
}: {
  children: ReactNode;
  fallback: ReactNode;
  condition?: boolean;
}) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient || !condition) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}