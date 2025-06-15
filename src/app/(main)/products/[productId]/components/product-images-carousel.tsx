"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ProductImagesCarousel = ({ imageUrls }: { imageUrls: string[] }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="max-w-sm mx-auto">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {imageUrls.map((imageUrl, index) => (
            <CarouselItem key={imageUrl}>
              <div className="relative aspect-square">
                <Image
                  src={imageUrl}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="text-muted-foreground py-2 text-center text-sm">
        Image {current} of {count}
      </div>
    </div>
  );
};

export default ProductImagesCarousel;
