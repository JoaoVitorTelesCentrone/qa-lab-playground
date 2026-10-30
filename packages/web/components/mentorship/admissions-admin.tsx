"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Cohort = { id: string; name: string; status: string; starts_on: string; ends_on: string; capacity: number };
type Offer = { id: string; cohort_id: string; offer_code: string; title: string; summary: string; price: number; enrollment_opens_at: string | null; enrollment_closes_at: string | null; support_contact: string; terms: string; cancellation_policy: string; delivery_format: string; recordings_policy: string; weekly_rhythm: string; support_response_hours: number; expected_outcome: string; published: boolean; version: number };
type Application = { id: string; user_id: string; cohort_id: string | null; status: string; offer_id: string | null; created_at: string; decision_note: string; payment_reference: string | null; person: { fullName: string; email: string } };
type Order = { id: string; user_id: string; cohort_id: string; status: string; payment_status: string | null; amount: number; currency: string; mercado_pago_payment_id: string | null; created_at: string; reservation_expires_at: string; person: { fullName: string; email: string }; cohort: { name: string } };

const inputClass = "min-h-11 w-full rounded-lg border border-white/15 bg-[#101319] px-3 text-sm text-off-white";
const panelClass = "grid content-start gap-4 border border-white/10 bg-[#171B21] p-6";
function Field({ label, value, onChange, type = "text", required = true }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return <label className="grid gap-2 text-sm font-semibold text-off-white">{label}<input className={inputClass} type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}
function Notice({ error, message }: { error: string; message: string }) { return <>{error && <p role="alert" className="text-sm text-coral">{error}</p>}{message && <p role="status" className="text-sm text-mint">{message}</p>}</>; }

