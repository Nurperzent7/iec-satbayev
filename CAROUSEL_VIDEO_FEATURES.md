# Carousel Video Features

The carousel components have been enhanced to support video playback with automatic background play capabilities.

## Features

- **Autoplay**: Videos start playing automatically when displayed
- **Muted**: Videos play without sound (required for autoplay in most browsers)
- **Loop**: Videos continuously loop
- **No Controls**: Clean interface without video controls for background play
- **Cross-platform**: Works on mobile and desktop with `playsInline` attribute

## Supported Video Types

### 1. Direct Video Files (in-place-carousel and image-carousel)
- MP4, WebM, OGG, MOV, AVI files
- Automatic detection by file extension
- Background autoplay with loop

### 2. YouTube Videos (in-place-carousel only)
- YouTube URLs with autoplay, mute, and loop parameters
- Embedded iframe with enhanced autoplay settings

## Usage Examples

### InPlaceCarousel with mixed content:

```typescript
import InPlaceCarousel from "@/components/in-place-carousel";
import { CarouselContent } from "@/lib/types";

const carouselContent: CarouselContent[] = [
  {
    type: 'image',
    src: '/images/sample.jpg',
    alt: 'Sample Image'
  },
  {
    type: 'video',
    directVideoUrl: '/videos/demo.mp4', // Direct video file
    title: 'Demo Video'
  },
  {
    type: 'video',
    videoUrl: 'https://youtu.be/VIDEO_ID', // YouTube video
    title: 'YouTube Video'
  }
];

<InPlaceCarousel content={carouselContent} />
```

### ImageCarousel with automatic video detection:

```typescript
import ImageCarousel from "@/components/image-carousel";

const mediaItems = [
  '/images/photo1.jpg',
  '/videos/background-video.mp4', // Automatically detected as video
  '/images/photo2.png',
  '/videos/another-video.webm'    // Also detected as video
];

// Using new 'media' prop
<ImageCarousel media={mediaItems} alt="Mixed media gallery" />

// Or using legacy 'images' prop (backward compatible)
<ImageCarousel images={mediaItems} alt="Mixed media gallery" />
```

## Video Requirements

- For autoplay to work, videos must be muted (handled automatically)
- Videos should be optimized for web (reasonable file sizes)
- Consider using compressed formats like MP4 with H.264 codec for best compatibility

## Browser Compatibility

- Modern browsers support autoplay with muted videos
- Mobile browsers require `playsInline` attribute (included)
- Some browsers may still block autoplay depending on user settings 