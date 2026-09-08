import React, { useState, useEffect } from 'react';
import { getOptimizedImageUrl, generateSrcSet, ImageOptimizationOptions } from '../utils/imageUtils';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  width?: number; // Target width for dynamic image compression
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none';
  aspectRatio?: string;
  fallbackSymbol?: string;
  containerStyle?: React.CSSProperties;
  imgClassName?: string;
  imageOptimizationOptions?: ImageOptimizationOptions;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  loading = 'lazy',
  fetchPriority,
  objectFit = 'cover',
  aspectRatio,
  fallbackSymbol = '🌶️',
  className = '',
  imgClassName = '',
  style,
  containerStyle,
  sizes,
  onLoad,
  onError,
  imageOptimizationOptions,
  ...restProps
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reset state if source changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const optimizedSrc = getOptimizedImageUrl(src, { width, ...imageOptimizationOptions });
  const srcSet = generateSrcSet(src);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    if (onError) onError(e);
  };

  if (!src || hasError) {
    return (
      <div
        className={`optimized-image-fallback ${className}`}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '60px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FCFBF8',
          borderRadius: '8px',
          userSelect: 'none',
          color: '#B45309',
          padding: '12px',
          aspectRatio,
          ...containerStyle,
        }}
      >
        <span style={{ fontSize: '28px', lineHeight: 1 }}>{fallbackSymbol}</span>
        <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>
          Laybhari
        </span>
      </div>
    );
  }

  return (
    <div
      className={`optimized-image-wrapper ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        aspectRatio,
        ...containerStyle,
      }}
    >
      {/* Lightweight Shimmer/Skeleton Pulse while loading */}
      {!isLoaded && (
        <div
          className="optimized-image-skeleton"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(250, 245, 239, 0.4)',
            backgroundImage: 'linear-gradient(90deg, rgba(250, 245, 239, 0.2) 0%, rgba(243, 236, 226, 0.6) 50%, rgba(250, 245, 239, 0.2) 100%)',
            backgroundSize: '200% 100%',
            animation: 'skeletonPulse 1.5s infinite ease-in-out',
            zIndex: 1,
          }}
        />
      )}

      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={loading}
        decoding="async"
        // @ts-ignore fetchpriority is standard HTML but typed as fetchPriority in React 19
        fetchpriority={fetchPriority}
        onLoad={handleLoad}
        onError={handleError}
        className={imgClassName}
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 250ms cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'block',
          borderRadius: 'inherit',
          ...style,
        }}
        {...restProps}
      />
    </div>
  );
};
