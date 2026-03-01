export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-light">
        Contact Us
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Have a question? We&apos;d love to hear from you.
      </p>

      <form className="mt-8 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="mt-1 w-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-foreground"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="mt-1 w-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-foreground"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium">
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            className="mt-1 w-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-foreground"
          />
        </div>
        <button
          type="submit"
          className="bg-foreground px-8 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
