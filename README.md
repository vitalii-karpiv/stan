# Stan — Jewelry Store

Modern minimalist e-commerce website for a jewelry store. Built with Next.js, Tailwind CSS, Prisma, and PostgreSQL.

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your database credentials

# Push the schema to your database
npm run db:push

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

## Project Structure

```
src/
├── app/
│   ├── (storefront)/       # Public storefront pages
│   │   ├── shop/           # Product catalog + detail pages
│   │   ├── cart/            # Shopping cart
│   │   ├── checkout/        # Checkout flow
│   │   ├── contact/         # Contact form
│   │   └── account/         # Customer account + order history
│   ├── admin/               # Admin panel
│   │   ├── products/        # Product CRUD
│   │   ├── collections/     # Collection management
│   │   ├── categories/      # Category management
│   │   ├── orders/          # Order management
│   │   └── customers/       # Customer list
│   └── api/                 # API routes
├── components/
│   ├── ui/                  # Shared UI primitives
│   ├── storefront/          # Storefront components
│   └── admin/               # Admin components
├── lib/                     # Utilities, DB client, helpers
└── generated/               # Prisma generated client (gitignored)

prisma/
└── schema.prisma            # Database schema

docs/
└── requirements.md          # Project requirements
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:migrate` | Create and run migration |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |
