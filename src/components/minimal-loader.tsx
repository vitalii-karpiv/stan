import { cn } from "@/lib/utils";

export type MinimalLoaderProps = {
  className?: string;
  /** Screen reader label */
  label?: string;
};

/**
 * Small neutral spinner for inline use (images, cards, comboboxes).
 */
export function MinimalLoader({
  className,
  label = "Завантаження",
}: MinimalLoaderProps) {
  return (
    <span
      className={cn("relative inline-flex items-center justify-center", className)}
      role="status"
      aria-label={label}
    >
      <span
        className="block size-7 shrink-0 rounded-full border-2 border-muted-foreground/20 border-t-muted-foreground/55 animate-spin"
        aria-hidden
      />
    </span>
  );
}
