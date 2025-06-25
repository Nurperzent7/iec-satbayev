'use client';

import { useState, useEffect } from 'react';
import { CarouselContent } from "@/lib/types";
import { Carousel, CarouselContent as CarouselContentComponent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"

// Helper function to extract YouTube video ID from various URL formats
function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Helper function to render carousel item content
function renderCarouselItem(content: CarouselContent) {
  if (content.type === 'image') {
    return (
      <img
        src={content.src}
        alt={content.alt || "Gallery image"}
        className="w-full h-full object-contain"
      />
    );
  } else if (content.type === 'video') {
    // Handle direct video files first
    if (content.directVideoUrl) {
      return (
        <video
          src={content.directVideoUrl}
          className="w-full h-full object-contain"
          autoPlay
          muted
          loop
          playsInline
        />
      );
    }
    // Handle YouTube videos
    else if (content.videoUrl) {
      const videoId = getYouTubeVideoId(content.videoUrl);
      if (videoId) {
        return (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1`}
            title={content.title || "Video"}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      } else {
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <p className="text-gray-500">Invalid video URL</p>
          </div>
        );
      }
    } else {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <p className="text-gray-500">No video source provided</p>
        </div>
      );
    }
  }
  return null;
}

export default function InPlaceCarousel({
  content,
  className,
}: {
  content: CarouselContent[]
  className?: string
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Update current index when carousel changes
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    // Set initial index
    setCurrentIndex(api.selectedScrollSnap());

    // Listen for slide changes
    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <div className={className}>
      <Carousel
        opts={{ align: "center", slidesToScroll: 1 }}
        setApi={setApi}
      >
        <CarouselContentComponent className="-ml-2 md:-ml-4">
          {content.map((item, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 basis-full">
              <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
                <div className="relative overflow-hidden aspect-video">
                  {renderCarouselItem(item)}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContentComponent>
      </Carousel>

      {/* Page indicator */}
      {content.length > 1 && (
        <div className="flex justify-center mt-3 space-x-2">
          {content.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 cursor-pointer rounded-full transition-colors ${index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
                }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}