"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";

const screens = [
  { title: "Mente", note: "Capturar e revisitar uma ideia", src: "/mentoria/broto-mente.webp", alt: "Tela Mente do BrotoSpace com registros de demonstração." },
  { title: "Desafios", note: "Relacionar uma ideia a um desafio", src: "/mentoria/broto-desafio.webp", alt: "Tela Desafios do BrotoSpace com um desafio de demonstração." },
  { title: "Hábitos", note: "Observar a continuidade de uma ação", src: "/mentoria/broto-habitos.webp", alt: "Tela Hábitos do BrotoSpace com hábitos de demonstração." },
];

// Troca automática com pausa explícita (WCAG 2.2.2): quem prefere menos
// movimento já começa pausado, e qualquer pessoa pode pausar ou retomar.
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (onChange: () => void) => {
  const media = window.matchMedia(REDUCED_MOTION);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

export function HomeHeroScreens() {
  const [active, setActive] = useState(0);
  // A escolha explícita da pessoa vence; sem ela, segue a preferência do sistema.
  const [choice, setChoice] = useState<boolean | null>(null);
  const prefersReduced = useSyncExternalStore(subscribeMotion, () => window.matchMedia(REDUCED_MOTION).matches, () => false);
  const paused = choice ?? prefersReduced;
  const setPaused = (update: (value: boolean) => boolean) => setChoice(update(paused));

  useEffect(() => {
    if (paused) return;
    let timer: number | undefined;
    const stop = () => { if (timer !== undefined) window.clearInterval(timer); timer = undefined; };
    const start = () => {
      stop();
      if (document.visibilityState === "visible") {
        timer = window.setInterval(() => setActive((index) => (index + 1) % screens.length), 6500);
      }
    };
    document.addEventListener("visibilitychange", start);
    start();
    return () => { stop(); document.removeEventListener("visibilitychange", start); };
  }, [paused]);

  return <div className="qa-home-hero-media" role="group" aria-roledescription="carrossel" aria-label="Telas do BrotoSpace, o sistema que você vai testar">
    {screens.map((screen, index) => <figure className={`qa-home-hero-frame ${index === active ? "is-active" : ""}`} aria-hidden={index !== active} key={screen.title}>
      <Image src={screen.src} alt={screen.alt} fill priority={index === 0} sizes="(max-width: 900px) 100vw, 56vw" />
      <figcaption>{screen.title}<span>{screen.note}</span></figcaption>
    </figure>)}
    <span className="qa-home-media-caption">O sistema que você vai testar · BrotoSpace</span>
    <button type="button" className="qa-home-media-toggle" onClick={() => setPaused((value) => !value)} aria-pressed={paused}
      aria-label={paused ? "Retomar a troca de telas" : "Pausar a troca de telas"}>
      {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
    </button>
  </div>;
}
