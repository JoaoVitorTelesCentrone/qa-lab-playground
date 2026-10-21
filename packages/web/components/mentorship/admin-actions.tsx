"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CohortAdminForm() {
  const router = useRouter();
  const [form, setForm] = useState({ code: "turma-fundadora", name: "Turma fundadora QA Lab", startsOn: "", endsOn: "", capacity: "20" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(""); setError("");
    const response = await fetch("/api/v1/mentorship/admin/cohorts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...form, capacity: Number(form.capacity) }) });
    const payload = await response.json().catch(() => null); setBusy(false);
    if (!response.ok) { setError(payload?.error?.message ?? "Nao foi possivel criar a turma."); return; }
    setMessage(`Turma criada: ${payload?.data?.id ?? "ok"}`); router.refresh();
  }
  return <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-white/10 bg-[#171B21] p-6"><h2 className="text-xl font-black text-off-white">Criar turma</h2><div className="grid gap-4 sm:grid-cols-2"><Field label="Codigo" value={form.code} onChange={(value) => setForm({ ...form, code: value })} /><Field label="Nome" value={form.name} onChange={(value) => setForm({ ...form, name: value })} /><Field label="Inicio" type="date" value={form.startsOn} onChange={(value) => setForm({ ...form, startsOn: value })} /><Field label="Fim" type="date" value={form.endsOn} onChange={(value) => setForm({ ...form, endsOn: value })} /><Field label="Capacidade" type="number" value={form.capacity} onChange={(value) => setForm({ ...form, capacity: value })} /></div>{error && <p role="alert" className="text-sm text-coral">{error}</p>}{message && <p role="status" className="text-sm text-mint">{message}</p>}<Button type="submit" disabled={busy}>{busy ? "Criando..." : "Criar turma"}</Button></form>;
}

export function EnrollmentAdminForm({ cohorts, people }: { cohorts: { id: string; name: string }[]; people: { id: string; fullName: string; email: string }[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ cohortId: "", userId: "", level: "beginner" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(""); setError("");
    const response = await fetch("/api/v1/mentorship/admin/enrollments", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
    const payload = await response.json().catch(() => null); setBusy(false);
    if (!response.ok) { setError(payload?.error?.message ?? "Nao foi possivel matricular o aluno."); return; }
    setMessage("Convite criado. O aluno terá acesso à jornada depois que a matrícula for ativada."); router.refresh();
  }
  return <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-white/10 bg-[#171B21] p-6"><h2 className="text-xl font-black text-off-white">Convidar aluno</h2><label className="grid gap-2 text-sm font-semibold">Turma<select required value={form.cohortId} onChange={(event) => setForm({ ...form, cohortId: event.target.value })} className="h-11 rounded-lg border border-white/15 bg-[#101319] px-3 text-sm text-off-white"><option value="">Selecione uma turma</option>{cohorts.map((cohort) => <option key={cohort.id} value={cohort.id}>{cohort.name}</option>)}</select></label><label className="grid gap-2 text-sm font-semibold">Usuario<select required value={form.userId} onChange={(event) => setForm({ ...form, userId: event.target.value })} className="h-11 rounded-lg border border-white/15 bg-[#101319] px-3 text-sm text-off-white"><option value="">Selecione um usuario</option>{people.map((person) => <option key={person.id} value={person.id}>{person.fullName} · {person.email}</option>)}</select></label><label className="grid gap-2 text-sm font-semibold">Nivel<select value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value })} className="h-11 rounded-lg border border-white/15 bg-[#101319] px-3 text-sm text-off-white"><option value="beginner">Iniciante</option><option value="intermediate">Intermediario</option></select></label>{error && <p role="alert" className="text-sm text-coral">{error}</p>}{message && <p role="status" className="text-sm text-mint">{message}</p>}<Button type="submit" disabled={busy}>{busy ? "Salvando..." : "Matricular aluno"}</Button></form>;
}

export function LiveSessionAdminForm({ cohorts }: { cohorts: { id: string; name: string }[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ cohortId: "", weekNumber: "1", title: "Encontro ao vivo - Semana 1", agenda: "", startsAt: "", endsAt: "", meetingUrl: "", recordingUrl: "", recordingAvailableUntil: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(""); setError("");
    const response = await fetch("/api/v1/mentorship/admin/sessions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...form, weekNumber: Number(form.weekNumber) }) });
    const payload = await response.json().catch(() => null); setBusy(false);
    if (!response.ok) { setError(payload?.error?.message ?? "Nao foi possivel publicar o encontro."); return; }
    setMessage("Encontro publicado. Ele ja aparece no dashboard dos alunos da turma."); router.refresh();
  }
  return <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-white/10 bg-[#171B21] p-6 lg:col-span-2"><h2 className="text-xl font-black text-off-white">Publicar encontro ao vivo</h2><p className="text-sm leading-6 text-[#AAB2BC]">O encontro e o espaco para os temas pessoais e profissionais da semana. A pauta tecnica continua na aula gravada.</p><div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-semibold">Turma<select required value={form.cohortId} onChange={(event) => setForm({ ...form, cohortId: event.target.value })} className="h-11 rounded-lg border border-white/15 bg-[#101319] px-3 text-sm text-off-white"><option value="">Selecione uma turma</option>{cohorts.map((cohort) => <option key={cohort.id} value={cohort.id}>{cohort.name}</option>)}</select></label><Field label="Semana (1-12)" type="number" value={form.weekNumber} onChange={(value) => setForm({ ...form, weekNumber: value })} /><Field label="Titulo" value={form.title} onChange={(value) => setForm({ ...form, title: value })} /><Field label="Link da sala" type="url" value={form.meetingUrl} onChange={(value) => setForm({ ...form, meetingUrl: value })} /><Field label="Inicio" type="datetime-local" value={form.startsAt} onChange={(value) => setForm({ ...form, startsAt: value })} /><Field label="Fim" type="datetime-local" value={form.endsAt} onChange={(value) => setForm({ ...form, endsAt: value })} /><Field label="Link da gravacao (opcional)" type="url" value={form.recordingUrl} onChange={(value) => setForm({ ...form, recordingUrl: value })} required={false} /><Field label="Gravacao disponivel ate (opcional)" type="datetime-local" value={form.recordingAvailableUntil} onChange={(value) => setForm({ ...form, recordingAvailableUntil: value })} required={false} /></div><label className="grid gap-2 text-sm font-semibold">Pauta<textarea required value={form.agenda} onChange={(event) => setForm({ ...form, agenda: event.target.value })} rows={4} className="rounded-lg border border-white/15 bg-[#101319] px-3 py-2 text-sm text-off-white" /></label>{error && <p role="alert" className="text-sm text-coral">{error}</p>}{message && <p role="status" className="text-sm text-mint">{message}</p>}<Button type="submit" disabled={busy}>{busy ? "Publicando..." : "Publicar encontro"}</Button></form>;
}

function Field({ label, value, onChange, type = "text", required = true }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) { return <label className="grid gap-2 text-sm font-semibold">{label}<input required={required} value={value} onChange={(event) => onChange(event.target.value)} type={type} className="h-11 rounded-lg border border-white/15 bg-[#101319] px-3 text-sm text-off-white" /></label>; }
