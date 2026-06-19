import type { CollectionInstruction } from "@/lib/collection-instructions";

import { InstructionSteps } from "./instruction-steps";
import { Button, ButtonLink } from "./button";

type InstructionContentProps = Readonly<{
  instruction: CollectionInstruction;
  onPrimaryAction?: () => void;
}>;

export function InstructionContent({
  instruction,
  onPrimaryAction,
}: InstructionContentProps) {
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
        {onPrimaryAction ? (
          <Button onClick={onPrimaryAction}>Створити в конструкторі</Button>
        ) : (
          <ButtonLink href="/builder">Створити в конструкторі</ButtonLink>
        )}
      </div>
    </>
  );
}
