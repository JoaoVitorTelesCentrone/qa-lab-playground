import { CarouselStudio } from "@/components/admin/carousel-studio";

export const metadata = { title: "Gerador de carrosséis", robots: { index: false, follow: false } };

export default async function AdminCarrosseisPage() {
  return (
    <div className="qa-simple mx-auto max-w-7xl px-5 py-10">
      <p className="qa-eyebrow">Admin</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight">Gerador de carrosséis</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Escolha um tema e um estilo, confira os slides e baixe um PDF pronto para publicar como documento no LinkedIn.</p>
      <div className="mt-8">
        <CarouselStudio />
      </div>
    </div>
  );
}
