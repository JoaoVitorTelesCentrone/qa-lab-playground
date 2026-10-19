"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, BookOpen, FileText, Video } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompleteLessonButton } from "@/components/mentorship/mentorship-actions";
import { LessonVideo } from "@/components/mentorship/lesson-video";
import type { MentorshipLesson } from "@/lib/mentorship/catalog";
import type { LessonTheory } from "@/lib/mentorship/lesson-theory-types";

type Props = {
  lesson: MentorshipLesson;
  theory?: LessonTheory;
  videoUrl?: string | null;
  materialUrl?: string | null;
  completed: boolean;
  canTrack: boolean;
  videoAccess: boolean;
  trackingHref: string;
  trackingLabel: string;
  nextHref: string;
  nextTitle: string;
  previousHref?: string;
  resources: readonly { title: string; url: string; organization: string }[];
  brotoAction?: string;
  brotoMissionHref?: string;
  children?: ReactNode;
};

export function LessonWorkspace({ lesson, theory, videoUrl, materialUrl, completed, canTrack, videoAccess, trackingHref, trackingLabel, nextHref, nextTitle, previousHref, resources, brotoAction, brotoMissionHref, children }: Props) {
  const [tab, setTab] = useState(videoUrl ? "video" : "reading");
  return <section aria-label="Estudar esta aula" className="mt-8">
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList aria-label="Formatos da aula" variant="line" className="h-auto min-h-12 w-full justify-start gap-2 border-b border-white/15">
        <TabsTrigger value="video" className="min-h-11 flex-none px-3"><Video aria-hidden="true" className="size-4" />Vídeo</TabsTrigger>
        <TabsTrigger value="reading" className="min-h-11 flex-none px-3"><BookOpen aria-hidden="true" className="size-4" />Leitura</TabsTrigger>
        <TabsTrigger value="materials" className="min-h-11 flex-none px-3"><FileText aria-hidden="true" className="size-4" />Materiais</TabsTrigger>
      </TabsList>
      {!videoUrl && <p className="mt-3 text-xs leading-5 text-[#AAB2BC]">{videoAccess ? "Vídeo em preparação. A leitura já está disponível." : "Leitura disponível. Acesse as videoaulas pela mentoria."}</p>}
      <TabsContent value="video" className="mt-5">
        {videoUrl ? <LessonVideo url={videoUrl} title={lesson.title} /> : <div className="flex min-h-52 flex-col items-start justify-center border border-white/15 bg-[#171B21] p-6 sm:p-8">
          <h2 className="text-xl font-bold text-off-white">{videoAccess ? "O vídeo desta aula está em preparação." : "Videoaulas na mentoria"}</h2>
          <p className="mt-2 max-w-[60ch] text-sm leading-6 text-[#C8CFD7]">Você pode estudar o conteúdo completo pela leitura e seguir para a próxima etapa.</p>
          <button type="button" onClick={() => setTab("reading")} className="mt-5 inline-flex min-h-11 items-center gap-2 bg-mint px-4 text-sm font-bold text-[#101319] hover:bg-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint">Estudar pela leitura<ArrowRight aria-hidden="true" className="size-4" /></button>
          {!videoAccess && <Link href={trackingHref} className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-mint underline underline-offset-4">{trackingLabel}</Link>}
        </div>}
        {videoUrl && theory && <p className="mt-5 max-w-[72ch] text-sm leading-7 text-[#C8CFD7]"><strong className="text-off-white">Objetivo da aula:</strong> {theory.objective}</p>}
      </TabsContent>
      <TabsContent value="reading" className="mt-6 max-w-[72ch]">
        {theory ? <div>
          <p className="text-base font-semibold leading-7 text-off-white">{theory.objective}</p>
          <div className="mt-8 space-y-8">{theory.sections.map((section) => <section key={section.title}>
            <h2 className="text-xl font-bold text-off-white">{section.title}</h2>
            <p className="mt-3 whitespace-pre-line text-base leading-8 text-[#C8CFD7]">{section.text}</p>
          </section>)}</div>
        </div> : <p className="text-sm leading-7 text-[#C8CFD7]">{lesson.summary}</p>}
      </TabsContent>
      <TabsContent value="materials" className="mt-5">
        <h2 className="text-xl font-bold text-off-white">Material de apoio</h2>
        {materialUrl && <a href={materialUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-mint underline underline-offset-4"><FileText aria-hidden="true" className="size-4" />Abrir material da aula</a>}
        <ul className="mt-4 divide-y divide-white/10">{resources.map((resource) => <li key={resource.url} className="py-3"><a href={resource.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-mint underline underline-offset-4">{resource.title}</a><p className="mt-1 text-xs text-[#AAB2BC]">{resource.organization}</p></li>)}</ul>
        {children}
      </TabsContent>
    </Tabs>
    {brotoAction && <section className="mt-8 max-w-[72ch] border-t border-mint/25 pt-5" aria-label="Aplicação no Broto Space"><h2 className="text-base font-bold text-off-white">Leve esta aula para o Broto</h2><p className="mt-2 text-sm leading-6 text-[#C8CFD7]">{brotoAction}</p><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold"><Link href="/conteudo/broto" className="text-mint underline underline-offset-4 hover:text-neon">Ver dados de treino</Link>{brotoMissionHref && <Link href={brotoMissionHref} className="text-mint underline underline-offset-4 hover:text-neon">Abrir missão desta parte</Link>}</div></section>}
    <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5">
      {previousHref ? <Link href={previousHref} className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-[#C8CFD7] hover:text-mint"><ArrowLeft aria-hidden="true" className="size-4" />Anterior</Link> : <span />}
      <div className="flex flex-col items-end gap-2">
        <p className="text-xs text-[#AAB2BC]">A seguir: {nextTitle}</p>
        {canTrack ? <CompleteLessonButton lessonKey={lesson.key} completed={completed} nextHref={nextHref} /> : <Link href={nextHref} className="inline-flex min-h-11 items-center gap-2 bg-mint px-5 text-sm font-bold text-[#101319] hover:bg-neon">Continuar<ArrowRight aria-hidden="true" className="size-4" /></Link>}
      </div>
    </footer>
    {!canTrack && <p className="mt-4 text-xs leading-6 text-[#AAB2BC]"><Link href={trackingHref} className="font-semibold text-mint underline underline-offset-4">{trackingLabel}</Link></p>}
  </section>;
}
