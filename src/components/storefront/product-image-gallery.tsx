"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ProductImageGalleryProps = {
  images: { url: string; alt: string | null }[];
  productTitle: string;
};

export function ProductImageGallery({
  images,
  productTitle,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const mainStripRef = useRef<HTMLDivElement | null>(null);
  const prevLightboxOpenRef = useRef(false);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior) => {
    const el = mainStripRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior });
  }, []);

  const goToRegularIndex = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      scrollToIndex(index, "smooth");
    },
    [scrollToIndex],
  );

  const goNext = useCallback(
    () => setSelectedIndex((i) => (i + 1) % images.length),
    [images.length],
  );

  const goPrev = useCallback(
    () => setSelectedIndex((i) => (i - 1 + images.length) % images.length),
    [images.length],
  );

  const selectImage = useCallback(
    (index: number) => {
      goToRegularIndex(index);
    },
    [goToRegularIndex],
  );

  const goToRegularNext = useCallback(() => {
    const nextIndex = (selectedIndex + 1) % images.length;
    goToRegularIndex(nextIndex);
  }, [goToRegularIndex, images.length, selectedIndex]);

  const goToRegularPrev = useCallback(() => {
    const prevIndex = (selectedIndex - 1 + images.length) % images.length;
    goToRegularIndex(prevIndex);
  }, [goToRegularIndex, images.length, selectedIndex]);

  const handleMainScroll = useCallback(() => {
    if (lightboxOpen) return;
    const el = mainStripRef.current;
    if (!el) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    const clamped = Math.max(0, Math.min(next, images.length - 1));
    setSelectedIndex((prev) => (prev === clamped ? prev : clamped));
  }, [images.length, lightboxOpen]);

  useEffect(() => {
    const wasOpen = prevLightboxOpenRef.current;
    prevLightboxOpenRef.current = lightboxOpen;

    if (wasOpen && !lightboxOpen && images.length > 1) {
      scrollToIndex(selectedIndex, "auto");
    }
  }, [lightboxOpen, images.length, selectedIndex, scrollToIndex]);

  useEffect(() => {
    if (!lightboxOpen) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [lightboxOpen, closeLightbox, goNext, goPrev]);

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-gradient-to-br from-muted to-muted-foreground/20" />
    );
  }

  const current = images[selectedIndex];

  return (
    <div>
      {images.length > 1 ? (
        <div className="group relative">
          <div
            ref={mainStripRef}
            onScroll={handleMainScroll}
            className="flex aspect-[3/4] snap-x snap-mandatory overflow-x-auto scroll-smooth"
          >
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setSelectedIndex(i);
                  setLightboxOpen(true);
                }}
                className="relative block h-full w-full flex-shrink-0 snap-start cursor-zoom-in overflow-hidden"
              >
                <Image
                  src={img.url}
                  alt={img.alt ?? `${productTitle} — ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={i === 0}
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToRegularPrev();
            }}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/70 p-1.5 text-foreground/70 backdrop-blur-sm transition-all hover:bg-background/90 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            aria-label="Попереднє фото"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToRegularNext();
            }}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/70 p-1.5 text-foreground/70 backdrop-blur-sm transition-all hover:bg-background/90 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            aria-label="Наступне фото"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="relative block w-full cursor-zoom-in overflow-hidden aspect-[3/4]"
        >
          <Image
            src={current.url}
            alt={current.alt ?? productTitle}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={selectedIndex === 0}
            className="object-cover"
          />
        </button>
      )}

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => selectImage(i)}
              className={`relative h-20 w-16 flex-shrink-0 overflow-hidden border-2 transition-colors ${
                i === selectedIndex
                  ? "border-foreground"
                  : "border-transparent hover:border-border"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt ?? `${productTitle} — ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <Lightbox
          current={current}
          productTitle={productTitle}
          hasMultiple={images.length > 1}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </div>
  );
}

type LightboxProps = {
  current: { url: string; alt: string | null };
  productTitle: string;
  hasMultiple: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

function Lightbox({
  current,
  productTitle,
  hasMultiple,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xl"
      onClick={onClose}
      style={{ top: 0, left: 0, width: "100vw", height: "100dvh" }}
    >
      <div className="relative h-full w-full p-4">
        <Image
          src={current.url}
          alt={current.alt ?? productTitle}
          fill
          className="object-contain p-4"
          sizes="100vw"
        />
      </div>

      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-2 text-white/80 backdrop-blur-sm transition-colors hover:text-white"
        aria-label="Закрити"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/70 p-1.5 text-foreground/70 backdrop-blur-sm transition-all hover:bg-background/90 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            aria-label="Попереднє фото"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/70 p-1.5 text-foreground/70 backdrop-blur-sm transition-all hover:bg-background/90 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            aria-label="Наступне фото"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
        </>
      )}
    </div>,
    document.body,
  );
}
