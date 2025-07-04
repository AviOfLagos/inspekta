'use client';

import Image from 'next/image';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { 
  getOptimizedImageUrl, 
  validateImageUrl, 
  generateBlurDataURL,
  getImagePlaceholderColor,
  IMAGE_SIZES,
  type ImageConfig 
} from '@/lib/image-utils';

interface OptimizedImageProps {
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  variant?: keyof typeof IMAGE_SIZES;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  fill = false,
  sizes,
  priority = false,
  quality = 80,
  placeholder = 'blur',
  blurDataURL,
  variant,
  fallback = '/images/placeholder-property.jpg',
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get dimensions from variant if specified
  const dimensions = useMemo(() => {
    if (variant && IMAGE_SIZES[variant]) {
      return IMAGE_SIZES[variant];
    }
    return { width, height, quality };
  }, [variant, width, height, quality]);

  // Validate and optimize image URL
  const imageUrl = useMemo(() => {
    const validUrl = validateImageUrl(imageError ? fallback : src);
    
    if (validUrl === fallback) {
      return validUrl;
    }

    return getOptimizedImageUrl(validUrl, {
      width: dimensions.width,
      height: dimensions.height,
      quality: dimensions.quality || quality,
    });
  }, [src, fallback, imageError, dimensions, quality]);

  // Generate blur placeholder
  const blurPlaceholder = useMemo(() => {
    if (blurDataURL) return blurDataURL;
    if (placeholder === 'empty') return undefined;
    
    return generateBlurDataURL(
      dimensions.width ? Math.min(dimensions.width, 20) : 20,
      dimensions.height ? Math.min(dimensions.height, 20) : 20
    );
  }, [blurDataURL, placeholder, dimensions]);

  // Handle image load
  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
    onError?.();
  };

  // Responsive sizes for better performance
  const responsiveSizes = useMemo(() => {
    if (sizes) return sizes;
    
    if (fill) {
      return '100vw';
    }
    
    if (variant) {
      switch (variant) {
        case 'thumbnail':
        case 'avatarSm':
        case 'avatarMd':
        case 'avatarLg':
          return '(max-width: 768px) 100px, 150px';
        case 'cardSm':
          return '(max-width: 768px) 100vw, 300px';
        case 'cardMd':
          return '(max-width: 768px) 100vw, 400px';
        case 'cardLg':
          return '(max-width: 768px) 100vw, 600px';
        case 'listingCard':
          return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px';
        case 'listingDetail':
          return '(max-width: 768px) 100vw, 800px';
        case 'listingGallery':
          return '(max-width: 768px) 100vw, 1000px';
        case 'heroBanner':
          return '100vw';
        default:
          return '(max-width: 768px) 100vw, 50vw';
      }
    }
    
    return '(max-width: 768px) 100vw, 50vw';
  }, [sizes, fill, variant]);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Loading placeholder */}
      {isLoading && (
        <div 
          className="absolute inset-0 animate-pulse"
          style={{ backgroundColor: getImagePlaceholderColor(imageUrl) }}
        />
      )}
      
      <Image
        src={imageUrl}
        alt={alt}
        width={fill ? undefined : dimensions.width}
        height={fill ? undefined : dimensions.height}
        fill={fill}
        sizes={responsiveSizes}
        priority={priority}
        quality={dimensions.quality || quality}
        placeholder={blurPlaceholder ? 'blur' : 'empty'}
        blurDataURL={blurPlaceholder}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          fill ? 'object-cover' : ''
        )}
        {...props}
      />
      
      {/* Error state */}
      {imageError && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
          <div className="text-center">
            <div className="text-2xl mb-2">🏠</div>
            <div className="text-sm">Image not available</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Property-specific image components
export function PropertyImage({
  src,
  alt,
  className,
  ...props
}: Omit<OptimizedImageProps, 'variant'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      variant="listingCard"
      className={className}
      {...props}
    />
  );
}

export function PropertyGalleryImage({
  src,
  alt,
  className,
  ...props
}: Omit<OptimizedImageProps, 'variant'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      variant="listingGallery"
      className={className}
      {...props}
    />
  );
}

export function PropertyDetailImage({
  src,
  alt,
  className,
  ...props
}: Omit<OptimizedImageProps, 'variant'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      variant="listingDetail"
      className={className}
      {...props}
    />
  );
}

export function UserAvatar({
  src,
  alt,
  size = 'md',
  className,
  ...props
}: Omit<OptimizedImageProps, 'variant'> & {
  size?: 'sm' | 'md' | 'lg';
}) {
  const variant = `avatar${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof IMAGE_SIZES;
  
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      variant={variant}
      className={cn('rounded-full', className)}
      {...props}
    />
  );
}