import { LoginLab } from "@/components/playground/login-lab";
import { Suspense } from "react";

export const metadata = { title: "Lab de Login" };

export default function Page() {
  return <Suspense><LoginLab /></Suspense>;
}
