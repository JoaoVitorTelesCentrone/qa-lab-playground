import { ArrowUpRight } from "lucide-react";
import { brotoSpaceSite } from "@/lib/mentorship/brotospace-track";

export function BrotoSpaceLink() {
  return (
    <a
      href={brotoSpaceSite.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-5 rounded-2xl bg-[#F28C45] p-6 text-[#21150C] transition-[transform,filter,box-shadow] duration-200 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_14px_32px_rgba(0,0,0,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F8FBF9] focus-visible:ring-offset-4 focus-visible:ring-offset-[#111315] sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-8"
      aria-label="Ir para o Broto Space, abre em nova aba"
    >
      <span className="max-w-2xl">
        <span className="block text-xl font-semibold tracking-[-0.025em] sm:text-2xl">Conheça o Broto Space</span>
        <span className="mt-2 block text-sm leading-6 sm:text-base">Um produto usado como contexto em algumas práticas de QA.</span>
      </span>
      <span className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full bg-[#21150C] px-5 text-sm font-semibold text-[#FFF8F1] transition-colors group-hover:bg-[#342318] sm:self-auto">
        Ir para o Broto <ArrowUpRight aria-hidden="true" className="size-4" />
      </span>
    </a>
  );
}