export function AdmissionsAdmin({ cohorts, offers, applications, orders }: { cohorts: Cohort[]; offers: Offer[]; applications: Application[]; orders: Order[] }) {
  return <section className="mt-10 grid gap-6" aria-label="Inscrições e pagamentos da mentoria">
    <div><p className="text-xs font-bold text-mint">Entrada de alunos</p><h2 className="mt-2 text-2xl font-black text-off-white">Oferta, inscrições e pagamentos</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[#AAB2BC]">Publique uma oferta somente quando preço, condições, datas, contato e turma estiverem corretos. Turmas em rascunho e ofertas não publicadas não aparecem para visitantes.</p></div>
    <div className="grid gap-6 lg:grid-cols-2"><OfferEditor cohorts={cohorts} offers={offers} /><OfferList offers={offers} cohorts={cohorts} /></div>
    <ApplicationQueue cohorts={cohorts} applications={applications} />
    <OrderQueue orders={orders} />
  </section>;
}

function OfferEditor({ cohorts, offers }: { cohorts: Cohort[]; offers: Offer[] }) {
  const router = useRouter();
  const empty = { cohortId: "", offerCode: "mentoria-turma", title: "Mentoria QA Lab", summary: "", price: "", enrollmentOpensAt: "", enrollmentClosesAt: "", supportContact: "", terms: "", cancellationPolicy: "", deliveryFormat: "", recordingsPolicy: "", weeklyRhythm: "", supportResponseHours: "", expectedOutcome: "", published: false };
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [message, setMessage] = useState("");
  function selectCohort(cohortId: string) {
    const offer = offers.find((item) => item.cohort_id === cohortId);
    const dateField = (value: string | null) => value ? new Date(new Date(value).getTime() - new Date(value).getTimezoneOffset() * 60000).toISOString().slice(0,16) : "";
    setForm(offer ? { cohortId, offerCode: offer.offer_code, title: offer.title, summary: offer.summary, price: String(offer.price), enrollmentOpensAt: dateField(offer.enrollment_opens_at), enrollmentClosesAt: dateField(offer.enrollment_closes_at), supportContact: offer.support_contact, terms: offer.terms, cancellationPolicy: offer.cancellation_policy, deliveryFormat: offer.delivery_format ?? "", recordingsPolicy: offer.recordings_policy ?? "", weeklyRhythm: offer.weekly_rhythm ?? "", supportResponseHours: offer.support_response_hours ? String(offer.support_response_hours) : "", expectedOutcome: offer.expected_outcome ?? "", published: offer.published } : { ...empty, cohortId });
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/v1/mentorship/admin/offers", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...form, price: Number(form.price), supportResponseHours: Number(form.supportResponseHours), enrollmentOpensAt: form.enrollmentOpensAt ? new Date(form.enrollmentOpensAt).toISOString() : null, enrollmentClosesAt: form.enrollmentClosesAt ? new Date(form.enrollmentClosesAt).toISOString() : null }) });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error?.message ?? "Não foi possível salvar a oferta.");
      setMessage("Oferta salva."); router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível salvar a oferta."); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className={panelClass}>
    <h3 className="text-xl font-black text-off-white">Configurar oferta da turma</h3>
    <label className="grid gap-2 text-sm font-semibold text-off-white">Turma<select required className={inputClass} value={form.cohortId} onChange={(event) => selectCohort(event.target.value)}><option value="">Selecione uma turma</option>{cohorts.map((cohort) => <option value={cohort.id} key={cohort.id}>{cohort.name} · {cohort.status}</option>)}</select></label>
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Código público" value={form.offerCode} onChange={(offerCode) => setForm({ ...form, offerCode })} /><Field label="Título" value={form.title} onChange={(title) => setForm({ ...form, title })} /><Field label="Preço em reais" type="number" value={form.price} onChange={(price) => setForm({ ...form, price })} /><Field label="Contato (e-mail ou URL)" type="text" value={form.supportContact} onChange={(supportContact) => setForm({ ...form, supportContact })} /></div>
    <label className="grid gap-2 text-sm font-semibold text-off-white">Resumo<textarea className={inputClass} rows={3} maxLength={2000} value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} /></label>
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Abre em" type="datetime-local" required={false} value={form.enrollmentOpensAt} onChange={(enrollmentOpensAt) => setForm({ ...form, enrollmentOpensAt })} /><Field label="Fecha em" type="datetime-local" required={false} value={form.enrollmentClosesAt} onChange={(enrollmentClosesAt) => setForm({ ...form, enrollmentClosesAt })} /></div>
    <label className="grid gap-2 text-sm font-semibold text-off-white">Condições da oferta<textarea required className={inputClass} rows={4} maxLength={8000} value={form.terms} onChange={(event) => setForm({ ...form, terms: event.target.value })} /></label>
    <label className="grid gap-2 text-sm font-semibold text-off-white">Cancelamento<textarea required className={inputClass} rows={4} maxLength={4000} value={form.cancellationPolicy} onChange={(event) => setForm({ ...form, cancellationPolicy: event.target.value })} /></label>
    <fieldset className="grid gap-4 border border-white/10 p-4"><legend className="px-2 text-sm font-bold text-neon">Informações operacionais exibidas ao aluno</legend>
      <label className="grid gap-2 text-sm font-semibold text-off-white">Formato<textarea className={inputClass} rows={2} maxLength={500} value={form.deliveryFormat} onChange={(event) => setForm({ ...form, deliveryFormat: event.target.value })} placeholder="Ex.: prática assíncrona com encontros ao vivo; informe duração e fuso dos encontros." /></label>
      <label className="grid gap-2 text-sm font-semibold text-off-white">Ritmo semanal<textarea className={inputClass} rows={2} maxLength={1000} value={form.weeklyRhythm} onChange={(event) => setForm({ ...form, weeklyRhythm: event.target.value })} placeholder="Dias, horários e carga esperada. Se ainda não definidos, não publique a oferta." /></label>
      <label className="grid gap-2 text-sm font-semibold text-off-white">Disponibilidade das gravações<textarea className={inputClass} rows={2} maxLength={1000} value={form.recordingsPolicy} onChange={(event) => setForm({ ...form, recordingsPolicy: event.target.value })} placeholder="Diga se haverá gravação, quando será publicada e por quanto tempo ficará disponível." /></label>
      <Field label="Prazo de primeira resposta do suporte (horas)" type="number" value={form.supportResponseHours} onChange={(supportResponseHours) => setForm({ ...form, supportResponseHours })} required={false} />
      <label className="grid gap-2 text-sm font-semibold text-off-white">Resultado esperado<textarea className={inputClass} rows={3} maxLength={1000} value={form.expectedOutcome} onChange={(event) => setForm({ ...form, expectedOutcome: event.target.value })} placeholder="Descreva entregas e competências observáveis; não prometa emprego ou contratação." /></label>
    </fieldset>
    <label className="flex items-start gap-3 text-sm leading-6 text-[#D9DEE4]"><input type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} className="mt-1 size-4 accent-[#9FE870]" /><span>Publicar oferta. A turma também precisa estar com matrículas abertas e todos os detalhes operacionais preenchidos.</span></label>
    <Notice error={error} message={message} /><Button type="submit" disabled={busy || !cohorts.length}>{busy ? "Salvando…" : offers.some((offer) => offer.cohort_id === form.cohortId) ? "Atualizar oferta" : "Salvar oferta"}</Button>
  </form>;
}

