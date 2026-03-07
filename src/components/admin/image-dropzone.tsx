"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";

type ImageDropzoneProps = {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
};

export function ImageDropzone({
  onFiles,
  multiple = true,
  disabled = false,
  label,
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    onFiles(multiple ? files : files.slice(0, 1));
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!disabled) setDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      onFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors ${
        dragging
          ? "border-foreground bg-foreground/5"
          : "border-border hover:border-foreground/50"
      } ${disabled ? "pointer-events-none opacity-50" : ""}`}
    >
      <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
      <p className="text-sm font-medium">
        {disabled
          ? "Uploading..."
          : label ?? `Drag & drop image${multiple ? "s" : ""} here`}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        or click to browse — JPEG, PNG, WebP, AVIF up to 5 MB
      </p>
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
