import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';
import { getDefaultSizes } from '../utils/imageUtils';

interface Slide {
  id: number;
  image: string;
  alt: string;
  title?: string;
  subtitle?: string;
  linkTo?: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    image: '/laybhari-banner.jpg',
    alt: "Laybhari Vlogs special masalas and spice mixes ultra-wide banner featuring Malvani, Kolhapuri, Pavbhaji, Kanda Lasun, and Chaat Masala pouches",
    linkTo: '/shop',
  },
];

export const HeroSlider: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const hasMultipleSlides = SLIDES.length > 1;

  // Auto-advance slides every 5 seconds if multiple slides and not hovered
  useEffect(() => {
    if (!hasMultipleSlides || isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, hasMultipleSlides]);

  const handlePrev = () => {
    if (!hasMultipleSlides) return;
    setCurrentSlideIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (!hasMultipleSlides) return;
    setCurrentSlideIndex((prev) => (prev + 1) % SLIDES.length);
  };

  // Touch Swipe Support for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasMultipleSlides) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!hasMultipleSlides || touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="hero-slider-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="hero-slider-container">
        <div className="hero-slider-card">
          
          {/* Slides Carousel Wrapper */}
          <div className="hero-slides-wrapper">
            {SLIDES.map((slide, index) => {
              const isActive = index === currentSlideIndex;
              return (
                <div
                  key={slide.id}
                  className={`hero-slide ${isActive ? 'active' : ''}`}
                  style={{
                    opacity: isActive ? 1 : 0,
                    pointerEvents: isActive ? 'auto' : 'none',
                    transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: isActive ? 'relative' : 'absolute',
                    inset: 0,
                    width: '100%',
                  }}
                >
                  <Link to={slide.linkTo || '/shop'} style={{ display: 'block', width: '100%' }}>
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      loading="eager"
                      decoding="async"
                      // @ts-ignore fetchpriority is standard HTML
                      fetchpriority="high"
                      className="hero-slide-img"
                    />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls (Only shown if multiple slides exist) */}
          {hasMultipleSlides && (
            <>
              <button
                onClick={handlePrev}
                className="hero-slider-nav prev"
                aria-label="Previous Slide"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                onClick={handleNext}
                className="hero-slider-nav next"
                aria-label="Next Slide"
              >
                <ChevronRight size={22} />
              </button>

              <div className="hero-slider-dots">
                {SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlideIndex(index)}
                    className={`hero-dot ${index === currentSlideIndex ? 'active' : ''}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
