"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowDownLeft, ArrowRight, BarChart3, Check, ChevronRight, ClipboardList,
  FilePlus2, FileText, LayoutDashboard, Plus, RefreshCcw, Search, Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectField, toOptions } from "@/components/ui/select-field";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  categories, expenseflowBugs, expenseSeed, profiles, statusLabel,
  type Expense, type ExpenseStatus, type TestProfile,
} from "@/data/expenseflow";
import { loadExpenses, resetExpenses, saveExpenses } from "@/lib/expenseflow-storage";
import { cn } from "@/lib/utils";

type View = "dashboard" | "new" | "expenses" | "approvals" | "reports";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dateLabel = (value: string) => new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR");
const roleLabel = { employee: "Colaborador", manager: "Gestora", admin: "Admin" };
const navigation = [
  { id: "dashboard", label: "Visão geral", icon: LayoutDashboard },
  { id: "expenses", label: "Despesas", icon: ClipboardList },
  { id: "new", label: "Nova despesa", icon: FilePlus2 },
  { id: "approvals", label: "Aprovações", icon: Check },
  { id: "reports", label: "Relatórios", icon: BarChart3 },
] as const;
const fieldClass = "h-11 rounded-xl border-[#46504A] bg-[#292F2C] text-[#EAF0EC] shadow-none placeholder:text-[#9AA9A0] focus-visible:border-[#75B88D] focus-visible:ring-[#75B88D]/15";
const selectClass = "h-11 rounded-xl border-[#46504A] bg-[#292F2C] text-[#EAF0EC] hover:bg-[#343B37] focus-visible:ring-[#75B88D]/15";
const selectContentClass = "border-[#46504A] bg-[#292F2C] text-[#EAF0EC]";
const secondaryButton = "border-[#46504A] bg-[#292F2C] text-[#DCE7DF] hover:bg-[#343B37] hover:text-white";
const primaryButton = "bg-[#2F8057] text-white hover:bg-[#3A9665]";

