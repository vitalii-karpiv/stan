"use client";

import Link from "next/link";
import { ImageWithLoader } from "@/components/image-with-loader";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import type { BuilderPartKind } from "@/generated/prisma";
import {
  BUILDER_DEFAULT_PREVIEW_BY_KIND,
  BUILDER_LENGTH_NOTE,
  BUILDER_METAL_COLORS,
  BUILDER_PREVIEW_INTRINSIC,
  MAX_BUILDER_LEFT_INSTANCES,
  MAX_BUILDER_RIGHT_INSTANCES,
} from "@/lib/constants/builder";
import { BUILDER_PART_KIND_LABELS } from "@/lib/builder-part-kinds";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";

export type BuilderPartOption = {
  id: string;
  title: string;
  previewImageUrl: string;
  selectorImageUrl: string;
  price: number | null;
  kind: BuilderPartKind;
};

type Instance = {
  clientId: string;
  kind: BuilderPartKind;
  selectedPartId: string | null;
};

function newClientId() {
  return crypto.randomUUID();
}

function labelForInstance(
  inst: Instance,
  indexInKind: number,
): string {
  if (inst.kind === "PENDANT") {
    return `Підвіска ${indexInKind + 1}`;
  }
  if (inst.kind === "LEFT_HALF") {
    return `Ліва ${indexInKind + 1}`;
  }
  return `Права ${indexInKind + 1}`;
}

function countKind(instances: Instance[], k: BuilderPartKind) {
  return instances.filter((i) => i.kind === k).length;
}

function partitionInstances(prev: Instance[]) {
  return {
    lefts: prev.filter((i) => i.kind === "LEFT_HALF"),
    pendants: prev.filter((i) => i.kind === "PENDANT"),
    rights: prev.filter((i) => i.kind === "RIGHT_HALF"),
  };
}

function flattenPartition(p: {
  lefts: Instance[];
  pendants: Instance[];
  rights: Instance[];
}) {
  return [...p.lefts, ...p.pendants, ...p.rights];
}

function previewSrcForInstance(
  inst: Instance,
  partById: Map<string, BuilderPartOption>,
): string {
  const p = inst.selectedPartId ? partById.get(inst.selectedPartId) : undefined;
  return p?.previewImageUrl ?? BUILDER_DEFAULT_PREVIEW_BY_KIND[inst.kind];
}

function PendantPreviewLayer({
  inst,
  partById,
  fill = false,
}: {
  inst: Instance;
  partById: Map<string, BuilderPartOption>;
  /** When true, parent supplies size (stacked preview); otherwise width is % of preview. */
  fill?: boolean;
}) {
  const src = previewSrcForInstance(inst, partById);
  const { width: iw, height: ih } = BUILDER_PREVIEW_INTRINSIC.PENDANT;
  return (
    <div
      className={
        fill
          ? "pointer-events-none relative h-full min-h-0 w-full"
          : "pointer-events-none relative w-[5.5%] max-w-[19px] shrink-0 sm:max-w-[23px]"
      }
      style={fill ? undefined : { aspectRatio: `${iw} / ${ih}` }}
    >
      <div className="relative h-full w-full">
        <ImageWithLoader
          src={src}
          alt=""
          fill
          className="object-contain object-bottom"
          sizes="23px"
          unoptimized={src.endsWith(".svg")}
          loaderClassName="scale-[0.55]"
        />
      </div>
    </div>
  );
}

