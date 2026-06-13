"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import type { InstructionStep } from "@/lib/collection-instructions";

type InstructionStepsProps = Readonly<{
  steps: InstructionStep[];
}>;

export function InstructionSteps({ steps }: InstructionStepsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const stripRef = useRef<HTMLDivElement | null>(null);

  const scrollToIndex = useCallback((index: number) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }, []);

  const handleScroll = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    const clamped = Math.max(0, Math.min(next, steps.length - 1));
    setActiveIndex((prev) => (prev === clamped ? prev : clamped));
  }, [steps.length]);

  return (
    <div>
      {/* Desktop / tablet: 3-column grid */}
      <div className="hidden gap-8 md:grid md:grid-cols-3">
        {steps.map((step) => (
          <StepCell key={step.imageSrc} step={step} />
        ))}
      </div>

      {/* Mobile: one-at-a-time swipe carousel + dots */}
      <div className="md:hidden">
        <div
          ref={stripRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {steps.map((step) => (
            <div
              key={step.imageSrc}
              className="w-full flex-shrink-0 snap-center px-2"
            >
              <StepCell step={step} priority />
            </div>
          ))}
        </div>

        {steps.length > 1 ? (
          <div className="mt-4 flex justify-center gap-2">
            {steps.map((step, i) => (
              <button
                key={step.imageSrc}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Крок ${i + 1}`}
                aria-current={i === activeIndex}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === activeIndex ? "bg-brand" : "bg-border"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StepCell({
  step,
  priority = false,
}: Readonly<{ step: InstructionStep; priority?: boolean }>) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative aspect-square w-full">
        <Image
          src={step.imageSrc}
          alt={step.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={priority}
          className="object-contain"
        />
      </div>
      <div className="mt-4 max-w-xs text-center text-sm leading-relaxed text-brand">
        {step.lines.map((line) => (
          <p key={line.text} className={line.emphasis ? "font-semibold" : undefined}>
            {line.text}
          </p>
        ))}
      </div>
    </div>
  );
}
