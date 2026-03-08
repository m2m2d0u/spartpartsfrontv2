"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import type { PartImage } from "@/types/part";

type ImageGalleryProps = {
  images: PartImage[];
  alt: string;
};

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const sortedImages = useMemo(() => {
    if (images.length === 0) return [];
    // Put isMain image first, then sort by sortOrder
    return [...images].sort((a, b) => {
      if (a.isMain && !b.isMain) return -1;
      if (!a.isMain && b.isMain) return 1;
      return a.sortOrder - b.sortOrder;
    });
  }, [images]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = sortedImages[selectedIndex];

  if (sortedImages.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl bg-gray-2 dark:bg-dark-3">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-dark-5 dark:text-dark-6"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-2 dark:bg-dark-3">
        <Image
          src={selectedImage.url}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                index === selectedIndex
                  ? "border-primary"
                  : "border-stroke hover:border-dark-4 dark:border-dark-3 dark:hover:border-dark-5"
              }`}
            >
              <Image
                src={image.url}
                alt={`${alt} ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
