/**
 * Simple in-memory cache with TTL support for API responses
 */

interface CacheItem<T = any> {
  data: T;
  expires: number;
  created: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  size: number;
}

class MemoryCache {
  private cache = new Map<string, CacheItem>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    size: 0,
  };
  
  // Default TTL in milliseconds (5 minutes)
  private defaultTTL = 5 * 60 * 1000;
  
  // Maximum cache size (number of items)
  private maxSize = 1000;

  /**
   * Get item from cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      return null;
    }
    
    // Check if item has expired
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.deletes++;
      return null;
    }
    
    this.stats.hits++;
    return item.data;
  }

  /**
   * Set item in cache with optional TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expireTime = now + (ttl || this.defaultTTL);
    
    // If cache is at max size, remove oldest item
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictOldest();
    }
    
    this.cache.set(key, {
      data,
      expires: expireTime,
      created: now,
    });
    
    this.stats.sets++;
    this.stats.size = this.cache.size;
  }

  /**
   * Delete item from cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.stats.deletes++;
      this.stats.size = this.cache.size;
    }
    return deleted;
  }

  /**
   * Clear all items from cache
   */
  clear(): void {
    this.cache.clear();
    this.stats.deletes += this.stats.size;
    this.stats.size = 0;
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Get or set pattern - if key exists return it, otherwise compute and cache
   */
  async getOrSet<T>(
    key: string, 
    computeFn: () => Promise<T> | T, 
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }
    
    const data = await computeFn();
    this.set(key, data, ttl);
    return data;
  }

  /**
   * Evict oldest item from cache
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;
    
    for (const [key, item] of this.cache.entries()) {
      if (item.created < oldestTime) {
        oldestTime = item.created;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Get cache hit rate
   */
  getHitRate(): number {
    const total = this.stats.hits + this.stats.misses;
    return total === 0 ? 0 : this.stats.hits / total;
  }

  /**
   * Clean up expired items
   */
  cleanup(): number {
    const now = Date.now();
    let removed = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
        removed++;
      }
    }
    
    this.stats.deletes += removed;
    this.stats.size = this.cache.size;
    
    return removed;
  }

  /**
   * Get all keys in cache
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }
}

// Create singleton cache instance
export const cache = new MemoryCache();

// Cache key generators for consistent naming
export const cacheKeys = {
  listings: (params: Record<string, any> = {}) => {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    return `listings:${sortedParams}`;
  },
  
  listing: (id: string) => `listing:${id}`,
  
  user: (id: string) => `user:${id}`,
  
  agent: (id: string) => `agent:${id}`,
  
  agentListings: (agentId: string, params: Record<string, any> = {}) => {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    return `agent:${agentId}:listings:${sortedParams}`;
  },
  
  inspections: (params: Record<string, any> = {}) => {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    return `inspections:${sortedParams}`;
  },
  
  userNotifications: (userId: string) => `notifications:${userId}`,
} as const;

// Cache TTL presets (in milliseconds)
export const cacheTTL = {
  short: 2 * 60 * 1000,      // 2 minutes
  medium: 5 * 60 * 1000,     // 5 minutes
  long: 15 * 60 * 1000,      // 15 minutes
  veryLong: 60 * 60 * 1000,  // 1 hour
} as const;

// Start cleanup interval (every 5 minutes)
if (typeof window === 'undefined') {
  setInterval(() => {
    const removed = cache.cleanup();
    if (removed > 0) {
      console.log(`Cache cleanup: removed ${removed} expired items`);
    }
  }, 5 * 60 * 1000);
}

// Utility function to invalidate related cache entries
export function invalidateCache(pattern: string): number {
  const keys = cache.keys();
  let removed = 0;
  
  for (const key of keys) {
    if (key.includes(pattern)) {
      cache.delete(key);
      removed++;
    }
  }
  
  return removed;
}

// React hook for cache statistics (for debugging)
export function useCacheStats() {
  if (typeof window === 'undefined') {
    return {
      stats: cache.getStats(),
      hitRate: cache.getHitRate(),
      size: cache.size(),
    };
  }
  
  return {
    stats: cache.getStats(),
    hitRate: cache.getHitRate(),
    size: cache.size(),
  };
}