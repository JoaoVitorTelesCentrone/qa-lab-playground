import { Check, Circle } from "lucide-react";
import { evaluatePassword, PASSWORD_CRITERIA } from "@/lib/auth/password-policy";

export function PasswordRequirements({ password, id = "password-requirements" }: { password: string; id?: string }) {
  const results = evaluatePassword(password);
  const completed = PASSWORD_CRITERIA.filter((criterion) => results[criterion.id]).length;
  const hasInput = password.length > 0;

  return (
    <div id={id} className="mt-3 rounded-xl bg-[#101319]/70 p-3 ring-1 ring-inset ring-white/8">
      <p className="text-xs font-bold text-[#D9DEE4]">Sua senha precisa ter:</p>
      <ul className="mt-2 grid gap-x-3 gap-y-1.5 sm:grid-cols-2">
        {PASSWORD_CRITERIA.map((criterion) => {
          const met = results[criterion.id];
          return (
            <li key={criterion.id} className={`flex items-center gap-2 text-xs ${met ? "text-mint" : hasInput ? "text-[#FF9A8D]" : "text-[#8B949E]"}`}>
              {met ? <Check className="size-3.5 shrink-0" aria-hidden="true" /> : <Circle className="size-3.5 shrink-0" aria-hidden="true" />}
              <span>{criterion.label}</span>
            </li>
          );
        })}
      </ul>
      <p className="sr-only" aria-live="polite">{completed} de {PASSWORD_CRITERIA.length} critérios atendidos.</p>
      <p className="mt-2 text-[11px] leading-4 text-[#8B949E]">Use uma senha única. Senhas conhecidas em vazamentos também podem ser recusadas.</p>
    </div>
  );
}
