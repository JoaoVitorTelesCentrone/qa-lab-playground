"use client";

// Assuntos da conta (sair, excluir) moram no perfil, não no editor do
// portfólio: antes a exclusão ficava entre "Aparência" e "Projetos".

import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signOutAndGoHome } from "@/components/auth/account-nav";
import { Button } from "@/components/ui/button";
import { DangerZone } from "./danger-zone";

export function AccountSection({ email }: { email: string }) {
  const [leaving, setLeaving] = useState(false);

  async function deleteAccount() {
    const supabase = createClient();
    const { error } = await supabase.rpc("delete_own_account");
    if (error) return "Não foi possível excluir a conta. Tente novamente em instantes.";
    await supabase.auth.signOut();
    window.location.assign("/");
    return null;
  }

  return <section aria-labelledby="conta-title" className="mt-12">
    <h2 id="conta-title" className="text-xl font-bold tracking-[-0.02em]">Conta</h2>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
      <p className="min-w-0 text-sm text-muted-foreground">Conectado como <span className="font-medium text-foreground">{email}</span></p>
      <Button type="button" variant="outline" className="h-11" disabled={leaving} onClick={() => { setLeaving(true); void signOutAndGoHome(); }}>
        {leaving ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <LogOut className="size-4" aria-hidden="true" />}
        {leaving ? "Saindo..." : "Sair da conta"}
      </Button>
    </div>
    <details className="group mt-6">
      <summary className="flex min-h-11 w-fit cursor-pointer items-center text-sm text-muted-foreground hover:text-foreground">Excluir minha conta</summary>
      <div className="mt-3"><DangerZone onDelete={deleteAccount} /></div>
    </details>
  </section>;
}
