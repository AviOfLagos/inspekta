/**
 * Image optimization utilities for the Inspekta platform
 */

export interface ImageConfig {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
  blur?: boolean;
}

/**
 * Generate optimized image URL with size and quality parameters
 */
export function getOptimizedImageUrl(
  originalUrl: string, 
  config: ImageConfig = {}
): string {
  const { width, height, quality = 80, format = 'webp' } = config;
  
  // Handle Unsplash URLs with optimization parameters
  if (originalUrl.includes('images.unsplash.com')) {
    const url = new URL(originalUrl);
    
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    
    // Unsplash specific optimizations
    url.searchParams.set('auto', 'format,compress');
    url.searchParams.set('q', quality.toString());
    url.searchParams.set('fit', 'crop');
    
    return url.toString();
  }
  
  // Handle Cloudinary URLs
  if (originalUrl.includes('res.cloudinary.com')) {
    // Inject transformation parameters into Cloudinary URL
    const parts = originalUrl.split('/upload/');
    if (parts.length === 2) {
      const transformations = [];
      
      if (width) transformations.push(`w_${width}`);
      if (height) transformations.push(`h_${height}`);
      transformations.push(`q_${quality}`);
      transformations.push(`f_${format}`);
      transformations.push('c_fill');
      
      return `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`;
    }
  }
  
  // For other URLs, return as-is (they'll be processed by Next.js Image)
  return originalUrl;
}

/**
 * Generate multiple image sizes for responsive images
 */
export function generateImageSrcSet(
  originalUrl: string,
  sizes: number[] = [320, 640, 768, 1024, 1280]
): string {
  return sizes
    .map(size => {
      const optimizedUrl = getOptimizedImageUrl(originalUrl, { 
        width: size,
        quality: size > 1024 ? 75 : 80 
      });
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
}

/**
 * Get image dimensions based on usage context
 */
export const IMAGE_SIZES = {
  // Thumbnail sizes
  thumbnail: { width: 150, height: 150, quality: 80 },
  avatarSm: { width: 32, height: 32, quality: 90 },
  avatarMd: { width: 64, height: 64, quality: 90 },
  avatarLg: { width: 128, height: 128, quality: 90 },
  
  // Card sizes
  cardSm: { width: 300, height: 200, quality: 80 },
  cardMd: { width: 400, height: 300, quality: 80 },
  cardLg: { width: 600, height: 400, quality: 75 },
  
  // Gallery sizes
  galleryThumb: { width: 200, height: 150, quality: 85 },
  galleryMd: { width: 800, height: 600, quality: 75 },
  galleryLg: { width: 1200, height: 900, quality: 70 },
  
  // Hero/Banner sizes
  heroBanner: { width: 1920, height: 600, quality: 70 },
  listingHero: { width: 1200, height: 400, quality: 75 },
  
  // Property listing specific
  listingCard: { width: 400, height: 250, quality: 80 },
  listingDetail: { width: 800, height: 500, quality: 75 },
  listingGallery: { width: 1000, height: 600, quality: 75 },
} as const;

/**
 * Validate image URL and return fallback if needed
 */
export function validateImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') {
    return '/images/placeholder-property.jpg';
  }
  
  // Check if URL is valid
  try {
    new URL(url);
    return url;
  } catch {
    return '/images/placeholder-property.jpg';
  }
}

/**
 * Generate blur data URL for better loading experience
 */
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = typeof window !== 'undefined' ? document.createElement('canvas') : null;
  
  if (!canvas) {
    // Fallback for server-side
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
  }
  
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // Create a simple gradient blur
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL('image/jpeg', 0.1);
}

/**
 * Extract dominant color from image URL (simplified version)
 */
export function getImagePlaceholderColor(url: string): string {
  // Simple hash-based color generation for consistent placeholders
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Generate a muted color
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 20%, 90%)`;
}

/**
 * Preload critical images for better performance
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Lazy load images with intersection observer
 */
export function setupLazyLoading(
  elements: NodeListOf<HTMLImageElement> | HTMLImageElement[],
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;
        
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  }, defaultOptions);
  
  elements.forEach((el) => observer.observe(el));
  
  return observer;
}