"use client";

// Ambiente de prática Agendamentos.
//
// A grade de horários é o oráculo visível do ambiente: ela mostra o que a
// regra de conflito considera ocupado. Quem barra de verdade é o servidor
// (lib/product/practice/domain.ts) — a grade só reflete a mesma função. Com um
// desvio plantado ativo, as duas divergem do esperado juntas, e é isso que o
// aluno precisa perceber e reproduzir.

import { useState } from "react";
import { CalendarX2, Check, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnvironmentShell } from "@/components/practice/environment-shell";
import { ResourceForm } from "@/components/practice/resource-form";
import { RecordTable } from "@/components/practice/record-table";
import { useListControls } from "@/components/practice/list-controls";
import { PracticeSection, StatGrid } from "@/components/practice/ui";
import { usePracticeApp, type AppRows } from "@/components/practice/use-practice-app";
import { findPracticeApp } from "@/lib/product/apps";
import { fold, formatDate, money, weekdayName, weekdayOf, weekdays } from "@/lib/product/practice/format";
import { agendaSummary, bookingsByDate, slotsForDate, windowsForDate, type Availability, type Service } from "@/lib/product/practice/views";
import type { Booking } from "@/lib/product/practice/rules";
import type { PracticeSettings } from "@/lib/product/practice/store";

const app = findPracticeApp("agendamentos")!;

// Data fixa da massa de teste — a agenda abre onde os dados estão, para o
// cenário ser o mesmo para todo mundo.
const defaultDate = "2026-08-18";

