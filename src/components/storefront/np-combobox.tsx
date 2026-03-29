"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Loader2 } from "lucide-react";

export type NpOption = { ref: string; label: string };

type Props = {
  /** Hidden input name for form submission */
  name: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Pre-filled label (e.g. after validation error) */
  defaultValue?: string;
  /** Fetch options for a given query string */
  onSearch: (query: string) => Promise<NpOption[]>;
  /** Called when the user picks an option */
  onSelect?: (option: NpOption | null) => void;
};

const inputClass =
  "w-full min-h-[44px] rounded border border-border bg-background px-3 py-2.5 text-base outline-none focus:border-foreground disabled:cursor-not-allowed disabled:opacity-60 md:min-h-0 md:py-2 md:text-sm";

export function NpCombobox({
  name,
  id,
  placeholder,
  disabled,
  defaultValue = "",
  onSearch,
  onSelect,
}: Props) {
  const [query, setQuery] = useState(defaultValue);
  const [selected, setSelected] = useState<NpOption | null>(
    defaultValue ? { ref: "", label: defaultValue } : null,
  );
  const [options, setOptions] = useState<NpOption[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const search = useCallback(
    async (q: string) => {
      if (q.length < 1) {
        setOptions([]);
        return;
      }
      setLoading(true);
      try {
        const results = await onSearch(q);
        setOptions(results);
        setOpen(results.length > 0);
        setActiveIndex(-1);
      } finally {
        setLoading(false);
      }
    },
    [onSearch],
  );

  const handleChange = (value: string) => {
    setQuery(value);
    if (selected) {
      setSelected(null);
      onSelect?.(null);
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(value), 300);
  };

  const pick = (option: NpOption) => {
    setSelected(option);
    setQuery(option.label);
    setOpen(false);
    setOptions([]);
    onSelect?.(option);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i < options.length - 1 ? i + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i > 0 ? i - 1 : options.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && options[activeIndex]) {
          pick(options[activeIndex]);
        }
        break;
      case "Escape":
        setOpen(false);
        break;
    }
  };

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement | null;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={selected?.label ?? ""} />
      <input
        id={id}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-activedescendant={
          activeIndex >= 0 ? `${id}-opt-${activeIndex}` : undefined
        }
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => {
          if (options.length > 0 && !selected) setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClass}
      />

      {loading && (
        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}

      {open && options.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded border border-border bg-background shadow-lg sm:max-h-56"
        >
          {options.map((opt, i) => (
            <li
              key={opt.ref}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={() => pick(opt)}
              className={`cursor-pointer break-words px-3 py-2.5 text-sm md:py-2 ${
                i === activeIndex
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}

      {open && !loading && options.length === 0 && query.length >= 1 && (
        <div className="absolute z-50 mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm text-muted-foreground shadow-lg">
          Нічого не знайдено
        </div>
      )}
    </div>
  );
}
