export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="font-[family-name:var(--font-cormorant)] text-5xl font-light tracking-tight md:text-7xl">
          Jewelry, Simplified
        </h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          Minimalist pieces designed to complement your everyday.
        </p>
        <a
          href="/shop"
          className="mt-8 inline-block bg-foreground px-8 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Shop Now
        </a>
      </section>

      {/* Collections placeholder */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-light">
          Collections
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Coming soon — browse by seasonal and special collections.
        </p>
      </section>

      {/* Featured products placeholder */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-light">
          Featured
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Featured products will appear here once the catalog is populated.
        </p>
      </section>
    </div>
  );
}
