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
npm run db:seed:admin       # Create admin user
npm run db:seed:categories  # Seed default categories
```

No test runner configured.

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
- `prisma/schema.prisma` — full DB schema

### Data Flow

- **Forms:** Server Actions (async functions in co-located `actions.ts`), Zod validation, FormState return type `{ message, fieldErrors, values }`
- **Cart:** React Context + localStorage (client-side only), `CartProvider` in `src/lib/cart.tsx`
- **Auth:** NextAuth v5 JWT, credentials provider, bcryptjs hashing
- **Images:** Uploaded to AWS S3 via `uploadToS3()` / `deleteFromS3()` in `src/lib/s3.ts`

### Jewelry Builder

Custom feature for combining builder parts (LEFT_HALF / RIGHT_HALF / PENDANT) with color variants per collection. `BuilderColor` model links colors to `Collection`. Cart stores `builderPartIds` + snapshot image. Admin manages parts in `/admin/builder-parts/` and colors in `/admin/collections/`.

### Payment & Shipping

- **Monobank** — Ukrainian payment gateway, invoice creation + webhook verification (`src/lib/monobank/`)
- **Nova Poshta** — Ukrainian shipping API, post office ComboBox in checkout (`src/components/storefront/np-combobox.tsx`)
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

## Path Alias

`@/*` maps to `./src/*` (configured in `tsconfig.json`).

## Environment Variables

Required in `.env`: `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `AWS_REGION`, `AWS_S3_BUCKET_NAME`, AWS credentials, `SMTP_*`, `MONOBANK_TOKEN`, `NOVA_POSHTA_API_KEY`.
