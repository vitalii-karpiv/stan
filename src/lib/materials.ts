import type { Material } from "@/generated/prisma";

/** Prisma enum order + Ukrainian labels (match schema @map). */
export const MATERIAL_OPTIONS: { value: Material; label: string }[] = [
  { value: "NATURAL_PEARLS", label: "натуральні перли" },
  { value: "AMAZONITE", label: "амазоніт" },
  { value: "MOUNTAIN_CRYSTAL", label: "гірський кришталь" },
  { value: "ROSE_QUARTZ", label: "рожевий кварц" },
  { value: "STRAWBERRY_QUARTZ", label: "полуничний кварц" },
  { value: "YELLOW_JADE", label: "жовтий нефрит" },
  { value: "GREEN_CHALCEDONY", label: "зелений халцедон" },
  { value: "CORAL_JADE", label: "кораловий нефрит" },
  { value: "LILAC_CHALCEDONY", label: "бузковий халцедон" },
  { value: "METAL_CHAIN", label: "металевий ланцюг" },
  { value: "MINT_JADE", label: "мʼятний нефрит" },
  { value: "CAIRO_NIGHT", label: "ніч каїра" },
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
