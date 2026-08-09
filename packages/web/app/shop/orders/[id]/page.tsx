import { OrderPage } from "@/components/playground/shop";

export const metadata = { title: "Pedido" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderPage id={id} />;
}
