"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const screens = [
  { title: "Mente", note: "Capturar e revisitar uma ideia", src: "/mentoria/broto-mente.webp", alt: "Tela Mente do BrotoSpace com registros de demonstração." },
  { title: "Desafios", note: "Relacionar uma ideia a um desafio", src: "/mentoria/broto-desafio.webp", alt: "Tela Desafios do BrotoSpace com um desafio de demonstração." },
  { title: "Hábitos", note: "Observar a continuidade de uma ação", src: "/mentoria/broto-habitos.webp", alt: "Tela Hábitos do BrotoSpace com hábitos de demonstração." },
];

export function HomeHeroScreens() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;
    const stop = () => { if (timer !== undefined) window.clearInterval(timer); timer = undefined; };
    const start = () => {
      stop();
      if (!media.matches && document.visibilityState === "visible") {
        timer = window.setInterval(() => setActive((index) => (index + 1) % screens.length), 6500);
      }
    };
    document.addEventListener("visibilitychange", start);
    media.addEventListener("change", start);
    start();
    return () => { stop(); document.removeEventListener("visibilitychange", start); media.removeEventListener("change", start); };
  }, []);

  return <div className="qa-home-hero-media" aria-label="Telas de demonstração do BrotoSpace">
    {screens.map((screen, index) => <figure className={`qa-home-hero-frame ${index === active ? "is-active" : ""}`} aria-hidden={index !== active} key={screen.title}>
      <Image src={screen.src} alt={screen.alt} fill priority={index === 0} sizes="(max-width: 900px) 100vw, 56vw" />
      <figcaption>{screen.title}<span>{screen.note}</span></figcaption>
    </figure>)}
    <span className="qa-home-media-caption">Interface de demonstração · BrotoSpace</span>
  </div>;
}
