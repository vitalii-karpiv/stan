"use client";

import Image from "next/image";
import { useState } from "react";

type ImageLightboxProps = {
  src: string;
  alt: string;
  thumbClassName?: string;
  thumbSizes?: string;
};

export function ImageLightbox({
  src,
  alt,
  thumbClassName = "h-7 w-7",
  thumbSizes = "28px",
}: ImageLightboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`relative overflow-hidden rounded border border-border ${thumbClassName}`}
        aria-label="Open image fullscreen"
      >
        <Image src={src} alt={alt} fill sizes={thumbSizes} className="object-cover" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded border border-white/50 px-3 py-1 text-sm text-white hover:bg-white/10"
            aria-label="Close fullscreen image"
          >
            Close
          </button>
          <div
            className="relative h-[85vh] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image src={src} alt={alt} fill sizes="100vw" className="object-contain" />
          </div>
        </div>
      )}
    </>
  );
}
