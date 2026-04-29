"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type FaqItem = {
  question: string;
  answer: React.ReactNode;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Який матеріал фурнітури?",
    answer: (
      <>
        Для срібного кольору фурнітури ми використовуємо нержавіючу сталь 304L та
        316L.
        <br />
        Для золотого кольору — нержавіючу сталь з PVD (вакуумним покриттям)
        золотом 18K.
      </>
    ),
  },
  {
    question: "Чи стирається / темніє покриття?",
    answer:
      "PVD-покриття стійке до побутового зносу за умови правильного догляду. Уникайте абразивів і агресивної хімії — це допомагає зберегти колір довше.",
  },
  {
    question: "Як довго прослужать прикраси?",
    answer:
      "Строк служби залежить від інтенсивності носіння та догляду. Регулярне обережне використання й зберігання окремо від інших виробів продовжують життя прикрас.",
  },
  {
    question: "Чи може бути алергія на метал?",
    answer:
      "Медична нержавіюча сталь зазвичай добре переноситься. Якщо у вас є відома непереносимість металів, проконсультуйтеся з лікарем перед покупкою.",
  },
  {
    question: "Чи можна обрати довжину намиста?",
    answer:
      "Доступні варіанти довжини зазначені на сторінці товару або в конструкторі. Якщо потрібен індивідуальний розмір — напишіть нам у Direct.",
  },
  {
    question: "Який час виготовлення та доставки",
    answer:
      "Терміни залежать від наявності та завантаження виробництва; актуальну інформацію повідомимо після оформлення замовлення. Доставка — згідно з обраним способом на оформленні.",
  },
  {
    question: "Чи є доставка закордон?",
    answer:
      "Умови міжнародної доставки уточнюйте у повідомленні в Direct — підкажемо варіанти та вартість для вашої країни.",
  },
  {
    question: "Чи є гарантія?",
    answer:
      "На виробничі дефекти діє гарантія відповідно до законодавства України. У разі виявлення дефекту зв’яжіться з нами для вирішення ситуації.",
  },
];

export function HomeFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mx-auto max-w-3xl border-t border-black">
      {FAQ_ITEMS.map((item, index) => {
        const open = openIndex === index;
        return (
          <div
            key={item.question}
            className="border-b border-black py-7 last:border-b-0"
          >
            <button
              type="button"
              className="flex w-full items-start justify-between gap-4 text-left"
              onClick={() => setOpenIndex(open ? -1 : index)}
              aria-expanded={open}
            >
              <span className="font-[family-name:var(--font-cormorant)] text-xl italic leading-snug text-brand md:text-[20px]">
                {item.question.toUpperCase()}
              </span>
              <ChevronDown
                className={cn(
                  "mt-1 size-6 shrink-0 text-brand transition-transform duration-200",
                  open && "rotate-180",
                )}
                aria-hidden
              />
            </button>
            {open ? (
              <div className="mt-3 max-w-none text-base leading-[1.247] text-brand">
                {item.answer}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
