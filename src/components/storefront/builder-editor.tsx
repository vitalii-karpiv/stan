"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import type { BuilderPartKind } from "@/generated/prisma";
import {
  BUILDER_DEFAULT_PREVIEW_BY_KIND,
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
    return "Підвіска";
  }
  if (inst.kind === "LEFT_HALF") {
    return `Ліва ${indexInKind + 1}`;
  }
  return `Права ${indexInKind + 1}`;
}

function countKind(instances: Instance[], k: BuilderPartKind) {
  return instances.filter((i) => i.kind === k).length;
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
}: {
  inst: Instance;
  partById: Map<string, BuilderPartOption>;
}) {
  const src = previewSrcForInstance(inst, partById);
  const { width: iw, height: ih } = BUILDER_PREVIEW_INTRINSIC.PENDANT;
  return (
    <div
      className="pointer-events-none relative w-[5.5%] max-w-[19px] shrink-0 sm:max-w-[23px]"
      style={{ aspectRatio: `${iw} / ${ih}` }}
    >
      <div className="relative h-full w-full">
        <Image
          src={src}
          alt=""
          fill
          className="object-contain object-bottom drop-shadow-sm"
          sizes="23px"
          unoptimized={src.endsWith(".svg")}
        />
      </div>
    </div>
  );
}

type BuilderEditorProps = {
  collectionSlug: string;
  categorySlug: string;
  collectionName: string;
  categoryName: string;
  anchorProductId: string;
  parts: BuilderPartOption[];
};

