"use client";

import Image, { type ImageProps } from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

import { MinimalLoader } from "@/components/minimal-loader";
import { cn } from "@/lib/utils";

export type ImageWithLoaderProps = Omit<
  ImageProps,
  "onLoad" | "onLoadingComplete" | "onError"
> & {
  /** Applied to the `relative h-full w-full` wrapper around the image */
  wrapperClassName?: string;
  /** Forwarded to `MinimalLoader` */
  loaderClassName?: string;
};

function imageSrcKey(src: ImageProps["src"]): string {
  if (typeof src === "string") return src;
  if ("src" in src) return src.src;
  return src.default.src;
}

/** Wait until the bitmap is ready to paint (not just `load`, which can be early for progressive formats). */
function whenPresentable(
  img: HTMLImageElement,
  onReady: () => void,
): void {
  const finish = () => {
    requestAnimationFrame(() => onReady());
  };
  if (typeof img.decode === "function") {
    img.decode().then(finish).catch(finish);
    return;
  }
  finish();
}

function ImageWithLoaderInner({
  alt = "",
  className,
  wrapperClassName,
  loaderClassName,
  src,
  ...props
}: ImageWithLoaderProps) {
  const srcKey = imageSrcKey(src);
  const srcRef = useRef(src);
  useLayoutEffect(() => {
    srcRef.current = src;
  }, [src]);

  /** Last `src` key that finished load + decode; until it matches current `src`, only the loader is shown (no old frame). */
  const [presentedKey, setPresentedKey] = useState<string | null>(null);

  const visible = presentedKey === srcKey;

  return (
    <div className={cn("relative h-full w-full", wrapperClassName)}>
      {!visible ? (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-background/25"
          aria-hidden
        >
          <MinimalLoader className={loaderClassName} />
        </div>
      ) : null}
      <Image
        {...props}
        key={srcKey}
        alt={alt}
        src={src}
        className={cn(
          className,
          "transition-opacity duration-200 ease-out",
          visible ? "opacity-100" : "opacity-0",
        )}
        onLoad={(e) => {
          const keyForThisLoad = srcKey;
          whenPresentable(e.currentTarget, () => {
            if (imageSrcKey(srcRef.current) !== keyForThisLoad) return;
            setPresentedKey(keyForThisLoad);
          });
        }}
        onError={() => {
          if (imageSrcKey(srcRef.current) !== srcKey) return;
          setPresentedKey(srcKey);
        }}
      />
    </div>
  );
}

/**
 * Next/Image with a centered `MinimalLoader` until the current `src` is decoded
 * and ready to paint. On `src` change, the loader stays up (no old image, no
 * empty gap) until the new asset is presentable.
 */
export function ImageWithLoader(props: ImageWithLoaderProps) {
  return <ImageWithLoaderInner {...props} />;
}
