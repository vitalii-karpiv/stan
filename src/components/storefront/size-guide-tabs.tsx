"use client";

import { useId, useState } from "react";

const sizeCategories = [
  {
    label: "Анклет",
    content:
      "Тут буде інструкція з вимірювання розміру кільця: обхват пальця стрічкою, відповідність до таблиці розмірів та поради, якщо розмір між двома значеннями.",
  },
  {
    label: "Браслет",
    content:
      "Тут буде опис, як виміряти зап’ястя для браслета, з урахуванням комфорту та типу застібки.",
  },
  {
    label: "Намисто",
    content:
      "Тут буде короткий гайд з довжин намиста та як обрати оптимальну довжину під виріз одягу.",
  },
  {
    label: "Каблучка",
    content:
      "Тут буде інструкція з вимірювання розміру каблучки: обхват пальця стрічкою, відповідність до таблиці розмірів та поради, якщо розмір між двома значеннями.",
  },
] as const;

type SizeCategory = (typeof sizeCategories)[number];

export function SizeGuideTabs() {
  const [activeTab, setActiveTab] = useState<SizeCategory["label"]>(
    sizeCategories[0].label,
  );
  const panelId = useId();

  const activeCategory =
    sizeCategories.find((category) => category.label === activeTab) ??
    sizeCategories[0];

  return (
    <div className="mt-6">
      <div
        role="tablist"
        aria-label="Як дізнатися розмір за типом прикраси"
        className="mx-auto flex w-full max-w-3xl flex-wrap justify-between gap-x-2 gap-y-3"
      >
        {sizeCategories.map((category) => {
          const isActive = category.label === activeCategory.label;
          const tabId = `${panelId}-${category.label}`;

          return (
            <button
              key={category.label}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(category.label)}
              className={`relative pb-3 text-xs uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {category.label}
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 bottom-0 h-px bg-foreground transition-opacity ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={`${panelId}-${activeCategory.label}`}
        className="mt-6 max-w-3xl"
      >
        <p className="leading-relaxed text-muted-foreground">
          {activeCategory.content}
        </p>
      </div>
    </div>
  );
}
