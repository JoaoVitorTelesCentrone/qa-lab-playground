"use client";

import { useState } from "react";
import { Layers, Bug, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// ─── Dados ──────────────────────────────────────────────

const metodoBadge: Record<string, { bg: string; text: string }> = {
  GET:    { bg: "bg-mint/20", text: "text-mint" },
  POST:   { bg: "bg-neon/20", text: "text-neon" },
  PUT:    { bg: "bg-[#F4A8A3]/20", text: "text-[#F4A8A3]" },
  DELETE: { bg: "bg-coral/20", text: "text-coral" },
};

const endpoints = [
  { method: "GET",    path: "/api/health",        descricao: "Status dos serviços da plataforma",                  bug: "Reporta 'healthy' mesmo quando endpoints estão falhando" },
  { method: "GET",    path: "/api/users",          descricao: "Lista todos os usuários com paginação",              bug: "Paginação inconsistente — itens se repetem entre páginas" },
  { method: "POST",   path: "/api/users",          descricao: "Cria novo usuário",                                  bug: "Descarta campos silenciosamente sem retornar erro" },
  { method: "PUT",    path: "/api/users/:id",      descricao: "Atualiza dados do usuário",                          bug: "Retorna 200 mas não persiste as alterações" },
  { method: "GET",    path: "/api/products",       descricao: "Lista produtos com filtros e paginação",             bug: "Paginação pula itens entre páginas" },
  { method: "GET",    path: "/api/products/:id",   descricao: "Retorna detalhe de um produto",                     bug: "Retorna status 200 com body de erro ao invés de 404" },
  { method: "DELETE", path: "/api/products/:id",   descricao: "Remove um produto",                                  bug: "Retorna 204 mas o recurso continua existindo" },
  { method: "POST",   path: "/api/orders",         descricao: "Cria um pedido",                                     bug: "Aceita product_id inexistente; timeout intermitente" },
  { method: "GET",    path: "/api/orders/:id",     descricao: "Detalhe de um pedido",                               bug: "Alterna entre camelCase e snake_case a cada request" },
  { method: "POST",   path: "/api/auth/login",     descricao: "Autenticação via e-mail e senha (retorna JWT)",      bug: "Sem rate limiting; revela se o e-mail existe no sistema" },
];

const selectors = [
  { elemento: "Card de produto",          seletor: '[data-testid="product-card"]',   descricao: "Container de cada produto na listagem" },
  { elemento: "Botão adicionar",          seletor: '[data-testid="add-to-cart"]',    descricao: "Dentro de cada product-card" },
  { elemento: "Quantidade em estoque",    seletor: '[data-testid="stock"]',          descricao: "Texto com unidades disponíveis" },
  { elemento: "Contador do carrinho",     seletor: '[data-testid="cart-count"]',     descricao: "Badge no ícone do carrinho no header" },
  { elemento: "Quantidade no carrinho",   seletor: '[data-testid="cart-quantity"]',  descricao: "Input de quantidade no item do carrinho" },
  { elemento: "Botão remover item",       seletor: '[data-testid="remove-item"]',    descricao: "Remove o item do carrinho" },
  { elemento: "Total do carrinho",        seletor: '[data-testid="cart-total"]',     descricao: "Valor total calculado" },
  { elemento: "Campo de busca",           seletor: '[data-testid="search-input"]',   descricao: "Input de busca de produtos" },
];

const formBugs = [
  { id: 1, campo: "Email",            descricao: "Aceita e-mails sem @ como válidos" },
  { id: 2, campo: "Senha",            descricao: "Sem validação de força mínima" },
  { id: 3, campo: "Confirmar senha",  descricao: "Não valida se as senhas coincidem" },
  { id: 4, campo: "Telefone",         descricao: "Aceita letras no campo numérico" },
  { id: 5, campo: "Submit",           descricao: "Permite enviar o form com campos obrigatórios vazios" },
];

// ─── Componente de cópia ──────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={copy}
      className="rounded-lg p-1.5 text-off-white/40 hover:bg-mint/10 hover:text-mint transition-colors shrink-0"
      title="Copiar"
    >
      {copied ? <Check className="size-3.5 text-neon" /> : <Copy className="size-3.5" />}
    </button>
  );
}

// ─── Tabs ─────────────────────────────────────────────

type Tab = "api" | "ecommerce" | "form";

const tabs: { value: Tab; label: string }[] = [
  { value: "api",       label: "API" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "form",      label: "Form Bugado" },
];

// ─── Page ─────────────────────────────────────────────

