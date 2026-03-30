import type { BuilderPartKind } from "@/generated/prisma";

export const BUILDER_PART_KIND_VALUES = [
  "LEFT_HALF",
  "RIGHT_HALF",
  "PENDANT",
] as const satisfies readonly BuilderPartKind[];

export const BUILDER_PART_KIND_LABELS: Record<BuilderPartKind, string> = {
  LEFT_HALF: "Left half",
  RIGHT_HALF: "Right half",
  PENDANT: "Pendant",
};
