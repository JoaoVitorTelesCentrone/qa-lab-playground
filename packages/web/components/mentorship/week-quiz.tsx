"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";

type Question = { question: string; answer: string };

type QuizRating = "yes" | "review" | null;
type QuizProgress = { drafts: string[]; revealed: boolean[]; ratings: QuizRating[] };

function isQuizProgress(value: unknown, questionCount: number): value is QuizProgress {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<QuizProgress>;
  return Array.isArray(candidate.drafts)
    && candidate.drafts.length === questionCount
    && candidate.drafts.every((item) => typeof item === "string")
    && Array.isArray(candidate.revealed)
    && candidate.revealed.length === questionCount
    && candidate.revealed.every((item) => typeof item === "boolean")
    && Array.isArray(candidate.ratings)
    && candidate.ratings.length === questionCount
    && candidate.ratings.every((item) => item === null || item === "yes" || item === "review");
}

function subscribeToBrowserReady() {
  return () => undefined;
}

function getBrowserReadySnapshot() {
  return typeof window !== "undefined";
}

function getServerBrowserReadySnapshot() {
  return false;
}

function emptyProgress(questionCount: number): QuizProgress {
  return { drafts: Array.from({ length: questionCount }, () => ""), revealed: Array.from({ length: questionCount }, () => false), ratings: Array.from({ length: questionCount }, () => null) };
}

function readProgress(storageKey: string, questionCount: number): QuizProgress | null {
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      const progress: unknown = JSON.parse(saved);
      if (isQuizProgress(progress, questionCount)) return progress;
    }
  } catch {
    // The quiz remains usable when browser storage is disabled or unavailable.
  }
  return null;
}

export function WeekQuiz({ questions, weekNumber }: { questions: readonly Question[]; weekNumber: number }) {
  const browserReady = useSyncExternalStore(subscribeToBrowserReady, getBrowserReadySnapshot, getServerBrowserReadySnapshot);
  if (!browserReady) return <p role="status" className="text-sm text-[#AAB2BC]">Preparando seu quiz…</p>;

  return <WeekQuizForm questions={questions} weekNumber={weekNumber} />;
}

function WeekQuizForm({ questions, weekNumber }: { questions: readonly Question[]; weekNumber: number }) {
  const storageKey = `qa-lab:mentorship-quiz:v1:week-${weekNumber}`;
  const [progress, setProgress] = useState<QuizProgress>(() => readProgress(storageKey, questions.length) ?? emptyProgress(questions.length));
  const { drafts, revealed, ratings } = progress;
  const finished = ratings.every(Boolean);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch {
      // Keep in-memory answers even when the browser cannot persist them.
    }
  }, [progress, storageKey]);

  function restart() {
    setProgress(emptyProgress(questions.length));
  }

  return <div className="max-w-[72ch]">
    <p className="text-base leading-8 text-[#C8CFD7]">Responda com suas palavras antes de conferir a resposta comentada. Depois, marque se conseguiu explicar o raciocínio. Suas respostas ficam salvas neste navegador para você continuar depois.</p>
    <div className="mt-8 space-y-12">
      {questions.map((item, index) => <section key={item.question} className="border-t border-white/15 pt-7">
        <p className="text-sm font-bold text-mint">Questão {index + 1} de {questions.length}</p>
        <h2 className="mt-3 text-xl font-bold leading-8 text-off-white">{item.question}</h2>
        <label htmlFor={`answer-${index}`} className="mt-6 block text-sm font-semibold text-[#C8CFD7]">Sua resposta</label>
        <textarea id={`answer-${index}`} rows={4} value={drafts[index]} onChange={(event) => setProgress((current) => ({ ...current, drafts: current.drafts.map((value, i) => i === index ? event.target.value : value) }))} className="mt-2 w-full resize-y border border-white/25 bg-[#171B21] p-4 text-base leading-7 text-off-white outline-none focus-visible:border-mint focus-visible:ring-2 focus-visible:ring-mint" placeholder="Escreva seu raciocínio aqui" />
        {!revealed[index] ? <button type="button" disabled={!drafts[index].trim()} onClick={() => setProgress((current) => ({ ...current, revealed: current.revealed.map((value, i) => i === index ? true : value) }))} className="mt-4 bg-mint px-5 py-3 text-sm font-bold text-[#101319] hover:bg-neon disabled:cursor-not-allowed disabled:opacity-50">Comparar resposta</button> : <div className="mt-5 border-l-2 border-mint bg-[#171B21] p-5">
          <h3 className="font-bold text-off-white">Resposta comentada</h3>
          <p className="mt-3 text-base leading-8 text-[#C8CFD7]">{item.answer}</p>
          <p className="mt-6 text-sm font-semibold text-off-white">Você conseguiu explicar a ideia principal?</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button type="button" aria-pressed={ratings[index] === "yes"} onClick={() => setProgress((current) => ({ ...current, ratings: current.ratings.map((value, i) => i === index ? "yes" : value) }))} className={`border px-4 py-2 text-sm font-bold ${ratings[index] === "yes" ? "border-mint bg-mint/15 text-mint" : "border-white/25 text-[#C8CFD7] hover:border-mint"}`}>Sim, entendi</button>
            <button type="button" aria-pressed={ratings[index] === "review"} onClick={() => setProgress((current) => ({ ...current, ratings: current.ratings.map((value, i) => i === index ? "review" : value) }))} className={`border px-4 py-2 text-sm font-bold ${ratings[index] === "review" ? "border-mint bg-mint/15 text-mint" : "border-white/25 text-[#C8CFD7] hover:border-mint"}`}>Preciso revisar</button>
          </div>
        </div>}
      </section>)}
    </div>
    {finished && <div role="status" className="mt-10 border-t border-white/15 pt-7">
      <p className="flex items-center gap-2 text-lg font-bold text-off-white"><CheckCircle2 aria-hidden="true" className="size-5 text-mint" /> Quiz concluído</p>
      <p className="mt-3 text-base leading-7 text-[#C8CFD7]">{ratings.filter((rating) => rating === "yes").length} de {questions.length} respostas compreendidas. {ratings.includes("review") ? "Revise as questões marcadas antes de seguir." : "Você pode seguir para o exemplo prático."}</p>
      <button type="button" onClick={restart} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-mint hover:text-neon"><RotateCcw aria-hidden="true" className="size-4" /> Refazer quiz</button>
    </div>}
  </div>;
}