export function ExpenseFlowApp() {
  const [expenses, setExpenses] = useState<Expense[]>(expenseSeed);
  const [profileId, setProfileId] = useState("joao");
  const [view, setView] = useState<View>("dashboard");
  const [selected, setSelected] = useState<Expense | null>(null);
  const profile = profiles.find((item) => item.id === profileId) ?? profiles[0];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpenses(loadExpenses());
  }, []);

  function commit(next: Expense[]) {
    setExpenses(next);
    saveExpenses(next);
  }

  function reset() {
    commit(resetExpenses());
    setSelected(null);
    setView("dashboard");
    toast.success("Ambiente restaurado");
  }

  function decide(id: string, status: "approved" | "rejected", reason = "") {
    commit(expenses.map((expense) => expense.id === id
      ? { ...expense, status, rejectionReason: reason }
      : expense));
    toast.success(status === "approved" ? "Despesa aprovada" : "Despesa reprovada");
  }

  const visible = profile.role === "employee"
    ? expenses.filter((expense) => expense.employeeId === profile.id)
    : profile.role === "manager"
      ? expenses.filter((expense) => expense.teamId === profile.teamId)
      : expenses;
  const totals = {
    all: visible.reduce((sum, expense) => sum + expense.amount, 0),
    pending: visible.filter((expense) => expense.status === "pending").reduce((sum, expense) => sum + expense.amount, 0),
    approved: visible.filter((expense) => expense.status === "approved").reduce((sum, expense) => sum + expense.amount, 0),
    rejected: visible.filter((expense) => expense.status === "rejected").reduce((sum, expense) => sum + expense.amount, 0),
  };
  const pendingCount = visible.filter((expense) => expense.status === "pending").length;

  return (
    <div className="min-h-[calc(100vh-5.5rem)] bg-[#25292A] font-sans text-[#EAF0EC]">
      <div className="mx-auto grid max-w-[1600px] grid-cols-[minmax(0,1fr)] lg:min-h-[calc(100vh-5.5rem)] lg:grid-cols-[236px_minmax(0,1fr)]">
        <aside className="min-w-0 bg-[#14382B] text-white lg:flex lg:flex-col">
          <div className="hidden px-6 pb-9 pt-8 lg:block">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/12">
              <ArrowDownLeft className="size-5 text-[#B8E9C7]" strokeWidth={2.2} />
            </div>
            <p className="mt-5 text-xl font-semibold tracking-[-0.04em]">ExpenseFlow<span className="text-[#8DCDA4]">.</span></p>
            <p className="mt-1 text-xs text-[#A8C8B6]">Gestão de reembolsos</p>
          </div>

          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 lg:hidden">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-white/12"><ArrowDownLeft className="size-4 text-[#B8E9C7]" /></span>
              <span className="font-semibold tracking-tight">ExpenseFlow</span>
            </div>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-[#CDE5D4]">Ambiente de prática</span>
          </div>

          <nav aria-label="Navegação do ExpenseFlow" className="flex gap-1 overflow-x-auto px-3 py-3 lg:flex-col lg:overflow-visible lg:px-3 lg:py-0">
            {navigation.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                aria-current={view === id ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:w-full",
                  view === id ? "bg-[#E5F2E8] text-[#164D33]" : "text-[#B7D2C1] hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
                {id === "approvals" && pendingCount > 0 && (
                  <span className={cn("ml-auto rounded-md px-1.5 py-0.5 text-[10px] font-semibold", view === id ? "bg-[#C9E5D1]" : "bg-white/10")}>{pendingCount}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="hidden px-4 pb-6 pt-6 lg:mt-auto lg:block">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
              <p className="text-xs font-medium text-[#A8C8B6]">Área de prática</p>
              <p className="mt-2 text-sm leading-5 text-white">Encontrou um problema no fluxo?</p>
              <Link href="/playground/entregas" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#B8E9C7] hover:text-white">
                Documentar descoberta <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="flex flex-col gap-4 border-b border-[#3B4240] bg-[#202425] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
            <div>
              <p className="text-xs font-medium text-[#9AA9A0]">Workspace / Reembolsos</p>
              <p className="mt-0.5 text-sm font-semibold text-[#DCE7DF]">Ambiente de prática do QA Lab</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="min-w-[195px] flex-1 sm:flex-none">
                <SelectField
                  value={profileId}
                  onChange={setProfileId}
                  options={profiles.map((item) => ({ value: item.id, label: `${item.name} · ${roleLabel[item.role]}` }))}
                  aria-label="Perfil de teste"
                  className={selectClass}
                  contentClassName={selectContentClass}
                />
              </div>
              <Button type="button" variant="outline" onClick={reset} className={cn("h-11 rounded-xl px-3.5", secondaryButton)} title="Restaurar dados iniciais">
                <RefreshCcw className="size-4" /><span className="hidden sm:inline">Restaurar</span>
              </Button>
            </div>
          </header>

          <main className="mx-auto max-w-[1220px] px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
            {view === "dashboard" && <Dashboard expenses={visible} totals={totals} pendingCount={pendingCount} open={setSelected} navigate={setView} />}
            {view === "new" && <NewExpense profile={profile} save={(expense) => {
              commit([expense, ...expenses]);
              toast.success("Despesa salva");
              setView("expenses");
            }} />}
            {view === "expenses" && <ExpenseList expenses={visible} open={setSelected} navigate={setView} />}
            {view === "approvals" && <Approvals expenses={expenses} profile={profile} decide={decide} open={setSelected} />}
            {view === "reports" && <Reports expenses={visible} approved={totals.approved} />}
          </main>
        </div>
      </div>
      <ExpenseDetails expense={selected} close={() => setSelected(null)} />
    </div>
  );
}

function PageHeading({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[clamp(1.8rem,3vw,2.4rem)] font-semibold tracking-[-0.045em] text-[#F0F5F1]">{title}</h1>
        <p className="mt-1.5 max-w-xl text-sm leading-6 text-[#A3B0A8]">{description}</p>
      </div>
      {action}
    </div>
  );
}

function Surface({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-2xl border border-[#3B4340] bg-[#2E3332] shadow-[0_8px_30px_-22px_rgba(0,0,0,0.6)]", className)}>{children}</section>;
}

function Dashboard({ expenses, totals, pendingCount, open, navigate }: {
  expenses: Expense[];
  totals: { all: number; pending: number; approved: number; rejected: number };
  pendingCount: number;
  open: (expense: Expense) => void;
  navigate: (view: View) => void;
}) {
  return (
    <>
      <PageHeading
        title="Visão geral"
        description="Acompanhe solicitações, decisões e valores do perfil selecionado."
        action={<Button type="button" onClick={() => navigate("new")} className={cn("h-11 rounded-xl px-5", primaryButton)}><Plus className="size-4" /> Nova despesa</Button>}
      />

      <div className="mt-7 grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(270px,0.8fr)]">
        <div className="relative overflow-hidden rounded-[22px] bg-[#1A4A36] px-6 py-6 text-white sm:px-8 sm:py-8">
          <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-24 size-64 rounded-full border-[32px] border-white/[0.06]" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 right-24 size-52 rounded-full border-[22px] border-white/[0.05]" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#C8E1CF]">Aguardando decisão</span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-[#D8EFE0]">{pendingCount} {pendingCount === 1 ? "solicitação" : "solicitações"}</span>
            </div>
            <p className="mt-8 text-[clamp(2.3rem,5vw,3.6rem)] font-medium tracking-[-0.065em]">{money.format(totals.pending)}</p>
            <p className="mt-2 text-sm text-[#C8E1CF]">Valor total em análise</p>
            <button type="button" onClick={() => navigate("approvals")} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              Ver aprovações <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        <Surface className="flex flex-col justify-center px-6 py-5 sm:px-7">
          <p className="text-sm font-medium text-[#A3B0A8]">Resumo das despesas</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.045em] text-[#F0F5F1]">{money.format(totals.all)}</p>
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#414A45]" aria-hidden="true">
            <div className="h-full rounded-full bg-[#3F9A6A]" style={{ width: `${totals.all ? Math.max(0, Math.min(100, totals.approved / totals.all * 100)) : 0}%` }} />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[#414A45] pt-4">
            <div><p className="text-xs text-[#9EACA3]">Aprovado</p><p className="mt-1 text-base font-semibold text-[#80C99A]">{money.format(totals.approved)}</p></div>
            <div><p className="text-xs text-[#9EACA3]">Reprovado</p><p className="mt-1 text-base font-semibold text-[#E28B80]">{money.format(totals.rejected)}</p></div>
          </div>
        </Surface>
      </div>

      <Surface className="mt-6 overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-[#414A45] px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-base font-semibold tracking-tight">Despesas recentes</h2>
            <p className="mt-0.5 text-xs text-[#9EACA3]">Últimas movimentações deste perfil</p>
          </div>
          <button type="button" onClick={() => navigate("expenses")} className="inline-flex items-center gap-1 text-sm font-semibold text-[#246B4B] hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#246B4B]">Ver todas <ChevronRight className="size-4" /></button>
        </div>
        <ExpenseTable expenses={expenses.slice(0, 5)} open={open} />
      </Surface>
    </>
  );
}

function ExpenseTable({ expenses, open }: { expenses: Expense[]; open: (expense: Expense) => void }) {
  if (!expenses.length) return <EmptyState title="Nenhuma despesa encontrada" description="Cadastre uma despesa ou ajuste os filtros para ver resultados." />;
  return (
    <>
      <div className="divide-y divide-[#414A45] md:hidden">
        {expenses.map((expense) => (
          <button key={expense.id} type="button" onClick={() => open(expense)} className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left hover:bg-[#343B37] focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#75B88D]">
            <span className="min-w-0"><span className="block truncate text-sm font-semibold text-[#E6EEE9]">{expense.title}</span><span className="mt-1 block text-xs text-[#A3B0A8]">{expense.category} · {dateLabel(expense.date)}</span><span className="mt-2 block"><Status value={expense.status} /></span></span>
            <span className="shrink-0 pt-0.5 text-sm font-semibold tabular-nums">{money.format(expense.amount)}</span>
          </button>
        ))}
      </div>
      <Table className="hidden md:table">
          <TableHeader className="bg-[#292F2D]">
          <TableRow className="border-[#414A45] hover:bg-[#292F2D]">
          <TableHead className="pl-6 font-medium normal-case tracking-normal text-[#A3B0A8]">Despesa</TableHead>
            <TableHead className="font-medium normal-case tracking-normal text-[#A3B0A8]">Colaborador</TableHead>
            <TableHead className="font-medium normal-case tracking-normal text-[#A3B0A8]">Data</TableHead>
            <TableHead className="font-medium normal-case tracking-normal text-[#A3B0A8]">Status</TableHead>
            <TableHead className="pr-6 text-right font-medium normal-case tracking-normal text-[#A3B0A8]">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id} className="border-[#414A45] hover:bg-[#343B37]">
              <TableCell className="py-0 pl-6"><button type="button" onClick={() => open(expense)} className="block w-full py-3.5 text-left focus-visible:rounded focus-visible:outline-2 focus-visible:outline-[#75B88D]"><span className="block font-semibold text-[#E6EEE9]">{expense.title}</span><span className="mt-0.5 block text-xs text-[#A3B0A8]">{expense.category}</span></button></TableCell>
              <TableCell className="text-[#C0CCC4]">{expense.employeeName}</TableCell>
              <TableCell className="text-[#C0CCC4]">{dateLabel(expense.date)}</TableCell>
              <TableCell><Status value={expense.status} /></TableCell>
              <TableCell className="pr-6 text-right font-semibold tabular-nums text-[#E6EEE9]">{money.format(expense.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

function NewExpense({ profile, save }: { profile: TestProfile; save: (expense: Expense) => void }) {
  const [form, setForm] = useState({
    title: "", category: categories[0], amount: "", date: new Date().toISOString().slice(0, 10),
    description: "", receipt: "",
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.title || !form.category || !form.amount || !form.date || !form.receipt) return;
    save({
      id: `exp-${Date.now()}`, title: form.title, category: form.category,
      amount: Number(form.amount), date: form.date, status: "pending",
      employeeName: profile.name, employeeId: profile.id, teamId: profile.teamId,
      receiptFileName: form.receipt, description: form.description,
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <div className="max-w-[860px]">
      <PageHeading title="Nova despesa" description="Registre uma solicitação de reembolso e anexe o comprovante." />
      <Surface className="mt-7 overflow-hidden">
        <div className="border-b border-[#414A45] px-6 py-5 sm:px-8">
          <h2 className="font-semibold text-[#EDF3EF]">Dados da solicitação</h2>
          <p className="mt-1 text-sm text-[#A3B0A8]">Preencha os dados como aparecem no comprovante.</p>
        </div>
        <form onSubmit={submit} className="grid gap-5 px-6 py-6 sm:grid-cols-2 sm:px-8 sm:py-8">
          <Field label="Título" htmlFor="expense-title"><Input id="expense-title" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ex.: Táxi para reunião" className={fieldClass} /></Field>
          <Field label="Categoria" htmlFor="expense-category"><SelectField id="expense-category" value={form.category} onChange={(value) => setForm({ ...form, category: value })} options={toOptions(categories)} className={selectClass} contentClassName={selectContentClass} /></Field>
          <Field label="Valor (R$)" htmlFor="expense-amount"><Input id="expense-amount" required type="number" step="0.01" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} placeholder="0,00" className={fieldClass} /></Field>
          <Field label="Data da despesa" htmlFor="expense-date"><Input id="expense-date" required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className={fieldClass} /></Field>
          <Field label="Descrição" htmlFor="expense-description" wide><textarea id="expense-description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={4} placeholder="Contexto da despesa" className={cn(fieldClass, "min-h-28 w-full resize-y px-3 py-3 text-sm outline-none focus-visible:ring-[3px]")} /></Field>
          <Field label="Comprovante" htmlFor="expense-receipt" wide>
            <label htmlFor="expense-receipt" className="flex min-h-24 cursor-pointer items-center gap-4 rounded-xl border border-dashed border-[#53665A] bg-[#292F2C] px-5 py-4 transition-colors hover:bg-[#343B37] focus-within:ring-2 focus-within:ring-[#75B88D]">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#244934] text-[#9BDFB2]"><Upload className="size-5" /></span>
              <span className="min-w-0 text-sm"><span className="block truncate font-semibold text-[#E3ECE6]">{form.receipt || "Selecionar arquivo"}</span><span className="mt-1 block text-xs text-[#9EACA3]">O nome do arquivo ficará registrado na despesa.</span></span>
              <input id="expense-receipt" required type="file" className="sr-only" onChange={(event) => setForm({ ...form, receipt: event.target.files?.[0]?.name ?? "" })} />
            </label>
          </Field>
          <div className="flex justify-end border-t border-[#414A45] pt-6 sm:col-span-2">
            <Button type="submit" className={cn("h-11 rounded-xl px-6", primaryButton)}>Salvar despesa <ArrowRight className="size-4" /></Button>
          </div>
        </form>
      </Surface>
    </div>
  );
}

function ExpenseList({ expenses, open, navigate }: { expenses: Expense[]; open: (expense: Expense) => void; navigate: (view: View) => void }) {
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const list = useMemo(() => expenses.filter((expense) =>
    (status === "all" || expense.status === status || (expenseflowBugs.rejectedFilterLeaks && status === "rejected" && expense.id === "exp-1002"))
    && (category === "all" || expense.category === category)
    && (!date || expense.date === date)
    && expense.title.toLowerCase().includes(search.toLowerCase()),
  ), [expenses, status, category, date, search]);

  return (
    <>
      <PageHeading title="Despesas" description="Consulte solicitações e acompanhe cada decisão." action={<Button type="button" onClick={() => navigate("new")} className={cn("h-11 rounded-xl px-5", primaryButton)}><Plus className="size-4" /> Nova despesa</Button>} />
      <Surface className="mt-7 overflow-hidden">
        <div className="grid gap-3 border-b border-[#414A45] p-5 sm:grid-cols-2 lg:grid-cols-[minmax(180px,1.5fr)_repeat(3,minmax(120px,1fr))] sm:p-6">
          <div className="relative"><Search className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-[#A3B0A8]" /><Input aria-label="Buscar despesa" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar pelo título" className={cn(fieldClass, "pl-10")} /></div>
          <SelectField value={status} onChange={setStatus} aria-label="Filtrar por status" options={[{ value: "all", label: "Todos os status" }, { value: "pending", label: "Pendente" }, { value: "approved", label: "Aprovada" }, { value: "rejected", label: "Reprovada" }]} className={selectClass} contentClassName={selectContentClass} />
          <SelectField value={category} onChange={setCategory} aria-label="Filtrar por categoria" options={[{ value: "all", label: "Todas as categorias" }, ...toOptions(categories)]} className={selectClass} contentClassName={selectContentClass} />
          <Input aria-label="Filtrar por data" type="date" value={date} onChange={(event) => setDate(event.target.value)} className={fieldClass} />
        </div>
        <div className="flex items-center justify-between px-5 py-3 text-xs text-[#A3B0A8] sm:px-6"><span>{list.length} {list.length === 1 ? "despesa encontrada" : "despesas encontradas"}</span><span>Selecione uma despesa para ver os detalhes</span></div>
        <ExpenseTable expenses={list} open={open} />
      </Surface>
    </>
  );
}

function Approvals({ expenses, profile, decide, open }: {
  expenses: Expense[]; profile: TestProfile;
  decide: (id: string, status: "approved" | "rejected", reason?: string) => void;
  open: (expense: Expense) => void;
}) {
  const pending = expenses.filter((expense) =>
    expense.status === "pending"
    && (profile.role === "admin" || expense.teamId === profile.teamId
      || (expenseflowBugs.employeeSelfApproval && expense.employeeId === profile.id)),
  );
  const [reasons, setReasons] = useState<Record<string, string>>({});

  return (
    <>
      <PageHeading title="Aprovações" description="Revise solicitações pendentes e registre a decisão." />
      <div className="mt-7 space-y-3">
        {pending.map((expense) => (
          <Surface key={expense.id} className="p-5 sm:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2"><Status value={expense.status} /><span className="text-xs text-[#A3B0A8]">{dateLabel(expense.date)}</span></div>
                <button type="button" onClick={() => open(expense)} className="mt-2 block text-left text-lg font-semibold tracking-tight hover:text-[#246B4B] hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-[#246B4B]">{expense.title}</button>
                <p className="mt-1 text-sm text-[#A3B0A8]">{expense.employeeName} · {expense.category}</p>
                <p className="mt-3 text-xl font-semibold tabular-nums">{money.format(expense.amount)}</p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:flex-row xl:w-auto">
                <Input aria-label={`Justificativa para ${expense.title}`} value={reasons[expense.id] ?? ""} onChange={(event) => setReasons({ ...reasons, [expense.id]: event.target.value })} placeholder="Justificativa opcional" className={cn(fieldClass, "sm:min-w-48")} />
                <Button type="button" onClick={() => decide(expense.id, "rejected", reasons[expense.id] ?? "")} variant="outline" className="h-11 rounded-xl border-[#684843] bg-[#332A28] text-[#F0A59B] hover:bg-[#49312D] hover:text-[#FFC0B5]">Reprovar</Button>
                <Button type="button" onClick={() => decide(expense.id, "approved")} className={cn("h-11 rounded-xl px-5", primaryButton)}>Aprovar</Button>
              </div>
            </div>
          </Surface>
        ))}
        {!pending.length && <Surface><EmptyState title="Nenhuma aprovação pendente" description="Quando uma nova solicitação estiver disponível, ela aparecerá aqui." /></Surface>}
      </div>
    </>
  );
}

function Reports({ expenses, approved }: { expenses: Expense[]; approved: number }) {
  const byCategory = categories.map((category) => ({
    category, total: expenses.filter((expense) => expense.category === category).reduce((sum, expense) => sum + expense.amount, 0),
  })).filter((item) => item.total);
  const displayedApproved = approved + expenseflowBugs.approvedReportDelta;
  const pending = expenses.filter((expense) => expense.status === "pending").reduce((sum, expense) => sum + expense.amount, 0);
  const largest = Math.max(1, ...byCategory.map((item) => item.total));

  function exportCsv() {
    const rows = [["categoria", "total"], ...byCategory.map((item) => [item.category, String(item.total)])].map((row) => row.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([rows], { type: "text/csv" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "expenseflow-relatorio.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Relatório exportado");
  }

  return (
    <>
      <PageHeading title="Relatórios" description="Analise valores e categorias das despesas disponíveis." action={<Button type="button" variant="outline" onClick={exportCsv} className={cn("h-11 rounded-xl", secondaryButton)}><FileText className="size-4" /> Exportar CSV</Button>} />
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <Surface className="p-6"><p className="text-sm text-[#A3B0A8]">Total aprovado</p><p className="mt-4 text-3xl font-semibold tracking-[-0.05em] tabular-nums">{money.format(displayedApproved)}</p><span className="mt-4 inline-flex rounded-full bg-[#244934] px-2.5 py-1 text-xs font-medium text-[#A4DBB5]">Despesas aprovadas</span></Surface>
        <Surface className="p-6"><p className="text-sm text-[#A3B0A8]">Total pendente</p><p className="mt-4 text-3xl font-semibold tracking-[-0.05em] tabular-nums">{money.format(pending)}</p><span className="mt-4 inline-flex rounded-full bg-[#4A3C23] px-2.5 py-1 text-xs font-medium text-[#E9C778]">Aguardando decisão</span></Surface>
      </div>
      <Surface className="mt-5 p-6 sm:p-7">
        <h2 className="text-base font-semibold">Despesas por categoria</h2>
        <p className="mt-1 text-sm text-[#A3B0A8]">Soma das solicitações exibidas para este perfil.</p>
        <div className="mt-7 space-y-5">
          {byCategory.map(({ category, total }) => (
            <div key={category}>
              <div className="flex items-center justify-between gap-3 text-sm"><span className="font-medium">{category}</span><strong className="tabular-nums">{money.format(total)}</strong></div>
          <div className="mt-2 h-2 rounded-full bg-[#414A45]"><div className="h-full rounded-full bg-[#53A775]" style={{ width: `${Math.max(2, total / largest * 100)}%` }} /></div>
            </div>
          ))}
          {!byCategory.length && <p className="text-sm text-[#A3B0A8]">Ainda não há despesas para mostrar.</p>}
        </div>
      </Surface>
    </>
  );
}

function ExpenseDetails({ expense, close }: { expense: Expense | null; close: () => void }) {
  return (
    <Sheet open={Boolean(expense)} onOpenChange={(open) => { if (!open) close(); }}>
      <SheetContent className="w-full gap-0 border-l border-[#414A45] bg-[#252A29] text-[#EAF0EC] sm:max-w-[480px]" showCloseButton={false}>
        {expense && <>
          <SheetHeader className="border-b border-[#414A45] px-6 pb-5 pt-7">
            <div className="flex items-start justify-between gap-3"><Status value={expense.status} /><Button type="button" variant="outline" size="sm" onClick={close} className={cn("h-8 rounded-lg", secondaryButton)}>Fechar</Button></div>
            <SheetTitle className="mt-4 text-2xl tracking-[-0.04em] text-[#F0F5F1]">{expense.title}</SheetTitle>
            <SheetDescription className="text-[#A3B0A8]">Solicitação {expense.id}</SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto px-6 py-6">
            <p className="text-3xl font-semibold tracking-[-0.055em] tabular-nums">{money.format(expense.amount)}</p>
            <p className="mt-1 text-sm text-[#A3B0A8]">Valor solicitado</p>
            <dl className="mt-8 divide-y divide-[#414A45]">
              {[
                ["Colaborador", expense.employeeName],
                ["Categoria", expense.category],
                ["Data", dateLabel(expense.date)],
                ["Comprovante", expense.receiptFileName],
                ["Descrição", expense.description || "—"],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[110px_minmax(0,1fr)] gap-4 py-4 text-sm"><dt className="text-[#A3B0A8]">{label}</dt><dd className="break-words font-medium text-[#E0E9E3]">{value}</dd></div>
              ))}
            </dl>
            {expense.rejectionReason && <div className="mt-5 rounded-xl bg-[#3C2C29] p-4"><p className="text-xs font-semibold text-[#F0A59B]">Justificativa da reprovação</p><p className="mt-1 text-sm text-[#E4C5C0]">{expense.rejectionReason}</p></div>}
          </div>
        </>}
      </SheetContent>
    </Sheet>
  );
}

function Status({ value }: { value: ExpenseStatus }) {
  return <span className={cn(
    "inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold",
    value === "approved" ? "bg-[#244934] text-[#A4DBB5]" : value === "rejected" ? "bg-[#49312D] text-[#F0A59B]" : "bg-[#4A3C23] text-[#E9C778]",
  )}>{statusLabel[value]}</span>;
}

function Field({ label, htmlFor, wide, children }: { label: string; htmlFor: string; wide?: boolean; children: ReactNode }) {
  return <div className={cn(wide && "sm:col-span-2")}><label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-[#C5D2CA]">{label}</label>{children}</div>;
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="flex flex-col items-center px-5 py-12 text-center"><span className="flex size-11 items-center justify-center rounded-xl bg-[#244934] text-[#A4DBB5]"><ClipboardList className="size-5" /></span><p className="mt-4 font-semibold">{title}</p><p className="mt-1 max-w-sm text-sm text-[#A3B0A8]">{description}</p></div>;
}
