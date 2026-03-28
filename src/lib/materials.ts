import type { Material } from "@/generated/prisma";

/** Prisma enum order + Ukrainian labels (match schema @map). */
export const MATERIAL_OPTIONS: { value: Material; label: string }[] = [
  { value: "NATURAL_PEARLS", label: "Натуральні перли" },
  { value: "AMAZONITE", label: "Амазоніт" },
  { value: "MOUNTAIN_CRYSTAL", label: "Гірський кришталь" },
  { value: "ROSE_QUARTZ", label: "Рожевий кварц" },
  { value: "STRAWBERRY_QUARTZ", label: "Полуничний кварц" },
  { value: "YELLOW_JADE", label: "Жовтий нефрит" },
  { value: "GREEN_CHALCEDONY", label: "Зелений халцедон" },
  { value: "CORAL_JADE", label: "Кораловий нефрит" },
  { value: "LILAC_CHALCEDONY", label: "Бузковий халцедон" },
  { value: "METAL_CHAIN", label: "Металевий ланцюг" },
  { value: "MINT_JADE", label: "Мʼятний нефрит" },
  { value: "CAIRO_NIGHT", label: "Ніч каїра" },
];

export const MATERIAL_VALUES = MATERIAL_OPTIONS.map(
  (o) => o.value,
) as [Material, ...Material[]];

const labelByValue = new Map<Material, string>(
  MATERIAL_OPTIONS.map((o) => [o.value, o.label]),
);

export function materialLabel(value: Material): string {
  return labelByValue.get(value) ?? value;
}
