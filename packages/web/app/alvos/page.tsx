"use client";

import { useState } from "react";
import { Layers, Bug, Copy, Check } from "lucide-react";
import Link from "next/link";

// ─── Dados ──────────────────────────────────────────────

const metodoBadge: Record<string, string> = {
  GET:    "bg-blue-100 text-blue-700",
  POST:   "bg-green-100 text-green-700",
  PUT:    "bg-amber-100 text-amber-700",
  DELETE: "bg-red-100 text-red-700",
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
      className="rounded p-1 text-muted-foreground hover:bg-secondary transition-colors shrink-0"
      title="Copiar"
    >
      {copied ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5" />}
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
      <div className="space-y-2 animate-slide-in-up">
        <div className="flex items-center gap-2.5">
          <Layers className="size-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Alvos</h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-xl">
          Documentação dos sistemas que você vai testar — endpoints, seletores e bugs conhecidos pra usar nas suas automações.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {tabs.map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === t.value
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* API */}
      {tab === "api" && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-xs text-muted-foreground">
            Base URL: <code className="rounded bg-secondary px-1.5 py-0.5 font-mono">http://localhost:3001</code>
            {" · "}
            <Link href="/api-playground" className="text-primary hover:underline">Abrir API Playground →</Link>
          </p>

          <div className="space-y-2">
            {endpoints.map((ep, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-card p-4 space-y-2 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`rounded px-2 py-0.5 font-mono text-xs font-semibold ${metodoBadge[ep.method]}`}>
                    {ep.method}
                  </span>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <code className="font-mono text-sm text-foreground">{ep.path}</code>
                    <CopyButton text={ep.path} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{ep.descricao}</p>
                <div className="flex items-start gap-1.5 rounded-md bg-red-50 border border-red-100 px-3 py-2">
                  <Bug className="size-3.5 text-red-500 mt-0.5 shrink-0" />
                  <span className="text-xs text-red-700">{ep.bug}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* E-commerce */}
      {tab === "ecommerce" && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-xs text-muted-foreground">
            URL alvo: <code className="rounded bg-secondary px-1.5 py-0.5 font-mono">http://localhost:3000/ecommerce</code>
            {" · "}
            <Link href="/ecommerce" className="text-primary hover:underline">Abrir loja →</Link>
          </p>

          <div className="space-y-2">
            {selectors.map((s, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-card p-4 flex items-start gap-4 hover:border-primary/20 transition-colors"
              >
                <div className="flex-1 space-y-1 min-w-0">
                  <p className="text-sm font-medium">{s.elemento}</p>
                  <p className="text-xs text-muted-foreground">{s.descricao}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <code className="rounded bg-secondary px-2 py-1 font-mono text-xs text-foreground">
                    {s.seletor}
                  </code>
                  <CopyButton text={s.seletor} />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-medium text-amber-800 mb-1">Bugs conhecidos na UI</p>
            <ul className="space-y-1">
              <li className="text-xs text-amber-700 flex items-start gap-1.5"><Bug className="size-3.5 mt-0.5 shrink-0" /> Permite adicionar mais itens do que o estoque disponível</li>
              <li className="text-xs text-amber-700 flex items-start gap-1.5"><Bug className="size-3.5 mt-0.5 shrink-0" /> Preço total não atualiza ao remover um item do carrinho</li>
              <li className="text-xs text-amber-700 flex items-start gap-1.5"><Bug className="size-3.5 mt-0.5 shrink-0" /> Busca não retorna resultados com palavras acentuadas</li>
              <li className="text-xs text-amber-700 flex items-start gap-1.5"><Bug className="size-3.5 mt-0.5 shrink-0" /> Produto esgotado ainda aparece como disponível no carrinho</li>
            </ul>
          </div>
        </div>
      )}

      {/* Form Bugado */}
      {tab === "form" && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-xs text-muted-foreground">
            URL alvo: <code className="rounded bg-secondary px-1.5 py-0.5 font-mono">http://localhost:3000/form-bugado</code>
            {" · "}
            <Link href="/form-bugado" className="text-primary hover:underline">Abrir formulário →</Link>
          </p>

          <div className="space-y-2">
            {formBugs.map(b => (
              <div
                key={b.id}
                className="rounded-lg border border-border bg-card p-4 flex items-start gap-4 hover:border-primary/20 transition-colors"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-100 font-mono text-xs font-bold text-red-600">
                  {b.id}
                </span>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{b.campo}</p>
                  <p className="text-xs text-muted-foreground">{b.descricao}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border bg-card p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Seletor base</p>
            <div className="flex items-center gap-2">
              <code className="rounded bg-secondary px-2 py-1 font-mono text-xs text-foreground">
                form[data-testid="buggy-form"]
              </code>
              <CopyButton text='form[data-testid="buggy-form"]' />
            </div>
            <p className="text-xs text-muted-foreground">
              Use como escopo nos seus testes para isolar do restante da página.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
