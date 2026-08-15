import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/playground/shop";
import { shopProducts } from "@/lib/playground/shop-data";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const product = shopProducts.find((item) => item.id === Number(id));
  if (!product) notFound();
  return <ProductDetailPage product={product} />;
}