export function BuilderEditor({
  collectionSlug,
  categorySlug,
  collectionName,
  categoryName,
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
  const pendantInstance = useMemo(
    () => instances.find((i) => i.kind === "PENDANT"),
    [instances],
  );

  const canAddLeft =
    countKind(instances, "LEFT_HALF") < MAX_BUILDER_LEFT_INSTANCES;
  const canAddRight =
    countKind(instances, "RIGHT_HALF") < MAX_BUILDER_RIGHT_INSTANCES;

  const addLeft = useCallback(() => {
    if (!canAddLeft) return;
    const id = newClientId();
    setInstances((prev) => {
      const idx = prev.findIndex((i) => i.kind === "PENDANT");
      const next = [...prev];
      next.splice(idx, 0, {
        clientId: id,
        kind: "LEFT_HALF",
        selectedPartId: null,
      });
      return next;
    });
    setActiveClientId(id);
  }, [canAddLeft]);

  const addRight = useCallback(() => {
    if (!canAddRight) return;
    const id = newClientId();
    setInstances((prev) => {
      let insertAt = prev.length;
      for (let j = prev.length - 1; j >= 0; j--) {
        if (prev[j]!.kind === "RIGHT_HALF") {
          insertAt = j + 1;
          break;
        }
      }
      const next = [...prev];
      next.splice(insertAt, 0, {
        clientId: id,
        kind: "RIGHT_HALF",
        selectedPartId: null,
      });
      return next;
    });
    setActiveClientId(id);
  }, [canAddRight]);

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

    const customTitle = titles.join(" · ");
    const firstWithPreview = orderedIds
      .map((id) => partById.get(id))
      .find((p) => p?.previewImageUrl);

    addItem({
      productId: anchorProductId,
      productTitle: "Конструктор",
      productSlug: "builder-assembly",
      imageUrl: firstWithPreview?.previewImageUrl ?? firstWithPreview?.selectorImageUrl ?? null,
      material: null,
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
  ]);

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">
        {collectionName} · {categoryName}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="text-sm text-muted-foreground">Ціна</p>
          <p className="text-lg font-medium">{formatPrice(totalPrice)}</p>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="min-h-11 rounded-md bg-accent px-5 py-2.5 text-sm font-medium italic text-accent-foreground transition-opacity hover:opacity-90"
        >
          Додати до кошика
        </button>
      </div>

      <div className="relative flex items-center justify-center gap-1 sm:gap-2">
        <div className="flex w-[4.5rem] shrink-0 flex-col items-center gap-1 sm:w-24">
          <button
            type="button"
            onClick={addLeft}
            disabled={!canAddLeft}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground transition-colors hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-40 sm:h-14 sm:w-14"
            aria-label="Додати ліву половинку"
          >
            <Plus className="h-6 w-6" />
          </button>
          <span className="text-center text-[10px] leading-tight text-muted-foreground sm:text-xs">
            додати ліву половинку
          </span>
        </div>

        <div className="relative aspect-square w-full min-w-0 max-w-[280px] sm:max-w-sm">
          {/* Arcs (flex-1, bottom-aligned) then pendant flush underneath — no percentage gap */}
          <div className="pointer-events-none absolute inset-x-0 top-[1%] bottom-[2%] z-10 flex flex-col">
            <div className="relative z-20 flex min-h-0 flex-1 flex-row items-end justify-center gap-0 [--preview-half-overlap:38px] sm:[--preview-half-overlap:45px]">
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
                        <Image
                          src={src}
                          alt=""
                          fill
                          className="object-contain object-right drop-shadow-sm"
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
                        <Image
                          src={src}
                          alt=""
                          fill
                          className="object-contain object-left drop-shadow-sm"
                          sizes="(max-width: 640px) 260px, 280px"
                          unoptimized={src.endsWith(".svg")}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {pendantInstance ? (
              <div className="relative z-10 flex shrink-0 justify-center">
                <PendantPreviewLayer
                  inst={pendantInstance}
                  partById={partById}
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex w-[4.5rem] shrink-0 flex-col items-center gap-1 sm:w-24">
          <button
            type="button"
            onClick={addRight}
            disabled={!canAddRight}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground transition-colors hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-40 sm:h-14 sm:w-14"
            aria-label="Додати праву половинку"
          >
            <Plus className="h-6 w-6" />
          </button>
          <span className="text-center text-[10px] leading-tight text-muted-foreground sm:text-xs">
            додати праву половинку
          </span>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground">
          Обери сегмент
        </p>
        <div className="mt-2 flex gap-1 overflow-x-auto border-b border-border pb-px">
          {instances.map((inst, globalIdx) => {
            const idxInKind =
              inst.kind === "LEFT_HALF"
                ? instances
                    .slice(0, globalIdx)
                    .filter((i) => i.kind === "LEFT_HALF").length
                : inst.kind === "RIGHT_HALF"
                  ? instances
                      .slice(0, globalIdx)
                      .filter((i) => i.kind === "RIGHT_HALF").length
                  : 0;
            const label = labelForInstance(inst, idxInKind);
            const active = inst.clientId === activeInstance.clientId;
            return (
              <button
                key={inst.clientId}
                type="button"
                onClick={() => setActiveClientId(inst.clientId)}
                className={`shrink-0 border-b-2 px-3 py-2 text-xs transition-colors sm:text-sm ${
                  active
                    ? "border-foreground font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground">
          {BUILDER_PART_KIND_LABELS[activeInstance.kind]} — варіанти
        </p>
        {optionsForActiveKind.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Немає варіантів для цієї позиції. Додайте частини в адмінці.
          </p>
        ) : (
          <ul className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
            {optionsForActiveKind.map((p) => {
              const selected =
                activeInstance.selectedPartId === p.id;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => selectPart(p.id)}
                    className={`w-full rounded-md border p-2 text-left transition-colors ${
                      selected
                        ? "border-foreground ring-1 ring-foreground/20"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <div className="relative mx-auto aspect-[3/4] w-full max-w-[120px]">
                      <Image
                        src={p.selectorImageUrl}
                        alt=""
                        fill
                        className="object-contain"
                        sizes="120px"
                        unoptimized={p.selectorImageUrl.endsWith(".svg")}
                      />
                    </div>
                    <p className="mt-2 line-clamp-2 text-center font-[family-name:var(--font-cormorant)] text-xs italic leading-snug sm:text-sm">
                      {p.title}
                    </p>
                    <p className="mt-1 text-center text-[10px] text-muted-foreground sm:text-xs">
                      {p.price != null ? formatPrice(p.price) : "—"}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/builder" className="underline underline-offset-2">
          ← Назад до вибору колекції
        </Link>
      </p>
    </div>
  );
}
