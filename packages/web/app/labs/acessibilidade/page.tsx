import { AccessibilityLab } from "@/components/playground/accessibility-lab";
import { Suspense } from "react";

export const metadata = { title: "Lab Acessibilidade" };

export default function Page() {
  return <Suspense><AccessibilityLab /></Suspense>;
}
