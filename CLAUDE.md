# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Webpack dev server
npm run dev:turbo    # Turbopack dev server (faster)
npm run build        # Production build
npm run lint         # ESLint

# Database
npm run db:push      # Push Prisma schema to DB (no migration file)
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio GUI

# Seeding
npm run db:seed:admin          # Create admin user
npm run db:seed:categories     # Seed default categories
npm run db:seed:builder-anchor # Seed the builder anchor product
```

No test runner configured. Default local admin: `admin@stan.com` / `1234`. Local Postgres via `docker compose up -d`.

## Architecture

Single Next.js 16 app (App Router + Server Actions). Ukrainian jewelry e-commerce platform with jewelry builder feature.

### Route Groups

- `src/app/(storefront)/` — public storefront (shop, cart, checkout, builder, info pages)
- `src/app/admin/` — admin panel, protected by `src/middleware.ts` (NextAuth session required)
- `src/app/api/auth/` — NextAuth route

### Key Directories

- `src/lib/` — shared utilities: `db.ts` (Prisma singleton), `s3.ts` (AWS uploads), `mail.ts` (Nodemailer), `cart.tsx` (client-side cart context), `monobank/` (payment client + webhook), `validations/` (Zod schemas)
- `src/components/storefront/` — customer-facing components
- `src/components/admin/` — admin CRUD components
- `src/components/ui/` — shared UI primitives used by both storefront and admin
- `prisma/schema.prisma` — full DB schema

> **Gotcha:** the Prisma client is generated to `src/generated/prisma` (set via the schema's `generator.output`), **not** `node_modules/@prisma/client`. Import it as `import { PrismaClient } from "@/generated/prisma"` — see `src/lib/db.ts`. `postinstall` runs `prisma generate`; if types go missing after a schema change, re-run it.

### Data Flow

- **Forms:** Server Actions (async functions in co-located `actions.ts`), Zod validation, FormState return type `{ message, fieldErrors, values }`
- **Cart:** React Context + localStorage (client-side only), `CartProvider` in `src/lib/cart.tsx`
- **Auth:** NextAuth v5 JWT, credentials provider, bcryptjs hashing
- **Images:** Uploaded to AWS S3 via `uploadToS3()` / `deleteFromS3()` in `src/lib/s3.ts`

### Jewelry Builder

Custom feature for combining builder parts (LEFT_HALF / RIGHT_HALF / PENDANT) with color variants per collection. `BuilderColor` model links colors to `Collection`. Cart stores `builderPartIds` + snapshot image. Admin manages parts in `/admin/builder-parts/` and colors in `/admin/collections/`.

### Payment & Shipping

- **Monobank** — Ukrainian payment gateway, invoice creation + webhook verification (`src/lib/monobank/`). Webhook handler at `src/app/api/webhooks/monobank/`
- **Nova Poshta** — Ukrainian shipping API, post office ComboBox in checkout (`src/components/storefront/np-combobox.tsx`); city/warehouse lookups proxied through `src/app/api/nova-poshta/`
- **COD** — cash on delivery fallback

### Enums (from Prisma schema)

- `OrderStatus`: AWAITING_PAYMENT → PENDING → CONFIRMED → SHIPPED → DELIVERED / CANCELLED
- `PaymentMethod`: COD, MONOBANK
- `ProductType`: HALVES, READY_COMBINATIONS, CAPSULES
- `OptionType`: SIZE, COLOR, GEMSTONE, PENDANT
- `UserRole`: CUSTOMER, ADMIN
- Materials: 12 types (pearl, stone, jade, etc.)

## Tech Stack

- **Next.js 16**, React 19, TypeScript 5
- **Tailwind CSS v4** (PostCSS v4), CVA for component variants, Lucide icons
- **Prisma 6** + PostgreSQL (Supabase in prod, Docker locally via `docker-compose.yml`)
- **NextAuth v5** (JWT strategy)
- **Zod v4** for validation
- **Vercel** deployment (Analytics + Speed Insights included)

## Storefront Design Conventions

The storefront language is **Ukrainian** (`lang="uk"`). When working on storefront UI, follow the design outlines in `.cursor/rules/stan-design-outlines.mdc` and `docs/figma-style-guide.md` (typography roles, brand dark `#4C2F1F`, accent `#F26C23`). Do not hardcode ad hoc hex/font-family values — extend `src/app/globals.css` and the layout font loading instead. Note: the Figma spec targets Muller/Montserrat/Kosko, but `src/app/layout.tsx` currently loads Inter + Cormorant Garamond (migration pending).

## Path Alias

`@/*` maps to `./src/*` (configured in `tsconfig.json`).

## Environment Variables

Required in `.env`: `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `AWS_REGION`, `AWS_S3_BUCKET_NAME`, AWS credentials, `SMTP_*`, `MONOBANK_TOKEN`, `NOVA_POSHTA_API_KEY`.
