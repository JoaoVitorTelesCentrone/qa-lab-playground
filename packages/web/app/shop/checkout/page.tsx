import { CheckoutPage } from "@/components/playground/shop";
import { Suspense } from "react";

export const metadata = { title: "Checkout" };

export default function Page() {
  return <Suspense><CheckoutPage /></Suspense>;
}