function OfferList({ offers, cohorts }: { offers: Offer[]; cohorts: Cohort[] }) {
  return <div className={panelClass}><h3 className="text-xl font-black text-off-white">Ofertas cadastradas</h3>{offers.length ? <ul className="grid gap-3">{offers.map((offer) => <li key={offer.id} className="border-b border-white/10 pb-3"><p className="font-bold text-off-white">{offer.title}</p><p className="mt-1 text-sm text-[#AAB2BC]">{cohorts.find((cohort) => cohort.id === offer.cohort_id)?.name ?? "Turma"} · R$ {Number(offer.price).toFixed(2)} · versão {offer.version}</p><p className="mt-1 text-xs font-bold text-mint">{offer.published ? "Publicada" : "Rascunho"}</p></li>)}</ul> : <p className="text-sm text-[#AAB2BC]">Nenhuma oferta cadastrada. A mentoria continuará mostrando a lista de interesse.</p>}</div>;
}

function ApplicationQueue({ cohorts, applications }: { cohorts: Cohort[]; applications: Application[] }) {
  return <div className={panelClass}><h3 className="text-xl font-black text-off-white">Solicitações e lista de interesse ({applications.length})</h3>{applications.length ? <div className="grid gap-4">{applications.map((application) => <ApplicationRow key={application.id} application={application} cohorts={cohorts} />)}</div> : <p className="text-sm text-[#AAB2BC]">Nenhuma solicitação pendente.</p>}</div>;
}

