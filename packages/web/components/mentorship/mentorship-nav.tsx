import Link from "next/link";

const items = [
  { href: "/mentoria/app", label: "Minha jornada" },
  { href: "/mentoria/carreira", label: "Carreira" },
  { href: "/mentoria/dinamicas", label: "Dinâmicas" },
] as const;

export function MentorshipNav({ current }: { current: typeof items[number]["href"] }) {
  return <nav aria-label="Navegação da mentoria" className="mb-8 flex gap-0 overflow-x-auto border-b border-white/10 pb-px sm:gap-1">
    {items.map((item) => <Link key={item.href} href={item.href} aria-current={current === item.href ? "page" : undefined} className={`shrink-0 whitespace-nowrap border-b-2 px-2 py-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint sm:px-4 sm:text-sm ${current === item.href ? "border-mint text-off-white" : "border-transparent text-[#AAB2BC] hover:border-white/30 hover:text-off-white"}`}>{item.label}</Link>)}
  </nav>;
}
