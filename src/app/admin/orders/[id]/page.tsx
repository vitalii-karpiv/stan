type Props = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Order Details</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Order {id} details and fulfillment management.
      </p>
    </div>
  );
}