export function AppointmentsApp({ initial, settings, signedIn }: { initial: AppRows; settings: PracticeSettings; signedIn: boolean }) {
  const practice = usePracticeApp(initial, { persist: signedIn, activeBugs: settings.activeBugs });
  const bookings = practice.use("agendamentos.bookings");
  const services = practice.use("agendamentos.services");
  const availability = practice.use("agendamentos.availability");

  const [date, setDate] = useState(defaultDate);
  const [picked, setPicked] = useState("");

  const rows = {
    bookings: bookings.rows as unknown as Booking[],
    services: services.rows as unknown as Service[],
    availability: availability.rows as unknown as Availability[],
  };

  const slots = slotsForDate({ availability: rows.availability, bookings: rows.bookings }, date, settings.activeBugs);
  const windows = windowsForDate(rows.availability, date);
  const summary = agendaSummary(rows.bookings);
  const serviceNames = rows.services.map((service) => service.name);

  const list = useListControls(bookings.rows, {
    searchLabel: "Buscar agendamento",
    searchPlaceholder: "Cliente ou serviço",
    search: (items, query) => {
      const needle = fold(query);
      return items.filter((item) => fold(`${item.customer} ${item.service}`).includes(needle));
    },
    filters: [{ field: "status", label: "Situação", options: [{ value: "confirmado", label: "Confirmado" }, { value: "cancelado", label: "Cancelado" }] }],
    sorts: [
      { id: "date-asc", label: "Data (próximos)", compare: (a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`) },
      { id: "date-desc", label: "Data (mais recentes)", compare: (a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`) },
      { id: "customer", label: "Cliente (A–Z)", compare: (a, b) => String(a.customer).localeCompare(String(b.customer), "pt-BR") },
    ],
  });

  return <EnvironmentShell app={app} settings={settings} signedIn={signedIn}>
    <div className="mt-8">
      <StatGrid items={[
        { label: "Agendamentos confirmados", value: summary.confirmed, tone: "positive" },
        { label: "Cancelados", value: summary.cancelled },
        { label: "Dias com agenda", value: summary.days },
      ]} />
    </div>

    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="grid gap-6">
        <PracticeSection
          id="grade"
          title="Grade do dia"
          description="Escolha um horário livre para preencher a reserva. Horário ocupado mostra de quem é."
          action={<label className="grid gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">Dia</span>
            <input type="date" value={date} onChange={(event) => { setDate(event.target.value); setPicked(""); }} className="input w-44" aria-label="Dia da agenda" />
          </label>}
        >
          <p className="text-sm text-muted-foreground">
            {windows.length === 0
              ? `Sem atendimento configurado para ${weekdayName(weekdayOf(date))}.`
              : `${weekdayName(weekdayOf(date))}, ${windows.map((window) => `${window.start_time.slice(0, 5)} às ${window.end_time.slice(0, 5)}`).join(" e ")}.`}
          </p>

          {slots.length === 0
            ? <p className="mt-4 rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">Nenhum horário disponível neste dia. Configure a disponibilidade ao lado.</p>
            : <ul className="mt-4 flex flex-wrap gap-2">{slots.map((slot) => {
                const taken = Boolean(slot.taken);
                return <li key={slot.time}>
                  <button
                    type="button"
                    onClick={() => !taken && setPicked(slot.time)}
                    aria-pressed={picked === slot.time}
                    aria-label={taken ? `${slot.time} ocupado por ${slot.taken!.customer}` : `Escolher ${slot.time}`}
                    className={`flex min-w-[86px] flex-col items-start gap-0.5 rounded-md border px-3 py-2 text-left text-sm transition focus-visible:ring-2 focus-visible:ring-ring/40 ${
                      taken ? "cursor-not-allowed border-border bg-muted/40 text-muted-foreground"
                        : picked === slot.time ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50 hover:bg-accent"}`}
                  >
                    <span className="font-mono">{slot.time}</span>
                    <span className="text-[11px]">{taken ? slot.taken!.customer : "livre"}</span>
                  </button>
                </li>;
              })}</ul>}
        </PracticeSection>

        <PracticeSection id="nova-reserva" title="Nova reserva" description="O horário precisa estar dentro do atendimento do dia e livre.">
          <ResourceForm
            handle={bookings}
            defaults={{ status: "confirmado" }}
            sync={{ date, ...(picked ? { time: picked } : {}) }}
            suggestions={{ service: serviceNames, customer: [...new Set(rows.bookings.map((booking) => booking.customer))] }}
            submitLabel="Agendar"
            onDone={() => setPicked("")}
          />
        </PracticeSection>

        <PracticeSection id="agenda" title="Agenda" description="Todos os agendamentos, do mais próximo ao mais distante.">
          {list.ui}
          <div className="mt-4">
            <RecordTable
              handle={bookings}
              rows={list.visible}
              columns={["date", "time", "customer", "service", "status"]}
              suggestions={{ service: serviceNames }}
              empty={list.hasFilters ? "Nenhum agendamento encontrado com esses filtros." : "Nenhum agendamento registrado."}
              renderCell={(row, field) => {
                if (field !== "status") return undefined;
                return row.status === "confirmado"
                  ? <span className="inline-flex items-center gap-1.5 text-primary"><Check className="size-3.5" aria-hidden="true" /> Confirmado</span>
                  : <span className="inline-flex items-center gap-1.5 text-muted-foreground"><CalendarX2 className="size-3.5" aria-hidden="true" /> Cancelado</span>;
              }}
            />
          </div>
        </PracticeSection>

        <PracticeSection id="por-dia" title="Resumo por dia" description="Para conferir se cancelar libera mesmo o horário.">
          {bookingsByDate(rows.bookings).length === 0
            ? <p className="rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">Nenhum agendamento na agenda.</p>
            : <ul className="grid gap-4">{bookingsByDate(rows.bookings).map((group) => <li key={group.date}>
                <h3 className="text-sm font-medium">{formatDate(group.date)} <span className="font-normal text-muted-foreground">· {weekdayName(weekdayOf(group.date))}</span></h3>
                <ul className="mt-2 grid gap-1.5">{group.items.map((booking) => <li key={booking.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm">
                  <span className="flex items-center gap-2.5">
                    <Clock className="size-3.5 text-muted-foreground" aria-hidden="true" />
                    <span className="font-mono text-xs">{booking.time.slice(0, 5)}</span>
                    <span>{booking.customer}</span>
                    <span className="text-muted-foreground">· {booking.service}</span>
                  </span>
                  {booking.status === "confirmado"
                    ? <Button size="xs" variant="outline" disabled={bookings.pending === booking.id} onClick={() => bookings.update(booking.id, { status: "cancelado" })}>Cancelar</Button>
                    : <Badge variant="secondary" className="font-normal">Cancelado</Badge>}
                </li>)}</ul>
              </li>)}</ul>}
        </PracticeSection>
      </div>

      <div className="grid gap-6">
        <PracticeSection id="servicos" title="Serviços" description="O que pode ser agendado, com duração e preço.">
          <ResourceForm handle={services} columns={1} />
          <div className="mt-5">
            <RecordTable
              handle={services}
              columns={["name", "duration_minutes", "price"]}
              empty="Nenhum serviço cadastrado."
              renderCell={(row, field) => field === "duration_minutes" ? `${row.duration_minutes} min` : field === "price" ? money(Number(row.price)) : undefined}
            />
          </div>
        </PracticeSection>

        <PracticeSection id="disponibilidade" title="Disponibilidade" description="As faixas de atendimento de cada dia da semana.">
          <ResourceForm handle={availability} columns={1} />
          <div className="mt-5">
            <RecordTable
              handle={availability}
              columns={["weekday", "start_time", "end_time"]}
              empty="Nenhuma faixa configurada — com isso, nenhum horário fica disponível."
            />
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            Dias sem faixa não aceitam agendamento: {weekdays.filter((_, index) => !rows.availability.some((item) => Number(item.weekday) === index)).join(", ") || "nenhum"}.
          </p>
        </PracticeSection>
      </div>
    </div>
  </EnvironmentShell>;
}
