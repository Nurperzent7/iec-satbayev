'use client';

import Link from "next/link"
import { Lab } from "@/lib/types";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export default function LabsCarousel({ labEntries, language }: { labEntries: [string, Lab][], language: string }) {
  return <Carousel opts={{ align: "center", slidesToScroll: 1 }}>
    <CarouselContent className="-ml-2 md:-ml-4">
      {labEntries.map(([labId, lab]: [string, Lab]) => (
        <CarouselItem key={labId} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3">
          <Link href={`/${language}/labs/${labId}`}>
            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img
                  src={lab.imagePaths[0]}
                  alt={lab.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center">
                  <h3 className="text-white px-4 text-center text-sm sm:text-base md:text-lg">
                    {lab.title}
                  </h3>
                </div>
              </div>
            </div>
          </Link>
        </CarouselItem>
      ))}
    </CarouselContent>
    <div className="hidden sm:block">
      <CarouselPrevious />
      <CarouselNext />
    </div>
  </Carousel >
}