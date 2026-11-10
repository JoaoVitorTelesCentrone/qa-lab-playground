import { Suspense } from "react";
import { ApiCrudLab } from "@/components/playground/api-crud-lab";

export const metadata = { title: "Lab API CRUD" };

// O Lab lê ?bug= no cliente: sem Suspense o build quebra na pré-renderização.
export default function Page() {
  return <Suspense><ApiCrudLab /></Suspense>;
}
