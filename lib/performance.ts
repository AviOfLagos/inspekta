/**
 * Performance monitoring and optimization utilities
 */

// Performance metrics interface
export interface PerformanceMetrics {
  timestamp: number;
  route: string;
  method: string;
  duration: number;
  status: number;
  cached?: boolean;
  userId?: string;
}

// Simple performance tracker
class PerformanceTracker {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 1000; // Keep last 1000 metrics

  track(metric: PerformanceMetrics) {
    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log slow requests
    if (metric.duration > 1000) {
      console.warn(`Slow request: ${metric.method} ${metric.route} took ${metric.duration}ms`);
    }
  }

  getStats(timeWindowMs: number = 5 * 60 * 1000) {
    const now = Date.now();
    const recent = this.metrics.filter(m => (now - m.timestamp) < timeWindowMs);
    
    if (recent.length === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        cacheHitRate: 0,
        slowRequests: 0,
        errorRate: 0,
      };
    }

    const totalRequests = recent.length;
    const averageResponseTime = recent.reduce((sum, m) => sum + m.duration, 0) / totalRequests;
    const cachedRequests = recent.filter(m => m.cached).length;
    const cacheHitRate = cachedRequests / totalRequests;
    const slowRequests = recent.filter(m => m.duration > 1000).length;
    const errorRequests = recent.filter(m => m.status >= 400).length;
    const errorRate = errorRequests / totalRequests;

    return {
      totalRequests,
      averageResponseTime: Math.round(averageResponseTime),
      cacheHitRate: Math.round(cacheHitRate * 100),
      slowRequests,
      errorRate: Math.round(errorRate * 100),
    };
  }

  getSlowRoutes(limit: number = 10) {
    const routeStats = new Map<string, { count: number; totalTime: number; maxTime: number }>();
    
    this.metrics.forEach(metric => {
      const key = `${metric.method} ${metric.route}`;
      const current = routeStats.get(key) || { count: 0, totalTime: 0, maxTime: 0 };
      
      current.count++;
      current.totalTime += metric.duration;
      current.maxTime = Math.max(current.maxTime, metric.duration);
      
      routeStats.set(key, current);
    });

    return Array.from(routeStats.entries())
      .map(([route, stats]) => ({
        route,
        averageTime: Math.round(stats.totalTime / stats.count),
        maxTime: stats.maxTime,
        count: stats.count,
      }))
      .sort((a, b) => b.averageTime - a.averageTime)
      .slice(0, limit);
  }
}

export const performanceTracker = new PerformanceTracker();

// High-order function to measure API route performance
export function withPerformanceTracking(
  handler: (req: Request, context?: any) => Promise<Response>,
  route: string
) {
  return async (req: Request, context?: any): Promise<Response> => {
    const start = performance.now();
    const method = req.method;
    
    try {
      const response = await handler(req, context);
      const duration = performance.now() - start;
      
      performanceTracker.track({
        timestamp: Date.now(),
        route,
        method,
        duration,
        status: response.status,
        cached: response.headers.get('X-Cache') === 'HIT',
      });
      
      // Add performance headers
      response.headers.set('X-Response-Time', `${Math.round(duration)}ms`);
      
      return response;
    } catch (error) {
      const duration = performance.now() - start;
      
      performanceTracker.track({
        timestamp: Date.now(),
        route,
        method,
        duration,
        status: 500,
      });
      
      throw error;
    }
  };
}

// Bundle analysis helper
export function getBundleInfo() {
  if (typeof window === 'undefined') return null;
  
  return {
    userAgent: navigator.userAgent,
    connectionType: (navigator as any).connection?.effectiveType || 'unknown',
    hardwareConcurrency: navigator.hardwareConcurrency || 1,
    deviceMemory: (navigator as any).deviceMemory || 'unknown',
    platform: navigator.platform,
  };
}

// Core Web Vitals tracking
export function trackWebVitals() {
  if (typeof window === 'undefined') return;

  // Track First Contentful Paint
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
        console.log('FCP:', entry.startTime);
      }
      
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('LCP:', entry.startTime);
      }
      
      if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
        console.log('CLS:', (entry as any).value);
      }
    }
  });

  try {
    observer.observe({ type: 'paint', buffered: true });
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
    observer.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    // Some browsers might not support all entry types
    console.warn('Performance observer not fully supported:', e);
  }
}

// Resource loading optimization
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return;

  // Preload critical images
  const criticalImages = [
    '/images/logo.png',
    '/images/placeholder-property.jpg',
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// Memory usage monitoring
export function getMemoryUsage() {
  if (typeof window === 'undefined' || !(performance as any).memory) {
    return null;
  }

  const memory = (performance as any).memory;
  return {
    used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
    total: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
    limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024), // MB
  };
}

// Request timing helper
export function measureApiCall<T>(
  apiCall: () => Promise<T>,
  name: string
): Promise<T & { _timing?: number }> {
  const start = performance.now();
  
  return apiCall().then(result => {
    const duration = performance.now() - start;
    console.log(`API Call ${name}: ${Math.round(duration)}ms`);
    
    // Add timing to result if it's an object
    if (typeof result === 'object' && result !== null) {
      return { ...result, _timing: Math.round(duration) } as T & { _timing?: number };
    }
    
    return result as T & { _timing?: number };
  });
}

// Debounced function for search optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function for scroll/resize events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Lazy loading utility
export function lazyLoad<T>(
  importFn: () => Promise<T>,
  delay: number = 0
): Promise<T> {
  return new Promise(resolve => {
    setTimeout(async () => {
      const module = await importFn();
      resolve(module);
    }, delay);
  });
}

// Critical CSS inlining helper (for build time)
export function shouldInlineCriticalCSS(route: string): boolean {
  const criticalRoutes = ['/', '/listings', '/agents'];
  return criticalRoutes.includes(route);
}