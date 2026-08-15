import { redirect } from "next/navigation";

// O catálogo de Labs em /labs é a única lista de desafios do produto.
// Esta rota fica só para não quebrar links já publicados.
export default function Page() {
  redirect("/labs");
}
