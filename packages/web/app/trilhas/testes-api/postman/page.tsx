import Link from "next/link";
import { apiTestingTracks } from "@/lib/api-testing-course";
import { ApiTrackModuleList } from "../track-client";
import { getApiTestingProgress } from "../progress";

export const dynamic = "force-dynamic";
export const metadata = { title: "Prática com Postman | Testes de API | QA Lab" };

export default async function PostmanApiTrackPage() {
  const progress = await getApiTestingProgress();
  const track = apiTestingTracks.postman;
  return <main className="qa-testes-api min-h-[calc(100vh-4rem)] bg-background text-foreground"><div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
    <Link href="/trilhas/testes-api" className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline">← Trilha de testes de API</Link>
    <header className="mt-8 max-w-3xl"><p className="text-sm font-semibold text-primary">Subtrilha · 3 semanas · 6 Labs</p><h1 className="qa-page-title mt-3">Pratique com Postman.</h1><p className="mt-4 text-base leading-7 text-muted-foreground">{track.intro} Comece depois dos fundamentos ou use esta sequência como laboratório guiado.</p></header>
    <ApiTrackModuleList modules={track.modules} initialCompleted={progress.completed} signedIn={progress.signedIn} baseHref={track.href} />
    <p className="mt-8 border-l-2 border-primary/60 pl-4 text-sm leading-6 text-muted-foreground">A collection e os exemplos devem usar APIs locais ou sandboxes autorizadas. Não compartilhe secrets nem exports com credenciais.</p>
  </div></main>;
}
