export const metadata = { title: "Order History" };

export default function OrderHistoryPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-light">
        Order History
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your past orders will appear here.
      </p>
    </div>
  );
}
