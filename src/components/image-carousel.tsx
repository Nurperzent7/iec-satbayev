'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { X } from 'lucide-react';

interface ImageCarouselProps {
  media?: string[] | string;
  images?: string[] | string; // For backward compatibility
  alt?: string;
}

// Helper function to detect if a URL is a video file
function isVideoFile(url: string): boolean {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
  return videoExtensions.some(ext => url.toLowerCase().includes(ext));
}

// Helper function to render media item (image or video)
function renderMediaItem(url: string | undefined, alt: string, className: string) {
  if (!url) {
    return <div>No media provided</div>;
  }
  if (isVideoFile(url)) {
    return (
      <video
        src={url}
        className={className}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  } else {
    return (
      <img
        src={url}
        alt={alt}
        className={className}
      />
    );
  }
}

// Image Carousel component that also supports video files
// Automatically detects and plays videos with autoplay, muted, loop
export default function ImageCarousel({ media, images, alt = "Gallery media" }: ImageCarouselProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  // Use media prop if provided, otherwise fall back to images prop for backward compatibility
  const mediaSource = media || images;

  // Ensure media is always an array
  const mediaArray = Array.isArray(mediaSource) ? mediaSource : [mediaSource];

  const openCarousel = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeCarousel = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = '';
  }, []);

  const handlePrevious = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const handleNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case 'Escape':
          e.preventDefault();
          closeCarousel();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handlePrevious, handleNext, closeCarousel]);

  // Update current index when carousel changes
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mediaArray.map((mediaItem, index) => (
          <div
            key={mediaItem}
            className="cursor-pointer overflow-hidden rounded-lg transition-all hover:opacity-90 hover:shadow-md"
            onClick={() => openCarousel(index)}
          >
            {renderMediaItem(mediaItem, alt, "w-full h-64 object-cover")}
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            className="absolute top-4 right-4 text-white p-2 z-[60]"
            onClick={closeCarousel}
            aria-label="Close"
          >
            <X size={32} />
          </button>

          <div className="w-full max-w-6xl px-4">
            <Carousel
              opts={{ startIndex: currentIndex }}
              setApi={setApi}
            >
              <CarouselContent>
                {mediaArray.map((mediaItem) => (
                  <CarouselItem key={mediaItem}>
                    <div className="flex items-center justify-center">
                      {renderMediaItem(mediaItem, alt, "max-h-[85vh] max-w-full object-contain")}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 bg-black/50 hover:bg-black/70 text-white" />
              <CarouselNext className="right-2 bg-black/50 hover:bg-black/70 text-white" />
            </Carousel>
          </div>

          <div className="absolute bottom-4 text-white text-sm">
            {currentIndex + 1} / {mediaArray.length}
          </div>
        </div>
      )}
    </>
  );
}