function ApplicationRow({ application, cohorts }: { application: Application; cohorts: Cohort[] }) {
  const router = useRouter();
  const [decision, setDecision] = useState(application.status === "awaiting_payment" ? "confirmed" : "waitlisted");
  const [source, setSource] = useState("manual"); const [cohortId, setCohortId] = useState(application.cohort_id ?? "");
  const [note, setNote] = useState(""); const [paymentReference, setPaymentReference] = useState("");
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [message, setMessage] = useState("");
  async function save() {
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch(`/api/v1/mentorship/admin/applications/${encodeURIComponent(application.id)}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ decision, source, cohortId: cohortId || null, note, paymentReference }) });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error?.message ?? "Não foi possível atualizar a inscrição.");
      setMessage("Inscrição atualizada."); router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível atualizar a inscrição."); }
    finally { setBusy(false); }
  }
  return <article className="grid gap-3 border-l-2 border-neon/60 pl-4 md:grid-cols-[1fr_1fr]"><div><p className="font-bold text-off-white">{application.person.fullName}</p><p className="text-sm text-[#AAB2BC]">{application.person.email}</p><p className="mt-1 text-xs text-[#8B949E]">{application.cohort_id ? cohorts.find((cohort) => cohort.id === application.cohort_id)?.name ?? "Turma" : "Lista geral"} · {application.status} · {new Date(application.created_at).toLocaleString("pt-BR")}</p>{application.decision_note && <p className="mt-2 text-xs text-[#AAB2BC]">Registro: {application.decision_note}</p>}</div><div className="grid gap-3"><div className="grid gap-3 sm:grid-cols-2"><label className="grid gap-1 text-xs font-semibold text-[#AAB2BC]">Ação<select className={inputClass} value={decision} onChange={(event) => setDecision(event.target.value)}><option value="confirmed">Confirmar matrícula</option><option value="waitlisted">Lista de espera</option><option value="rejected">Recusar</option><option value="cancelled">Cancelar</option></select></label><label className="grid gap-1 text-xs font-semibold text-[#AAB2BC]">Origem<select className={inputClass} value={source} onChange={(event) => setSource(event.target.value)}><option value="manual">Pagamento confirmado manualmente</option><option value="scholarship">Bolsa</option></select></label></div><label className="grid gap-1 text-xs font-semibold text-[#AAB2BC]">Turma<select className={inputClass} value={cohortId} onChange={(event) => setCohortId(event.target.value)}><option value="">Selecione a turma</option>{cohorts.map((cohort) => <option key={cohort.id} value={cohort.id}>{cohort.name}</option>)}</select></label><Field label={source === "scholarship" ? "Motivo da bolsa" : "Motivo da confirmação"} value={note} onChange={setNote} /><Field label="Referência de pagamento" required={decision === "confirmed" && source === "manual"} value={paymentReference} onChange={setPaymentReference} /><Button type="button" disabled={busy} onClick={save}>{busy ? "Salvando…" : "Registrar decisão"}</Button><Notice error={error} message={message} /></div></article>;
}

function OrderQueue({ orders }: { orders: Order[] }) {
  return <div className={panelClass}><h3 className="text-xl font-black text-off-white">Checkouts ({orders.length})</h3>{orders.length ? <div className="grid gap-4">{orders.map((order) => <OrderRow key={order.id} order={order} />)}</div> : <p className="text-sm text-[#AAB2BC]">Nenhum checkout foi iniciado.</p>}</div>;
}

function OrderRow({ order }: { order: Order }) {
  const router = useRouter();
  const [decision, setDecision] = useState("activate"); const [note, setNote] = useState(""); const [refundConfirmed, setRefundConfirmed] = useState(false);
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [message, setMessage] = useState("");
  async function resolve() {
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch(`/api/v1/mentorship/admin/orders/${encodeURIComponent(order.id)}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ decision, note, refundConfirmed }) });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error?.message ?? "Não foi possível conciliar o pagamento.");
      setMessage("Conciliação registrada."); router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível conciliar o pagamento."); }
    finally { setBusy(false); }
  }
  return <article className="grid gap-3 border-l-2 border-white/15 pl-4 md:grid-cols-[1fr_1fr]"><div><p className="font-bold text-off-white">{order.person.fullName} · {order.cohort.name}</p><p className="text-sm text-[#AAB2BC]">{order.person.email} · {new Intl.NumberFormat("pt-BR", { style: "currency", currency: order.currency }).format(Number(order.amount))}</p><p className="mt-1 text-xs text-[#8B949E]">{order.status} · pagamento {order.payment_status ?? "sem confirmação"} · ID {order.mercado_pago_payment_id ?? "—"}</p></div>{order.status === "paid_no_seat" ? <div className="grid gap-3"><label className="grid gap-1 text-xs font-semibold text-[#AAB2BC]">Ação<select className={inputClass} value={decision} onChange={(event) => setDecision(event.target.value)}><option value="activate">Ativar matrícula se existir vaga</option><option value="refund_recorded">Registrar reembolso já processado</option></select></label><Field label="Registro da conciliação" value={note} onChange={setNote} />{decision === "refund_recorded" && <label className="flex gap-2 text-xs text-[#D9DEE4]"><input type="checkbox" className="accent-[#9FE870]" checked={refundConfirmed} onChange={(event) => setRefundConfirmed(event.target.checked)} />Confirmei o reembolso no painel do Mercado Pago</label>}<Button type="button" disabled={busy} onClick={resolve}>{busy ? "Salvando…" : "Registrar conciliação"}</Button><Notice error={error} message={message} /></div> : <p className="text-xs text-[#8B949E]">Reserva expira em {new Date(order.reservation_expires_at).toLocaleString("pt-BR")}</p>}</article>;
}
