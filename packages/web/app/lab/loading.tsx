export default function LoadingLab() {
  return <div className="mx-auto max-w-6xl animate-pulse px-5 py-14 sm:px-8"><div className="h-4 w-24 rounded bg-white/10" /><div className="mt-5 h-10 w-64 rounded bg-white/10" /><div className="mt-10 grid gap-4 sm:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-28 rounded-xl bg-white/[0.06]" />)}</div><div className="mt-10 h-64 rounded-2xl bg-white/[0.04]" /></div>;
}