export default function AlvosPage() {
  const [tab, setTab] = useState<Tab>("api");

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-4 animate-slide-in-up">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-xl bg-mint/20">
            <Layers className="size-5 text-mint" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wider text-mint italic">
              ALVOS
            </h1>
            <p className="text-sm text-mint/50 uppercase tracking-[0.15em]">
              Sistemas para testar
            </p>
          </div>
        </div>
        <p className="text-sm text-off-white/60 max-w-xl">
          Documentação dos sistemas que você vai testar — endpoints, seletores e bugs conhecidos pra usar nas suas automações.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-mint/10">
        {tabs.map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-5 py-3 text-sm font-bold uppercase tracking-wide border-b-2 transition-all -mb-px ${
              tab === t.value
                ? "border-mint text-mint"
                : "border-transparent text-off-white/40 hover:text-off-white/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* API */}
      {tab === "api" && (
        <div className="space-y-5 animate-fade-in">
          <p className="text-sm text-off-white/50">
            Base URL: <code className="rounded-lg bg-dark-green/50 px-2 py-1 font-mono text-mint">http://localhost:3001</code>
            {" · "}
            <Link href="/api-playground" className="text-mint hover:underline">Abrir API Playground →</Link>
          </p>

          <div className="space-y-3">
            {endpoints.map((ep, i) => (
              <div
                key={i}
                className="rounded-2xl border border-mint/10 bg-dark-green/40 p-5 space-y-3 hover:border-mint/25 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className={`rounded-lg px-3 py-1 font-mono text-xs font-bold uppercase ${metodoBadge[ep.method].bg} ${metodoBadge[ep.method].text}`}>
                    {ep.method}
                  </span>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <code className="font-mono text-sm text-off-white">{ep.path}</code>
                    <CopyButton text={ep.path} />
                  </div>
                </div>
                <p className="text-sm text-off-white/60">{ep.descricao}</p>
                <div className="flex items-start gap-2 rounded-xl bg-coral/10 border border-coral/20 px-4 py-3">
                  <Bug className="size-4 text-coral mt-0.5 shrink-0" />
                  <span className="text-sm text-coral/90">{ep.bug}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* E-commerce */}
      {tab === "ecommerce" && (
        <div className="space-y-5 animate-fade-in">
          <p className="text-sm text-off-white/50">
            URL alvo: <code className="rounded-lg bg-dark-green/50 px-2 py-1 font-mono text-mint">http://localhost:3000/ecommerce</code>
            {" · "}
            <Link href="/ecommerce" className="text-mint hover:underline">Abrir loja →</Link>
          </p>

          <div className="space-y-3">
            {selectors.map((s, i) => (
              <div
                key={i}
                className="rounded-2xl border border-mint/10 bg-dark-green/40 p-5 flex items-start gap-4 hover:border-mint/25 transition-all"
              >
                <div className="flex-1 space-y-1 min-w-0">
                  <p className="text-sm font-bold text-off-white">{s.elemento}</p>
                  <p className="text-xs text-off-white/50">{s.descricao}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <code className="rounded-lg bg-dark-green/80 px-3 py-1.5 font-mono text-xs text-mint">
                    {s.seletor}
                  </code>
                  <CopyButton text={s.seletor} />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-[#F4A8A3]/20 bg-[#F4A8A3]/5 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-[#F4A8A3] mb-3">Bugs conhecidos na UI</p>
            <ul className="space-y-2">
              <li className="text-sm text-[#F4A8A3]/80 flex items-start gap-2"><Bug className="size-4 mt-0.5 shrink-0" /> Permite adicionar mais itens do que o estoque disponível</li>
              <li className="text-sm text-[#F4A8A3]/80 flex items-start gap-2"><Bug className="size-4 mt-0.5 shrink-0" /> Preço total não atualiza ao remover um item do carrinho</li>
              <li className="text-sm text-[#F4A8A3]/80 flex items-start gap-2"><Bug className="size-4 mt-0.5 shrink-0" /> Busca não retorna resultados com palavras acentuadas</li>
              <li className="text-sm text-[#F4A8A3]/80 flex items-start gap-2"><Bug className="size-4 mt-0.5 shrink-0" /> Produto esgotado ainda aparece como disponível no carrinho</li>
            </ul>
          </div>
        </div>
      )}

      {/* Form Bugado */}
      {tab === "form" && (
        <div className="space-y-5 animate-fade-in">
          <p className="text-sm text-off-white/50">
            URL alvo: <code className="rounded-lg bg-dark-green/50 px-2 py-1 font-mono text-mint">http://localhost:3000/form-bugado</code>
            {" · "}
            <Link href="/form-bugado" className="text-mint hover:underline">Abrir formulário →</Link>
          </p>

          <div className="space-y-3">
            {formBugs.map(b => (
              <div
                key={b.id}
                className="rounded-2xl border border-mint/10 bg-dark-green/40 p-5 flex items-start gap-4 hover:border-mint/25 transition-all"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-coral/20 font-mono text-xs font-bold text-coral">
                  {b.id}
                </span>
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-off-white">{b.campo}</p>
                  <p className="text-xs text-off-white/50">{b.descricao}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-mint/10 bg-dark-green/40 p-5 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wide text-off-white/50">Seletor base</p>
            <div className="flex items-center gap-3">
              <code className="rounded-lg bg-dark-green/80 px-3 py-2 font-mono text-sm text-mint">
                form[data-testid="buggy-form"]
              </code>
              <CopyButton text='form[data-testid="buggy-form"]' />
            </div>
            <p className="text-xs text-off-white/40">
              Use como escopo nos seus testes para isolar do restante da página.
            </p>
          </div>
        </div>
      )}

      {/* Series Badge */}
      <div className="flex justify-end">
        <span className="series-number text-4xl text-off-white/10">
          #03
        </span>
      </div>
    </div>
  );
}
