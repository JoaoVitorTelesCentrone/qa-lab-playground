export default function MentorshipLoading() {
  return <main aria-busy="true" aria-label="Carregando mentoria" className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
    <div className="h-3 w-28 animate-pulse rounded bg-white/10" />
    <div className="mt-5 h-10 max-w-2xl animate-pulse rounded bg-white/10" />
    <div className="mt-3 h-5 max-w-xl animate-pulse rounded bg-white/10" />
    <div className="mt-10 h-24 animate-pulse border-y border-white/10 bg-white/[.03]" />
    <div className="mt-8 grid gap-5 lg:grid-cols-2">
      <div className="h-56 animate-pulse border border-white/10 bg-[#171B21]" />
      <div className="h-56 animate-pulse border border-white/10 bg-[#171B21]" />
    </div>
    <p className="sr-only" role="status">Carregando sua jornada da mentoria.</p>
  </main>;
}
