import Link from "next/link";
import { ArrowUpRight, BookOpenText, Sprout } from "lucide-react";
import "./content-atlas.css";

export default function ContentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="content-atlas">
    <nav aria-label="Navegação do conteúdo" className="ca-topbar">
      <Link href="/conteudo" className="ca-topbar-brand"><BookOpenText aria-hidden="true" className="size-4" /> Caderno de campo <span>QA LAB / CONTEÚDO</span></Link>
      <div className="ca-topbar-links">
        <Link href="/conteudo">Módulos</Link>
        <Link href="/conteudo/broto"><Sprout aria-hidden="true" className="size-4" /> Caso Broto</Link>
        <Link href="/mentoria/app">Minha mentoria <ArrowUpRight aria-hidden="true" className="size-3.5" /></Link>
      </div>
    </nav>
    {children}
  </div>;
}
