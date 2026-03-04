"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ImagePreviewDialogProps = {
  open: boolean;
  onClose: () => void;
  src: string;
  alt?: string;
};

export function ImagePreviewDialog({
  open,
  onClose,
  src,
  alt = "Preview",
}: ImagePreviewDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Escape key closes
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80"
      onClick={(e) => {
        // Click on backdrop closes
        if (
          dialogRef.current &&
          !dialogRef.current.contains(e.target as Node)
        ) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        className="relative max-h-[90vh] max-w-[90vw]"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -right-3 -top-3 z-10 flex size-8 items-center justify-center rounded-full bg-white text-dark shadow-md hover:bg-gray-2 dark:bg-gray-dark dark:text-white dark:hover:bg-dark-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-h-[85vh] max-w-[85vw] rounded-lg object-contain"
        />
      </div>
    </div>,
    document.body,
  );
}
