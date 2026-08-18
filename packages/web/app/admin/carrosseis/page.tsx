import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isAdminEmail } from "@/lib/product/admin";
import { CarouselStudio } from "@/components/admin/carousel-studio";

export const metadata = { title: "Gerador de carrosséis", robots: { index: false, follow: false } };

export default async function AdminCarrosseisPage() {
  if (!isSupabaseConfigured()) redirect("/login?next=/admin/carrosseis");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) redirect("/login?next=/admin/carrosseis");

  return (
    <div className="qa-simple mx-auto max-w-6xl px-5 py-10">
      <p className="qa-eyebrow">Admin</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight">Gerador de carrosséis</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Gera slides no design system do QA Lab a partir de um artigo do blog, um desafio ou uma referência da biblioteca de pesquisa. Edite o texto e exporte PNG por slide.
      </p>
      <div className="mt-8">
        <CarouselStudio />
      </div>
    </div>
  );
}
