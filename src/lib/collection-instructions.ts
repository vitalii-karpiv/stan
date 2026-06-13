export type InstructionLine = {
  text: string;
  emphasis?: boolean;
};

export type InstructionStep = {
  imageSrc: string;
  imageAlt: string;
  lines: InstructionLine[];
};

export type CollectionInstruction = {
  videoUrl: string;
  steps: InstructionStep[];
};

// Hardcoded per-collection instruction content, keyed by collection slug.
// Only EMOTSI exists for now. The composited step images (labels + arrows baked
// in) live under public/collections/<slug>/ and are supplied separately.
export const COLLECTION_INSTRUCTIONS: Record<string, CollectionInstruction> = {
  emotsi: {
    videoUrl: "#",
    steps: [
      {
        imageSrc: "/collections/emotsi/step-1.png",
        imageAlt: "Прикраса з двома замочками",
        lines: [
          {
            text: "В прикрасі є 2 замочки. Розстібни обидва - отримай дві окремі половинки.",
          },
        ],
      },
      {
        imageSrc: "/collections/emotsi/step-2.png",
        imageAlt: "Права і ліва половинки прикраси",
        lines: [
          {
            text: "Права і ліва половинки відрізняються. Орієнтир — підвіска (вона завжди зліва).",
          },
          { text: "Підвіска НЕ знімається", emphasis: true },
        ],
      },
      {
        imageSrc: "/collections/emotsi/step-3.png",
        imageAlt: "Капсула з комбінованих половинок",
        lines: [
          {
            text: "Змінюй одну або обидві половинки. Експериментуй та створюй власні комбінації та капсули.",
          },
        ],
      },
    ],
  },
};

export function getCollectionInstruction(
  slug: string,
): CollectionInstruction | null {
  return COLLECTION_INSTRUCTIONS[slug] ?? null;
}
