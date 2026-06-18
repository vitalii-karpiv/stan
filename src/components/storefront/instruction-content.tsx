import type { CollectionInstruction } from "@/lib/collection-instructions";

import { InstructionSteps } from "./instruction-steps";
import { ButtonLink } from "./button";

type InstructionContentProps = Readonly<{
  instruction: CollectionInstruction;
}>;

export function InstructionContent({ instruction }: InstructionContentProps) {
  return (
    <>
      <InstructionSteps steps={instruction.steps} />

      <div className="mt-10 flex flex-col items-center gap-6">
        <a
          href={instruction.videoUrl}
          className="text-sm text-brand underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          Дивитись відеоінструкцію
        </a>
        <ButtonLink href="/builder">Створити в конструкторі</ButtonLink>
      </div>
    </>
  );
}
