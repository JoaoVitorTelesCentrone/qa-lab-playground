"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Cohort = { id: string; name: string; starts_on: string; ends_on: string; capacity: number; status: string };
type Person = { id: string; fullName: string; email: string };
type Enrollment = { id: string; cohort_id: string; user_id: string; status: string; level: string };
type MentorLink = { cohort_id: string; staff_user_id: string; role: string };
type Session = { id: string; cohort_id: string; week_number: number; title: string; agenda: string; starts_at: string; ends_at: string; meeting_url: string; recording_url: string | null; recording_available_until: string | null };
type Lesson = { key: string; title: string; week: number };
type LessonContent = { lesson_key: string; video_url: string | null; material_url: string | null; status: string; available_at: string | null };

type Props = { cohorts: Cohort[]; people: Person[]; enrollments: Enrollment[]; mentorLinks: MentorLink[]; sessions: Session[]; lessons: Lesson[]; lessonContent: LessonContent[] };

const inputClass = "h-11 w-full rounded-lg border border-white/15 bg-[#101319] px-3 text-sm text-off-white";
const panelClass = "grid content-start gap-4 rounded-2xl border border-white/10 bg-[#171B21] p-6";

function Select({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return <label className="grid gap-2 text-sm font-semibold text-off-white">{label}<select required className={inputClass} value={value} onChange={(event) => onChange(event.target.value)}>{children}</select></label>;
}

function Field({ label, value, onChange, type = "text", required = true }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return <label className="grid gap-2 text-sm font-semibold text-off-white">{label}<input className={inputClass} type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function Feedback({ error, message }: { error: string; message: string }) {
  return <>{error && <p role="alert" className="text-sm text-coral">{error}</p>}{message && <p role="status" className="text-sm text-mint">{message}</p>}</>;
}

async function save(url: string, method: string, body: object) {
  const response = await fetch(url, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error?.message ?? "Nao foi possivel salvar a alteracao.");
}

function localDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export function AdminManagement(props: Props) {
  return <section className="mt-10 grid gap-6 lg:grid-cols-2" aria-label="Gerenciamento da mentoria">
    <CohortPanel {...props} />
    <MentorPanel {...props} />
    <EnrollmentPanel {...props} />
    <SessionPanel {...props} />
    <LessonPanel {...props} />
  </section>;
}

function CohortPanel({ cohorts }: Props) {
  const router = useRouter();
  const [id, setId] = useState("");
  const [form, setForm] = useState({ name: "", startsOn: "", endsOn: "", capacity: "20", status: "draft" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  function selectCohort(value: string) { const row = cohorts.find((item) => item.id === value); setId(value); setForm({ name: row?.name ?? "", startsOn: row?.starts_on ?? "", endsOn: row?.ends_on ?? "", capacity: String(row?.capacity ?? 20), status: row?.status ?? "draft" }); setError(""); setMessage(""); }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try { await save(`/api/v1/mentorship/admin/cohorts/${encodeURIComponent(id)}`, "PATCH", { ...form, capacity: Number(form.capacity) }); setMessage("Turma atualizada."); router.refresh(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Falha ao atualizar turma."); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className={panelClass}><h2 className="text-xl font-black text-off-white">Editar turma</h2>
    <Select label="Turma" value={id} onChange={selectCohort}><option value="">Selecione uma turma</option>{cohorts.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</Select>
    <Field label="Nome" value={form.name} onChange={(name) => setForm({ ...form, name })} />
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Inicio" type="date" value={form.startsOn} onChange={(startsOn) => setForm({ ...form, startsOn })} /><Field label="Fim" type="date" value={form.endsOn} onChange={(endsOn) => setForm({ ...form, endsOn })} /></div>
    <Field label="Capacidade" type="number" value={form.capacity} onChange={(capacity) => setForm({ ...form, capacity })} />
    <Select label="Status" value={form.status} onChange={(status) => setForm({ ...form, status })}><option value="draft">Rascunho</option><option value="enrollment">Matriculas abertas</option><option value="active">Ativa</option><option value="completed">Concluida</option><option value="archived">Arquivada</option></Select>
    <Feedback error={error} message={message} /><Button type="submit" disabled={busy || !id}>{busy ? "Salvando..." : "Atualizar turma"}</Button>
  </form>;
}

function MentorPanel({ cohorts, people, mentorLinks }: Props) {
  const router = useRouter();
  const [cohortId, setCohortId] = useState("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("lead");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const personName = (id: string) => people.find((person) => person.id === id)?.fullName ?? id;
  const cohortName = (id: string) => cohorts.find((cohort) => cohort.id === id)?.name ?? id;
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try { await save("/api/v1/mentorship/admin/staff", "POST", { cohortId, userId, role }); setMessage("Mentor associado a turma."); router.refresh(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Falha ao associar mentor."); }
    finally { setBusy(false); }
  }
  async function remove(link: MentorLink) {
    setBusy(true); setError(""); setMessage("");
    try { await save("/api/v1/mentorship/admin/staff", "DELETE", { cohortId: link.cohort_id, userId: link.staff_user_id }); setMessage("Mentor removido da turma."); router.refresh(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Falha ao remover mentor."); }
    finally { setBusy(false); }
  }
  return <div className={panelClass}><h2 className="text-xl font-black text-off-white">Mentores por turma</h2><form onSubmit={submit} className="grid gap-4">
    <Select label="Turma" value={cohortId} onChange={setCohortId}><option value="">Selecione uma turma</option>{cohorts.map((cohort) => <option key={cohort.id} value={cohort.id}>{cohort.name}</option>)}</Select>
    <Select label="Usuario" value={userId} onChange={setUserId}><option value="">Selecione um usuario</option>{people.map((person) => <option key={person.id} value={person.id}>{person.fullName} · {person.email}</option>)}</Select>
    <Select label="Papel na turma" value={role} onChange={setRole}><option value="lead">Mentor principal</option><option value="reviewer">Revisor</option><option value="facilitator">Facilitador</option></Select>
    <Button type="submit" disabled={busy || !cohorts.length || !people.length}>{busy ? "Salvando..." : "Associar mentor"}</Button>
  </form><Feedback error={error} message={message} /><div className="grid gap-2"><h3 className="text-sm font-bold text-off-white">Associacoes atuais</h3>{mentorLinks.length ? mentorLinks.map((link) => <div key={`${link.cohort_id}:${link.staff_user_id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 p-3 text-sm"><span>{personName(link.staff_user_id)} · {cohortName(link.cohort_id)} · {link.role}</span><Button type="button" variant="outline" disabled={busy} onClick={() => remove(link)}>Remover</Button></div>) : <p className="text-sm text-[#AAB2BC]">Nenhum mentor associado.</p>}</div></div>;
}

function EnrollmentPanel({ cohorts, people, enrollments }: Props) {
  const router = useRouter();
  const [id, setId] = useState("");
  const selected = enrollments.find((row) => row.id === id);
  const [status, setStatus] = useState("invited");
  const [level, setLevel] = useState("beginner");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  function selectEnrollment(value: string) { const row = enrollments.find((item) => item.id === value); setId(value); setStatus(row?.status ?? "invited"); setLevel(row?.level ?? "beginner"); setMessage(""); setError(""); }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try { await save(`/api/v1/mentorship/admin/enrollments/${encodeURIComponent(id)}`, "PATCH", { status, level }); setMessage("Matricula atualizada."); router.refresh(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Falha ao atualizar matricula."); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className={panelClass}><h2 className="text-xl font-black text-off-white">Status da matricula</h2>
    <Select label="Aluno e turma" value={id} onChange={selectEnrollment}><option value="">Selecione uma matricula</option>{enrollments.map((row) => <option key={row.id} value={row.id}>{people.find((person) => person.id === row.user_id)?.fullName ?? row.user_id} · {cohorts.find((cohort) => cohort.id === row.cohort_id)?.name ?? row.cohort_id}</option>)}</Select>
    <Select label="Status" value={status} onChange={setStatus}><option value="invited">Convidado</option><option value="active">Ativo</option><option value="paused">Pausado</option><option value="completed">Concluido</option><option value="cancelled">Cancelado</option></Select>
    <Select label="Nivel" value={level} onChange={setLevel}><option value="beginner">Iniciante</option><option value="intermediate">Intermediario</option></Select>
    {selected && <p className="text-xs text-[#AAB2BC]">Status atual: {selected.status}</p>}<Feedback error={error} message={message} /><Button type="submit" disabled={busy || !id}>{busy ? "Salvando..." : "Atualizar matricula"}</Button>
  </form>;
}

function SessionPanel({ cohorts, sessions }: Props) {
  const router = useRouter();
  const [id, setId] = useState("");
  const [form, setForm] = useState({ title: "", agenda: "", startsAt: "", endsAt: "", meetingUrl: "", recordingUrl: "", recordingAvailableUntil: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  function selectSession(value: string) { const row = sessions.find((item) => item.id === value); setId(value); setForm({ title: row?.title ?? "", agenda: row?.agenda ?? "", startsAt: localDate(row?.starts_at ?? null), endsAt: localDate(row?.ends_at ?? null), meetingUrl: row?.meeting_url ?? "", recordingUrl: row?.recording_url ?? "", recordingAvailableUntil: localDate(row?.recording_available_until ?? null) }); setMessage(""); setError(""); }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try { await save(`/api/v1/mentorship/admin/sessions/${encodeURIComponent(id)}`, "PATCH", form); setMessage("Encontro atualizado."); router.refresh(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Falha ao atualizar encontro."); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className={panelClass}><h2 className="text-xl font-black text-off-white">Editar encontro</h2>
    <Select label="Encontro" value={id} onChange={selectSession}><option value="">Selecione um encontro</option>{sessions.map((row) => <option key={row.id} value={row.id}>{cohorts.find((cohort) => cohort.id === row.cohort_id)?.name ?? "Turma"} · Semana {row.week_number} · {row.title}</option>)}</Select>
    <Field label="Titulo" value={form.title} onChange={(title) => setForm({ ...form, title })} /><label className="grid gap-2 text-sm font-semibold text-off-white">Pauta<textarea required rows={4} className="rounded-lg border border-white/15 bg-[#101319] px-3 py-2 text-sm text-off-white" value={form.agenda} onChange={(event) => setForm({ ...form, agenda: event.target.value })} /></label>
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Inicio" type="datetime-local" value={form.startsAt} onChange={(startsAt) => setForm({ ...form, startsAt })} /><Field label="Fim" type="datetime-local" value={form.endsAt} onChange={(endsAt) => setForm({ ...form, endsAt })} /></div>
    <Field label="Link da sala" type="url" value={form.meetingUrl} onChange={(meetingUrl) => setForm({ ...form, meetingUrl })} /><Field label="Link da gravacao" type="url" required={false} value={form.recordingUrl} onChange={(recordingUrl) => setForm({ ...form, recordingUrl })} /><Field label="Gravacao disponivel ate" type="datetime-local" required={false} value={form.recordingAvailableUntil} onChange={(recordingAvailableUntil) => setForm({ ...form, recordingAvailableUntil })} />
    <Feedback error={error} message={message} /><Button type="submit" disabled={busy || !id}>{busy ? "Salvando..." : "Atualizar encontro"}</Button>
  </form>;
}

function LessonPanel({ lessons, lessonContent }: Props) {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [form, setForm] = useState({ videoUrl: "", materialUrl: "", status: "draft", availableAt: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  function selectLesson(value: string) { const row = lessonContent.find((item) => item.lesson_key === value); setKey(value); setForm({ videoUrl: row?.video_url ?? "", materialUrl: row?.material_url ?? "", status: row?.status ?? "draft", availableAt: localDate(row?.available_at ?? null) }); setError(""); setMessage(""); }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try { await save(`/api/v1/mentorship/admin/lessons/${encodeURIComponent(key)}`, "PUT", form); setMessage("Conteudo da aula salvo."); router.refresh(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Falha ao salvar conteudo."); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className={panelClass}><h2 className="text-xl font-black text-off-white">Conteudo das aulas</h2>
    <Select label="Aula" value={key} onChange={selectLesson}><option value="">Selecione uma aula</option>{lessons.map((lesson) => <option key={lesson.key} value={lesson.key}>Semana {lesson.week} · {lesson.title}</option>)}</Select>
    <Field label="Link do video" type="url" required={false} value={form.videoUrl} onChange={(videoUrl) => setForm({ ...form, videoUrl })} /><Field label="Link do material" type="url" required={false} value={form.materialUrl} onChange={(materialUrl) => setForm({ ...form, materialUrl })} />
    <Select label="Publicacao" value={form.status} onChange={(status) => setForm({ ...form, status })}><option value="draft">Rascunho</option><option value="published">Publicado</option><option value="scheduled">Agendado</option></Select>
    {form.status === "scheduled" && <Field label="Disponivel a partir de" type="datetime-local" value={form.availableAt} onChange={(availableAt) => setForm({ ...form, availableAt })} />}
    <Feedback error={error} message={message} /><Button type="submit" disabled={busy || !key}>{busy ? "Salvando..." : "Salvar conteudo"}</Button>
  </form>;
}
