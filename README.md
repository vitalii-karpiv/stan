# Stan — Jewelry Store

Modern minimalist e-commerce platform for a jewelry store. Built with Next.js 16, Tailwind CSS v4, Prisma 6, and PostgreSQL.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack, Server Actions)
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL + Prisma 6
- **Auth:** NextAuth v5 (credentials provider, JWT sessions)
- **Storage:** AWS S3 (product images)
- **Email:** Nodemailer (SMTP, order & contact notifications)
- **Validation:** Zod
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (for local PostgreSQL) or an external PostgreSQL database

### Setup

```bash
# Start local PostgreSQL
docker compose up -d

# Install dependencies
npm install

# Copy environment variables and fill in your credentials
cp .env.local.example .env.local

# Push the schema to your database
npm run db:push

# Seed the admin user
npm run db:seed:admin

# Seed default categories
npm run db:seed:categories

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

Default admin credentials: `admin@stan.com` / `1234`

## Project Structure

```
src/
├── app/
│   ├── (storefront)/           # Public storefront
│   │   ├── page.tsx            # Homepage
│   │   ├── shop/               # Catalog & product detail pages
│   │   ├── cart/               # Shopping cart
│   │   ├── checkout/           # Checkout flow + success page
│   │   └── contact/            # Contact form
│   ├── admin/                  # Admin panel (auth-protected)
│   │   ├── page.tsx            # Dashboard (stats overview)
│   │   ├── login/              # Admin login
│   │   ├── products/           # Product CRUD, images, options
│   │   ├── categories/         # Category management
│   │   ├── collections/        # Collection management
│   │   ├── orders/             # Order management & status updates
│   │   ├── customers/          # Customer list
│   │   └── users/              # Admin user registration
│   └── api/auth/               # NextAuth API route
├── components/
│   ├── ui/                     # Shared UI primitives
│   ├── storefront/             # Storefront components
│   └── admin/                  # Admin components
├── lib/
│   ├── db.ts                   # Prisma client singleton
│   ├── s3.ts                   # AWS S3 upload/delete helpers
│   ├── mail.ts                 # Email notifications (orders, contact)
│   ├── cart.tsx                # Cart context (client-side, localStorage)
│   ├── admin.ts                # Admin session helpers
│   ├── utils.ts                # General utilities
│   └── validations/            # Zod schemas
├── generated/                  # Prisma generated client (gitignored)
├── auth.ts                     # NextAuth configuration
├── middleware.ts                # Admin route protection
└── types/                      # Type augmentations

prisma/
├── schema.prisma               # Database schema
└── migrations/                 # Migration history

scripts/
├── admin-user.ts               # Seed admin user
└── category.ts                 # Seed default categories
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:migrate` | Create and run migration |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |
| `npm run db:seed:admin` | Seed admin user |
| `npm run db:seed:categories` | Seed default categories |

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (pooled) |
| `DIRECT_URL` | PostgreSQL direct connection (for migrations) |
| `AUTH_SECRET` | NextAuth JWT signing secret |
| `AWS_REGION` | AWS region for S3 |
| `AWS_S3_BUCKET_NAME` | S3 bucket name |
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP server port |
| `SMTP_USER` | SMTP auth username |
| `SMTP_PASS` | SMTP auth password |
| `SMTP_FROM` | Sender email address |
