"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { LogIn, X } from "lucide-react";

// Muro de login na persistência: aparece quando um visitante anônimo tenta
// salvar algo. O estado dele continua na tela (efêmero); aqui é só o convite.
export function SaveGate({ show, next, onDismiss }: { show: boolean; next: string; onDismiss: () => void }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: "spring", damping: 22, stiffness: 280 }}
          className="fixed inset-x-0 bottom-5 z-[90] flex justify-center px-4"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-neon/30 bg-[#12161C] px-5 py-3 shadow-2xl shadow-black/40">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-neon/15 text-neon"><LogIn className="size-4" /></span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-off-white">Entre para salvar seu progresso</p>
              <p className="text-[11px] text-[#69737E]">Sem login, sua prática fica só nesta tela e some ao sair.</p>
            </div>
            <Link href={`/login?next=${encodeURIComponent(next)}`} className="ml-1 shrink-0 rounded-lg bg-neon px-3.5 py-2 text-xs font-black text-[#101319]">Entrar</Link>
            <button onClick={onDismiss} aria-label="Dispensar" className="shrink-0 text-[#69737E] hover:text-coral"><X className="size-4" /></button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
