"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { LabShell } from "./login-lab";
import { SelectField, toOptions } from "@/components/ui/select-field";

type NoteType = "observacao" | "hipotese" | "duvida" | "bug";

export function ExploratoryLab() {
  const [noteType, setNoteType] = useState<NoteType>("observacao");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<Array<{ type: NoteType; text: string; minute: number }>>([]);
  const [bug, setBug] = useState({ title: "", steps: "", expected: "", actual: "", impact: "", severity: "media", evidence: "" });
  const report = useMemo(() => {
    const noteLines = notes.map((item) => `- [${item.minute}min][${item.type}] ${item.text}`).join("\n");
    return `# Charter exploratorio - Checkout em 30 minutos\n\n## Missao\nExplorar login, carrinho e checkout buscando riscos de regra de negocio, mensagens e interrupcoes.\n\n## Notas\n${noteLines || "- Sem notas registradas."}\n\n## Bug report\nTitulo: ${bug.title || "Nao informado"}\nSeveridade: ${bug.severity}\nImpacto: ${bug.impact || "Nao informado"}\nPassos: ${bug.steps || "Nao informado"}\nEsperado: ${bug.expected || "Nao informado"}\nAtual: ${bug.actual || "Nao informado"}\nEvidencia: ${bug.evidence || "Nao informado"}\n`;
  }, [bug, notes]);

  function addNote() {
    if (!note.trim()) return;
    setNotes([...notes, { type: noteType, text: note.trim(), minute: Math.min(30, notes.length * 3) }]);
    setNote("");
  }

  return (
    <LabShell title="Lab 41: charter exploratorio" description="Execute uma sessao curta com charter, notas por tipo, bug report e export Markdown.">
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <section className="rounded-lg border border-white/10 bg-card p-5">
          <div className="rounded-lg border border-mint/20 bg-mint/10 p-4">
            <p className="font-mono text-xs text-mint">Timer: 30:00</p>
            <h2 className="mt-2 font-black text-off-white">Missao: checkout em 30 minutos</h2>
            <p className="mt-2 text-sm text-[#AAB2BC]">Cubra login, busca, carrinho, checkout, mensagens de erro, refresh e rede lenta simulada.</p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-[160px_1fr_auto]">
            <SelectField
              value={noteType}
              onChange={(next) => setNoteType(next as NoteType)}
              options={toOptions(["observacao", "hipotese", "duvida", "bug"])}
              aria-label="Tipo de nota"
            />
            <input value={note} onChange={(event) => setNote(event.target.value)} className="field" placeholder="Nota da sessao" data-testid="session-note" />
            <button onClick={addNote} className="rounded-lg bg-neon px-4 text-sm font-black text-[#101319]">Adicionar</button>
          </div>
          <div className="mt-5 grid gap-2">
            {notes.map((item, index) => <p key={`${item.text}-${index}`} className="rounded-lg border border-white/10 bg-[#101319] p-3 text-sm text-[#AAB2BC]">[{item.minute}min] {item.type}: {item.text}</p>)}
          </div>
          <div className="mt-6 grid gap-3">
            {(["title", "steps", "expected", "actual", "impact", "evidence"] as const).map((field) => (
              <label key={field} className="grid gap-2 text-sm font-bold text-off-white">{field}<textarea value={bug[field]} onChange={(event) => setBug({ ...bug, [field]: event.target.value })} className="field min-h-20" data-testid={`bug-${field}`} /></label>
            ))}
            <label className="grid gap-2 text-sm font-bold text-off-white">severity<SelectField value={bug.severity} onChange={(severity) => setBug({ ...bug, severity })} options={toOptions(["baixa", "media", "alta", "critica"])} aria-label="severity" /></label>
          </div>
        </section>
        <aside className="rounded-lg border border-white/10 bg-[#161B22] p-5">
          <div className="flex items-center justify-between gap-3"><h2 className="font-black text-off-white">Relatorio Markdown</h2><button onClick={() => navigator.clipboard?.writeText(report)} className="rounded-lg bg-mint px-3 py-2 text-sm font-black text-[#101319]"><Download className="inline size-4" /> Copiar</button></div>
          <pre className="mt-4 max-h-[620px] overflow-auto whitespace-pre-wrap rounded-lg bg-[#101319] p-4 text-xs leading-5 text-[#DDE6EE]" data-testid="exploratory-report">{report}</pre>
        </aside>
      </div>
    </LabShell>
  );
}
