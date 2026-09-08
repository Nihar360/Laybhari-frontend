/**
 * Image optimization utilities for Laybhari Web application.
 * Automatically transforms Cloudinary, Imgix, Unsplash, and remote image URLs
 * to serve compressed WebP/AVIF images tailored for mobile and desktop screens.
 */

export interface ImageOptimizationOptions {
  width?: number;
  quality?: number | 'auto';
  format?: 'auto' | 'webp' | 'avif' | 'jpg';
  crop?: 'limit' | 'fill' | 'fit' | 'scale' | 'thumb';
}

/**
 * Transforms an image URL to serve an optimized version based on target width and device quality settings.
 */
export function getOptimizedImageUrl(
  url: string | undefined | null,
  options: ImageOptimizationOptions = {}
): string {
  if (!url || typeof url !== 'string') return '';

  const {
    width,
    quality = 'auto',
    format = 'auto',
    crop = 'limit',
  } = options;

  const cleanUrl = url.trim();

  // 1. Cloudinary Transformation Logic
  if (cleanUrl.includes('cloudinary.com') || cleanUrl.includes('/upload/')) {
    // Insert transformation string into Cloudinary URL after '/upload/'
    const uploadIndex = cleanUrl.indexOf('/upload/');
    if (uploadIndex !== -1) {
      const transformParams: string[] = [`f_${format}`, `q_${quality}`];
      if (width && width > 0) {
        transformParams.push(`w_${width}`);
        transformParams.push(`c_${crop}`);
      }

      const transformStr = transformParams.join(',');

      // Prevent duplicate transformations if already transformed
      const prefix = cleanUrl.substring(0, uploadIndex + 8);
      const rest = cleanUrl.substring(uploadIndex + 8);

      if (rest.startsWith('f_') || rest.startsWith('w_') || rest.startsWith('q_')) {
        // Already transformed, replace existing parameters or return clean URL
        return cleanUrl;
      }

      return `${prefix}${transformStr}/${rest}`;
    }
  }

  // 2. Unsplash / Imgix URL Transformation Logic
  if (cleanUrl.includes('images.unsplash.com') || cleanUrl.includes('imgix.net')) {
    try {
      const urlObj = new URL(cleanUrl);
      if (width) urlObj.searchParams.set('w', width.toString());
      urlObj.searchParams.set('q', typeof quality === 'number' ? quality.toString() : '80');
      urlObj.searchParams.set('auto', 'format,compress');
      return urlObj.toString();
    } catch {
      return cleanUrl;
    }
  }

  return cleanUrl;
}

/**
 * Generates dynamic srcset string for Cloudinary or compatible image CDNs.
 */
export function generateSrcSet(
  url: string | undefined | null,
  widths: number[] = [300, 600, 900, 1200]
): string | undefined {
  if (!url || typeof url !== 'string') return undefined;

  const cleanUrl = url.trim();
  if (cleanUrl.includes('cloudinary.com') || cleanUrl.includes('/upload/')) {
    return widths
      .map((w) => {
        const optimizedUrl = getOptimizedImageUrl(cleanUrl, { width: w });
        return `${optimizedUrl} ${w}w`;
      })
      .join(', ');
  }

  return undefined;
}

/**
 * Standard responsive sizes attribute helper for e-commerce layouts.
 */
export function getDefaultSizes(type: 'card' | 'hero' | 'thumbnail' | 'detail'): string {
  switch (type) {
    case 'card':
      return '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw';
    case 'hero':
      return '100vw';
    case 'thumbnail':
      return '80px';
    case 'detail':
      return '(max-width: 768px) 100vw, 50vw';
    default:
      return '100vw';
  }
}
