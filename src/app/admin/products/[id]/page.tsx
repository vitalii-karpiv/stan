type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Edit Product</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Editing product {id}. Form will be implemented here.
      </p>
    </div>
  );
}
