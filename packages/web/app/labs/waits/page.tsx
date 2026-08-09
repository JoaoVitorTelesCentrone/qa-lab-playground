import { WaitsLab } from "@/components/playground/waits-lab";
import { Suspense } from "react";

export const metadata = { title: "Lab de Waits" };

export default function Page() {
  return <Suspense><WaitsLab /></Suspense>;
}