/** Single left + pendant + right, same layout as main builder preview (scaled by parent width). */
function CombinationPreviewMini({
  leftInst,
  pendantInst,
  rightInst,
  partById,
}: {
  leftInst: Instance;
  pendantInst: Instance;
  rightInst: Instance;
  partById: Map<string, BuilderPartOption>;
}) {
  const leftSrc = previewSrcForInstance(leftInst, partById);
  const rightSrc = previewSrcForInstance(rightInst, partById);
  const { width: lw, height: lh } = BUILDER_PREVIEW_INTRINSIC.LEFT_HALF;
  const { width: rw, height: rh } = BUILDER_PREVIEW_INTRINSIC.RIGHT_HALF;

  return (
    <div className="relative aspect-square w-full min-w-0">
      <div className="pointer-events-none absolute inset-x-0 top-[1%] bottom-[2%] z-10 flex flex-col [--preview-half-overlap:17px] [--preview-pendant-nudge-x:1.5px] sm:[--preview-half-overlap:22px] sm:[--preview-pendant-nudge-x:2px]">
        <div className="relative z-20 flex min-h-0 flex-1 flex-row items-end justify-center gap-0">
          <div className="relative -mr-px flex h-full min-h-0 shrink-0 flex-col justify-end overflow-visible">
            <div
              className="pointer-events-none relative max-h-[98%] shrink-0"
              style={{
                aspectRatio: `${lw} / ${lh}`,
                height: "98%",
                width: "auto",
              }}
            >
              <div className="relative h-full w-full">
                <ImageWithLoader
                  src={leftSrc}
                  alt=""
                  fill
                  className="object-contain object-right"
                  sizes="(max-width: 640px) 128px, 160px"
                  unoptimized={leftSrc.endsWith(".svg")}
                />
              </div>
            </div>
          </div>
          <div className="relative -ml-px flex h-full min-h-0 shrink-0 items-end justify-end overflow-visible">
            <div
              className="pointer-events-none relative max-h-[98%] shrink-0"
              style={{
                aspectRatio: `${rw} / ${rh}`,
                height: "98%",
                width: "auto",
              }}
            >
              <div className="relative h-full w-full">
                <ImageWithLoader
                  src={rightSrc}
                  alt=""
                  fill
                  className="object-contain object-left"
                  sizes="(max-width: 640px) 128px, 160px"
                  unoptimized={rightSrc.endsWith(".svg")}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 flex w-full shrink-0 justify-center translate-x-[var(--preview-pendant-nudge-x)]">
          <div
            className="relative w-[7%] max-w-[14px] shrink-0 sm:w-[8.5%] sm:max-w-[18px]"
            style={{
              aspectRatio: `${BUILDER_PREVIEW_INTRINSIC.PENDANT.width} / ${BUILDER_PREVIEW_INTRINSIC.PENDANT.height}`,
            }}
          >
            <PendantPreviewLayer
              inst={pendantInst}
              partById={partById}
              fill
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BuilderCombinationsPreview({
  leftInstances,
  pendantInstances,
  rightInstances,
  partById,
  className,
}: {
  leftInstances: Instance[];
  pendantInstances: Instance[];
  rightInstances: Instance[];
  partById: Map<string, BuilderPartOption>;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const uid = useId();
  const panelId = `builder-combinations-${uid}`;
  const triggerId = `builder-combinations-trigger-${uid}`;

  const rows = useMemo(() => {
    const out: {
      key: string;
      label: string;
      leftInst: Instance;
      pendantInst: Instance;
      rightInst: Instance;
    }[] = [];
    const L = leftInstances.length;
    const R = rightInstances.length;
    for (let i = 0; i < L; i += 1) {
      const leftInst = leftInstances[i];
      const pendantInst = pendantInstances[i];
      if (!leftInst || !pendantInst) continue;
      for (let j = 0; j < R; j += 1) {
        const rightInst = rightInstances[j];
        if (!rightInst) continue;
        out.push({
          key: `${leftInst.clientId}-${rightInst.clientId}`,
          label: `Ліва ${i + 1} · Підвіска ${i + 1} · Права ${j + 1}`,
          leftInst,
          pendantInst,
          rightInst,
        });
      }
    }
    return out;
  }, [leftInstances, pendantInstances, rightInstances]);

  const empty =
    leftInstances.length === 0 ||
    rightInstances.length === 0 ||
    rows.length === 0;

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 py-1 text-left text-base font-medium text-foreground transition-colors hover:opacity-70"
        aria-expanded={open}
        id={triggerId}
        aria-controls={panelId}
      >
        <span>Переглянути поєднання</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open ? (
        empty ? (
          <p
            id={panelId}
            className="mt-1.5 text-base text-muted-foreground"
            aria-labelledby={triggerId}
          >
            Немає комбінацій
          </p>
        ) : (
          <ul
            id={panelId}
            className="mt-2 grid max-h-[min(28rem,70vh)] grid-cols-1 gap-x-6 gap-y-6 overflow-y-auto md:grid-cols-2 lg:grid-cols-3"
            aria-labelledby={triggerId}
          >
            {rows.map(({ key, label, leftInst, pendantInst, rightInst }) => (
              <li key={key} className="min-w-0">
                <div className="mx-auto w-full max-w-[148px] sm:max-w-[176px] md:max-w-none md:px-1">
                  <CombinationPreviewMini
                    leftInst={leftInst}
                    pendantInst={pendantInst}
                    rightInst={rightInst}
                    partById={partById}
                  />
                </div>
                <p className="mt-1.5 text-center text-[10px] leading-tight text-muted-foreground sm:text-xs">
                  {label}
                </p>
              </li>
            ))}
          </ul>
        )
      ) : null}
    </div>
  );
}

type BuilderEditorProps = {
  collectionSlug: string;
  categorySlug: string;
  collectionName: string;
  categoryName: string;
  collectionImageUrl: string | null;
  anchorProductId: string;
  parts: BuilderPartOption[];
};

export function BuilderEditor({
  collectionSlug,
  categorySlug,
  collectionName,
  categoryName,
  collectionImageUrl,
  anchorProductId,
  parts,
}: BuilderEditorProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const [instances, setInstances] = useState<Instance[]>(() => [
    { clientId: newClientId(), kind: "LEFT_HALF", selectedPartId: null },
    { clientId: newClientId(), kind: "PENDANT", selectedPartId: null },
    { clientId: newClientId(), kind: "RIGHT_HALF", selectedPartId: null },
  ]);

  const [activeClientId, setActiveClientId] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [highlightColor, setHighlightColor] = useState(false);
  const colorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!highlightColor) return;
    const t = setTimeout(() => setHighlightColor(false), 1600);
    return () => clearTimeout(t);
  }, [highlightColor]);

  useEffect(() => {
    if (
      activeClientId &&
      !instances.some((i) => i.clientId === activeClientId)
    ) {
      setActiveClientId(instances[0]?.clientId ?? null);
    }
  }, [instances, activeClientId]);

  const activeInstance =
    instances.find((i) => i.clientId === activeClientId) ?? instances[0]!;

  const partById = useMemo(() => {
    const m = new Map<string, BuilderPartOption>();
    for (const p of parts) m.set(p.id, p);
    return m;
  }, [parts]);

  const optionsForActiveKind = useMemo(
    () => parts.filter((p) => p.kind === activeInstance.kind),
    [parts, activeInstance.kind],
  );

  const totalPrice = useMemo(() => {
    let sum = 0;
    for (const inst of instances) {
      if (!inst.selectedPartId) continue;
      const p = partById.get(inst.selectedPartId);
      if (p?.price != null) sum += p.price;
    }
    return sum;
  }, [instances, partById]);

  const leftInstances = useMemo(
    () => instances.filter((i) => i.kind === "LEFT_HALF"),
    [instances],
  );
  const rightInstances = useMemo(
    () => instances.filter((i) => i.kind === "RIGHT_HALF"),
    [instances],
  );
  const pendantInstances = useMemo(
    () => instances.filter((i) => i.kind === "PENDANT"),
    [instances],
  );

  /** Left & pendant tabs outer-first; rights keep array order. */
  const segmentTabs = useMemo(
    () => [
      ...leftInstances.slice().reverse(),
      ...pendantInstances.slice().reverse(),
      ...rightInstances,
    ],
    [leftInstances, pendantInstances, rightInstances],
  );

  const allPartsSelected = useMemo(
    () => instances.every((i) => Boolean(i.selectedPartId)),
    [instances],
  );

  const canAddToCart = allPartsSelected;

  const canAddLeft =
    countKind(instances, "LEFT_HALF") < MAX_BUILDER_LEFT_INSTANCES;
  const canAddRight =
    countKind(instances, "RIGHT_HALF") < MAX_BUILDER_RIGHT_INSTANCES;

  const canRemoveLeft = leftInstances.length > 1;
  const canRemoveRight = rightInstances.length > 1;

  const addLeft = useCallback(() => {
    if (!canAddLeft) return;
    const leftId = newClientId();
    const pendantId = newClientId();
    setInstances((prev) => {
      const { lefts, pendants, rights } = partitionInstances(prev);
      return flattenPartition({
        lefts: [
          ...lefts,
          {
            clientId: leftId,
            kind: "LEFT_HALF",
            selectedPartId: null,
          },
        ],
        pendants: [
          ...pendants,
          {
            clientId: pendantId,
            kind: "PENDANT",
            selectedPartId: null,
          },
        ],
        rights,
      });
    });
    setActiveClientId(leftId);
  }, [canAddLeft]);

  const addRight = useCallback(() => {
    if (!canAddRight) return;
    const id = newClientId();
    setInstances((prev) => {
      const { lefts, pendants, rights } = partitionInstances(prev);
      return flattenPartition({
        lefts,
        pendants,
        rights: [
          ...rights,
          {
            clientId: id,
            kind: "RIGHT_HALF",
            selectedPartId: null,
          },
        ],
      });
    });
    setActiveClientId(id);
  }, [canAddRight]);

  const removeLeft = useCallback(() => {
    setInstances((prev) => {
      const { lefts, pendants, rights } = partitionInstances(prev);
      if (lefts.length <= 1) return prev;
      return flattenPartition({
        lefts: lefts.slice(0, -1),
        pendants: pendants.slice(0, -1),
        rights,
      });
    });
  }, []);

  const removeRight = useCallback(() => {
    setInstances((prev) => {
      const { lefts, pendants, rights } = partitionInstances(prev);
      if (rights.length <= 1) return prev;
      return flattenPartition({
        lefts,
        pendants,
        rights: rights.slice(0, -1),
      });
    });
  }, []);

  const selectPart = useCallback((partId: string) => {
    setInstances((prev) =>
      prev.map((i) =>
        i.clientId === activeInstance.clientId
          ? { ...i, selectedPartId: partId }
          : i,
      ),
    );
  }, [activeInstance.clientId]);

  const handleAddToCart = useCallback(() => {
    if (!instances.every((i) => i.selectedPartId)) {
      return;
    }

    if (!color) {
      colorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightColor(true);
      return;
    }

    const orderedIds: string[] = [];
    const titles: string[] = [];
    for (const inst of instances) {
      if (!inst.selectedPartId) continue;
      const p = partById.get(inst.selectedPartId);
      if (!p) continue;
      orderedIds.push(p.id);
      titles.push(p.title);
    }

    if (orderedIds.length === 0) {
      return;
    }

    const customTitle = [...titles, color].join(" · ");
    const firstWithPreview = orderedIds
      .map((id) => partById.get(id))
      .find((p) => p?.previewImageUrl);

    addItem({
      productId: anchorProductId,
      productTitle: "Конструктор",
      productSlug: "builder-assembly",
      imageUrl:
        collectionImageUrl?.trim() ||
        firstWithPreview?.previewImageUrl ||
        firstWithPreview?.selectorImageUrl ||
        null,
      material: color,
      size: null,
      gemstone: null,
      pendant: null,
      price: totalPrice,
      builderPartIds: orderedIds,
      builderSnapshotUrl: null,
      customLineTitle: customTitle,
      collectionSlug,
      categorySlug,
    });

    router.push("/shop");
  }, [
    addItem,
    anchorProductId,
    instances,
    partById,
    router,
    totalPrice,
    collectionSlug,
    categorySlug,
    collectionImageUrl,
    color,
  ]);

  return (
    <div className="pt-10 space-y-8">
      <PriceCtaBar
        totalPrice={totalPrice}
        disabled={!canAddToCart}
        onAdd={handleAddToCart}
      />

      <hr className="border-border" />

      <div className="flex items-start justify-between gap-4 font-[family-name:var(--font-display)] text-sm sm:text-base">
        <Link
          href={`/collections/${collectionSlug}`}
          className="text-left text-brand underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          Як працює конструктор?
        </Link>
        <Link
          href={`/collections/${collectionSlug}`}
          className="text-right text-brand underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          Як працює прикраса?
        </Link>
      </div>

      <div className="mx-auto w-full max-w-[280px] space-y-4 sm:max-w-sm">
        <div className="relative aspect-square w-full min-w-0">
          {/* Arcs (flex-1, bottom-aligned) then pendant flush underneath — no percentage gap */}
          <div className="pointer-events-none absolute inset-x-0 top-[1%] bottom-[2%] z-10 flex flex-col [--preview-half-overlap:38px] [--preview-pendant-nudge-x:2.5px]">
            <div className="relative z-20 flex min-h-0 flex-1 flex-row items-end justify-center gap-0">
              <div className="relative -mr-px flex h-full min-h-0 shrink-0 flex-col justify-end overflow-visible">
                {leftInstances.map((inst, i) => {
                  const src = previewSrcForInstance(inst, partById);
                  const { width: lw, height: lh } =
                    BUILDER_PREVIEW_INTRINSIC.LEFT_HALF;
                  const boxStyle = {
                    aspectRatio: `${lw} / ${lh}`,
                    height: "98%",
                    width: "auto" as const,
                    zIndex: 20 + i,
                    transform:
                      i === 0
                        ? undefined
                        : `translateX(calc(${-i} * var(--preview-half-overlap)))`,
                  };
                  return (
                    <div
                      key={inst.clientId}
                      className={
                        i === 0
                          ? "pointer-events-none relative max-h-[98%] shrink-0"
                          : "pointer-events-none absolute bottom-0 left-0 max-h-[98%] max-w-full"
                      }
                      style={boxStyle}
                    >
                      <div className="relative h-full w-full">
                        <ImageWithLoader
                          src={src}
                          alt=""
                          fill
                          className="object-contain object-right"
                          sizes="(max-width: 640px) 260px, 280px"
                          unoptimized={src.endsWith(".svg")}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="relative -ml-px flex h-full min-h-0 shrink-0 items-end justify-end overflow-visible">
                {rightInstances.map((inst, i) => {
                  const src = previewSrcForInstance(inst, partById);
                  const { width: rw, height: rh } =
                    BUILDER_PREVIEW_INTRINSIC.RIGHT_HALF;
                  const boxStyle = {
                    aspectRatio: `${rw} / ${rh}`,
                    height: "98%",
                    width: "auto" as const,
                    zIndex: 20 + i,
                    transform:
                      i === 0
                        ? undefined
                        : `translateX(calc(${i} * var(--preview-half-overlap)))`,
                  };
                  return (
                    <div
                      key={inst.clientId}
                      className={
                        i === 0
                          ? "pointer-events-none relative max-h-[98%] shrink-0"
                          : "pointer-events-none absolute bottom-0 right-0 max-h-[98%] max-w-full"
                      }
                      style={boxStyle}
                    >
                      <div className="relative h-full w-full">
                        <ImageWithLoader
                          src={src}
                          alt=""
                          fill
                          className="object-contain object-left"
                          sizes="(max-width: 640px) 260px, 280px"
                          unoptimized={src.endsWith(".svg")}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {pendantInstances.length > 0 ? (
              <div className="relative z-10 flex w-full shrink-0 justify-center translate-x-[var(--preview-pendant-nudge-x)]">
                <div
                  className="relative shrink-0 w-[5.5%] max-w-[19px] sm:max-w-[23px]"
                  style={{
                    aspectRatio: `${BUILDER_PREVIEW_INTRINSIC.PENDANT.width} / ${BUILDER_PREVIEW_INTRINSIC.PENDANT.height}`,
                  }}
                >
                  {pendantInstances.map((inst, i) => {
                    const boxStyle = {
                      zIndex: 20 + i,
                      transform:
                        i === 0
                          ? undefined
                          : `translateX(calc(${-i} * var(--preview-half-overlap)))`,
                    };
                    return (
                      <div
                        key={inst.clientId}
                        className={
                          i === 0
                            ? "pointer-events-none relative h-full w-full"
                            : "pointer-events-none absolute bottom-0 left-0 h-full w-full"
                        }
                        style={boxStyle}
                      >
                        <PendantPreviewLayer
                          inst={inst}
                          partById={partById}
                          fill
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex w-full items-start justify-between gap-6 px-1 sm:gap-8">
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={addLeft}
                disabled={!canAddLeft}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground transition-colors hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10"
                aria-label="Додати ліву половинку"
              >
                <Plus className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={removeLeft}
                disabled={!canRemoveLeft}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground transition-colors hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10"
                aria-label="Прибрати останню ліву половинку"
              >
                <Minus className="h-5 w-5" />
              </button>
            </div>
            <span className="text-left text-[10px] leading-tight text-muted-foreground sm:text-xs">
              ліва половинка
            </span>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={addRight}
                disabled={!canAddRight}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground transition-colors hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10"
                aria-label="Додати праву половинку"
              >
                <Plus className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={removeRight}
                disabled={!canRemoveRight}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground transition-colors hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10"
                aria-label="Прибрати останню праву половинку"
              >
                <Minus className="h-5 w-5" />
              </button>
            </div>
            <span className="text-right text-[10px] leading-tight text-muted-foreground sm:text-xs">
              права половинка
            </span>
          </div>
        </div>
      </div>

      {(leftInstances.length > 1 || rightInstances.length > 1) ? (
        <BuilderCombinationsPreview
          leftInstances={leftInstances}
          pendantInstances={pendantInstances}
          rightInstances={rightInstances}
          partById={partById}
        />
      ) : null}

      <div>
        <p className="text-xs font-medium text-foreground">
          Обери елементи
          {!allPartsSelected && (
            <span className="mt-0.5 block font-normal text-accent">
              Позначені вкладки потребують вибору варіанту нижче.
            </span>
          )}
        </p>
        <div className="mt-2 flex gap-1 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border-b border-border pb-px">
          {segmentTabs.map((inst) => {
            const idxInKind =
              inst.kind === "LEFT_HALF"
                ? leftInstances.findIndex((i) => i.clientId === inst.clientId)
                : inst.kind === "RIGHT_HALF"
                  ? rightInstances.findIndex((i) => i.clientId === inst.clientId)
                  : inst.kind === "PENDANT"
                    ? pendantInstances.findIndex(
                        (i) => i.clientId === inst.clientId,
                      )
                    : 0;
            const label = labelForInstance(inst, idxInKind);
            const active = inst.clientId === activeInstance.clientId;
            const needsSelection = !inst.selectedPartId;
            return (
              <button
                key={inst.clientId}
                type="button"
                onClick={() => setActiveClientId(inst.clientId)}
                title={
                  needsSelection
                    ? "Оберіть варіант для цього сегмента"
                    : undefined
                }
                className={`shrink-0 border-b-2 px-3 py-2 text-xs transition-colors sm:text-sm ${
                  active
                    ? "border-accent font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
                {needsSelection ? (
                  <span
                    className="ml-1 inline-block size-1.5 rounded-full bg-accent align-middle sm:size-2"
                    aria-hidden
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-base text-muted-foreground">
          {BUILDER_PART_KIND_LABELS[activeInstance.kind]} — варіанти
        </p>
        {optionsForActiveKind.length === 0 ? (
          <p className="mt-4 text-base text-muted-foreground">
            Немає варіантів для цієї позиції. Додайте частини в адмінці.
          </p>
        ) : (
          <ul className="mt-3 grid grid-cols-3 items-stretch gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {optionsForActiveKind.map((p) => {
              const selected =
                activeInstance.selectedPartId === p.id;
              return (
                <li key={p.id} className="min-h-0">
                  <button
                    type="button"
                    onClick={() => selectPart(p.id)}
                    className={`flex h-full min-h-0 w-full flex-col rounded-md border p-3 text-left transition-colors sm:p-4 ${
                      selected
                        ? "border-accent ring-1 ring-accent/30"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <div className="relative mx-auto aspect-[3/4] w-full max-w-[180px] shrink-0 md:max-w-[150px]">
                      <ImageWithLoader
                        src={p.selectorImageUrl}
                        alt=""
                        fill
                        className="object-contain"
                        sizes="120px"
                        unoptimized={p.selectorImageUrl.endsWith(".svg")}
                        loaderClassName="scale-90"
                      />
                    </div>
                    <p className="mt-2 line-clamp-2 text-center font-sans text-sm leading-snug text-brand/70 sm:text-base">
                      {p.title}
                    </p>
                    <p className="mt-0.5 text-center font-[family-name:var(--font-display)] text-xs text-brand sm:text-sm">
                      {p.price != null ? formatPrice(p.price) : "—"}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div
        ref={colorRef}
        className={`scroll-mt-24 rounded-md p-2 transition-all ${
          highlightColor
            ? "ring-2 ring-accent ring-offset-2 ring-offset-background"
            : "ring-0"
        }`}
      >
        <p className="mb-2 text-base font-medium text-foreground">Колір</p>
        <div className="flex flex-wrap gap-2">
          {BUILDER_METAL_COLORS.map((c) => {
            const active = color === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setColor(c);
                  setHighlightColor(false);
                }}
                className={`rounded-md border px-4 py-1.5 text-base transition-colors ${
                  active
                    ? "border-foreground bg-muted text-foreground"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-base font-medium text-foreground">Довжина прикраси:</p>
        <p className="text-base text-foreground">{BUILDER_LENGTH_NOTE}</p>
      </div>

      <hr className="border-border" />

      <PriceCtaBar
        totalPrice={totalPrice}
        disabled={!canAddToCart}
        onAdd={handleAddToCart}
      />

      <p className="text-center text-base text-muted-foreground">
        <Link href="/builder" className="underline underline-offset-2">
          ← Назад до вибору колекції
        </Link>
      </p>
    </div>
  );
}

function PriceCtaBar({
  totalPrice,
  disabled,
  onAdd,
}: {
  totalPrice: number;
  disabled: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="font-[family-name:var(--font-display)] text-xl font-medium uppercase text-brand sm:text-2xl">
        {formatPrice(totalPrice)}
      </p>
      <button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        className="rounded-xl bg-accent px-6 py-3 font-[family-name:var(--font-display)] text-base font-extrabold text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Додати в кошик
      </button>
    </div>
  );
}
