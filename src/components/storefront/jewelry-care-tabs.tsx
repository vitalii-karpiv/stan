"use client";

import { useId, useState } from "react";

const careCategories = [
  {
    label: "Анклети",
    content:
      "Анклети найкраще зберігають вигляд, коли ви знімаєте їх перед душем, морем або тренуванням. Після носіння протирайте прикрасу м'якою сухою серветкою та зберігайте окремо, щоб ланцюжок не перекручувався.",
  },
  {
    label: "Браслети",
    content:
      "Браслети варто берегти від різких ударів, води та косметичних засобів для рук. Щоб фурнітура довше залишалася охайною, знімайте прикрасу перед сном і зберігайте її в сухому мішечку або коробці.",
  },
  {
    label: "Намисто",
    content:
      "Намисто рекомендуємо надягати після парфумів і доглядових засобів, щоб покриття довше зберігало блиск. Після носіння акуратно розкладіть прикрасу без вузлів і протріть серветкою перед зберіганням.",
  },
] as const;

type CareCategory = (typeof careCategories)[number];

export function JewelryCareTabs() {
  const [activeTab, setActiveTab] = useState<CareCategory["label"]>(
    careCategories[0].label,
  );
  const panelId = useId();

  const activeCategory =
    careCategories.find((category) => category.label === activeTab) ??
    careCategories[0];

  return (
    <div className="mt-6">
      <div
        role="tablist"
        aria-label="Категорії догляду за прикрасами"
        className="mx-auto flex w-full max-w-3xl flex-wrap justify-between gap-x-6 gap-y-3"
      >
        {careCategories.map((category) => {
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
              className={`relative pb-3 text-xs uppercase tracking-[0.28em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 ${
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
