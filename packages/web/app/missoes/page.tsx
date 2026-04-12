"use client";

import { useState } from "react";
import { Target, Lightbulb, Terminal, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Nivel = "iniciante" | "intermediario";
type PainelAberto = "dica" | "snippet" | null;

interface Missao {
  id: number;
  nivel: Nivel;
  titulo: string;
  objetivo: string;
  alvo: string;
  ferramentas: string[];
  dica: string;
  snippet: string;
}

const missoes: Missao[] = [
  {
    id: 1,
    nivel: "iniciante",
    titulo: "O DELETE que não deleta",
    objetivo:
      "Prove que DELETE /api/products/:id retorna 204 mas o recurso continua existindo após a requisição.",
    alvo: "API",
    ferramentas: ["Playwright", "Cypress"],
    dica: "Faça o DELETE e em seguida um GET no mesmo ID. Se o GET retornar 200 com dados, o bug está confirmado. Seu teste deve falhar no assert do GET.",
    snippet: `// Playwright — API Testing
test('DELETE não remove o produto', async ({ request }) => {
  const id = 1

  await request.delete(\`/api/products/\${id}\`)

  const res = await request.get(\`/api/products/\${id}\`)
  expect(res.status()).toBe(404) // vai falhar — bug confirmado
})`,
  },
  {
    id: 2,
    nivel: "iniciante",
    titulo: "O health check mentiroso",
    objetivo:
      "Prove que GET /api/health reporta todos os serviços como 'healthy' mesmo quando a API está falhando.",
    alvo: "API",
    ferramentas: ["Playwright", "Cypress"],
    dica: "Compare o que o health check responde com o que os outros endpoints retornam na prática. Um health check honesto deve refletir falhas reais.",
    snippet: `// Playwright — API Testing
test('health check deve refletir falhas reais', async ({ request }) => {
  const health = await request.get('/api/health')
  const body = await health.json()

  // Força erro num endpoint real
  const broken = await request.get('/api/products/99999')

  // Se health diz "healthy" mas endpoint falha, é bug
  if (broken.status() !== 200) {
    expect(body.status).not.toBe('healthy') // vai falhar
  }
})`,
  },
  {
    id: 3,
    nivel: "iniciante",
    titulo: "Paginação que pula itens",
    objetivo:
      "Prove que a listagem de produtos pula registros ao paginar — IDs da página 1 somem ou se repetem na página 2.",
    alvo: "API",
    ferramentas: ["Playwright", "K6"],
    dica: "Busque todas as páginas e compare os IDs retornados. Se houver IDs duplicados ou ausentes entre as páginas, o bug está confirmado.",
    snippet: `// Playwright — API Testing
test('paginação não deve pular itens', async ({ request }) => {
  const p1 = await (await request.get('/api/products?page=1&limit=5')).json()
  const p2 = await (await request.get('/api/products?page=2&limit=5')).json()

  const ids1 = p1.data.map((p: any) => p.id)
  const ids2 = p2.data.map((p: any) => p.id)

  // Não deve haver IDs repetidos entre páginas
  const overlap = ids1.filter((id: number) => ids2.includes(id))
  expect(overlap).toHaveLength(0) // vai falhar — bug confirmado
})`,
  },
  {
    id: 4,
    nivel: "iniciante",
    titulo: "O formulário com 5 bugs",
    objetivo:
      "Encontre e documente os 5 bugs escondidos no formulário de cadastro usando automação de UI.",
    alvo: "Form Bugado",
    ferramentas: ["Playwright", "Cypress"],
    dica: "Teste cada campo com valores válidos, inválidos e vazios. Foque em: validação de e-mail, campos obrigatórios, senhas e comportamento do submit.",
    snippet: `// Playwright — UI Testing
test('formulário deve rejeitar e-mail inválido', async ({ page }) => {
  await page.goto('/form-bugado')

  await page.fill('[name="email"]', 'emailsemarrobase')
  await page.click('[type="submit"]')

  // Deve exibir mensagem de erro
  await expect(
    page.locator('[data-testid="email-error"]')
  ).toBeVisible() // vai falhar — bug confirmado
})`,
  },
  {
    id: 5,
    nivel: "intermediario",
    titulo: "Contrato de resposta inconsistente",
    objetivo:
      "Crie um teste que detecte quando GET /api/orders/:id alterna entre camelCase e snake_case na mesma resposta.",
    alvo: "API",
    ferramentas: ["Playwright", "Cypress"],
    dica: "Execute o mesmo request várias vezes e compare as chaves da resposta. Se as chaves mudarem entre chamadas, o contrato da API está quebrado.",
    snippet: `// Playwright — API Testing
test('contrato de resposta deve ser consistente', async ({ request }) => {
  const calls = await Promise.all(
    Array.from({ length: 5 }, () => request.get('/api/orders/1'))
  )
  const bodies = await Promise.all(calls.map(r => r.json()))
  const keysets = bodies.map(b => Object.keys(b).sort().join(','))

  const unique = new Set(keysets)
  expect(unique.size).toBe(1) // vai falhar — chaves mudam a cada request
})`,
  },
  {
    id: 6,
    nivel: "intermediario",
    titulo: "Carrinho sem validação de estoque",
    objetivo:
      "Prove via E2E que é possível adicionar ao carrinho mais unidades do que o estoque disponível.",
    alvo: "E-commerce",
    ferramentas: ["Playwright", "Cypress"],
    dica: "Identifique um produto com estoque limitado, adicione-o múltiplas vezes e verifique se a quantidade ultrapassa o estoque. Use os data-testid documentados em Alvos.",
    snippet: `// Playwright — E2E
test('carrinho não deve ultrapassar o estoque', async ({ page }) => {
  await page.goto('/ecommerce')

  const card = page.locator('[data-testid="product-card"]').first()
  const estoqueText = await card.locator('[data-testid="stock"]').textContent()
  const max = parseInt(estoqueText ?? '0')

  // Clica uma vez a mais que o estoque
  for (let i = 0; i <= max; i++) {
    await card.locator('[data-testid="add-to-cart"]').click()
  }

  const qty = page.locator('[data-testid="cart-quantity"]').first()
  await expect(qty).toHaveText(String(max)) // vai falhar — aceita mais
})`,
  },
  {
    id: 7,
    nivel: "intermediario",
    titulo: "Login sem rate limiting",
    objetivo:
      "Prove que o endpoint de autenticação não bloqueia tentativas repetidas — é possível tentar login ilimitadas vezes.",
    alvo: "API",
    ferramentas: ["Playwright", "K6"],
    dica: "Faça 20+ requisições com credenciais erradas em sequência. Se nenhuma retornar 429 (Too Many Requests), o bug está confirmado.",
    snippet: `// Playwright — API Security
test('login deve ter rate limiting', async ({ request }) => {
  const attempts = await Promise.all(
    Array.from({ length: 20 }, () =>
      request.post('/api/auth/login', {
        data: { email: 'test@test.com', password: 'errado' },
      })
    )
  )

  const statuses = attempts.map(r => r.status())
  expect(statuses).toContain(429) // vai falhar — sem rate limiting
})`,
  },
  {
    id: 8,
    nivel: "intermediario",
    titulo: "Suite de smoke da API",
    objetivo:
      "Monte uma suite que valide os 5 endpoints principais da API. Todos devem responder com o status esperado em menos de 2s.",
    alvo: "API",
    ferramentas: ["Playwright", "K6"],
    dica: "Um smoke test é rápido e valida o básico: o endpoint existe, responde no tempo certo e retorna o formato esperado. Não teste lógica de negócio aqui.",
    snippet: `// Playwright — API Smoke Suite
const endpoints = [
  { method: 'GET',  path: '/api/health',       expected: 200 },
  { method: 'GET',  path: '/api/users',         expected: 200 },
  { method: 'GET',  path: '/api/products',      expected: 200 },
  { method: 'GET',  path: '/api/orders',        expected: 200 },
  { method: 'GET',  path: '/api/products/9999', expected: 404 },
]

for (const ep of endpoints) {
  test(\`\${ep.method} \${ep.path} → \${ep.expected}\`, async ({ request }) => {
    const res = await request[ep.method.toLowerCase() as 'get'](ep.path)
    expect(res.status()).toBe(ep.expected)
  })
}`,
  },
];

const nivelConfig: Record<Nivel, { label: string; variant: any }> = {
  iniciante:     { label: "Iniciante",     variant: "neon" },
  intermediario: { label: "Intermediário", variant: "default" },
};

function MissaoCard({ missao }: { missao: Missao }) {
  const [painel, setPainel] = useState<PainelAberto>(null);
  const cfg = nivelConfig[missao.nivel];

  function toggle(tipo: "dica" | "snippet") {
    setPainel(prev => (prev === tipo ? null : tipo));
  }

  return (
    <div className="rounded-2xl border border-mint/10 bg-dark-green/40 flex flex-col transition-all duration-200 hover:border-mint/25 hover:shadow-lg hover:shadow-mint/5">
      {/* Header */}
      <div className="p-5 space-y-3 flex-1">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-mint/50">#{String(missao.id).padStart(2, "0")}</span>
          <Badge variant={cfg.variant}>
            {cfg.label}
          </Badge>
        </div>

        <h3 className="text-base font-bold text-off-white leading-snug">{missao.titulo}</h3>

        <p className="text-sm text-off-white/60 leading-relaxed">
          {missao.objetivo}
        </p>

        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="rounded-lg border border-mint/20 px-2.5 py-1 text-xs text-mint/70 uppercase tracking-wide">
            {missao.alvo}
          </span>
          {missao.ferramentas.map(f => (
            <span key={f} className="rounded-lg bg-off-white/5 px-2.5 py-1 text-xs text-off-white/50">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Painel expansível */}
      {painel && (
        <div className="border-t border-mint/10 mx-5 mb-0" />
      )}
      {painel === "dica" && (
        <div className="px-5 py-4 text-sm text-off-white/70 leading-relaxed bg-neon/5 border-x-0">
          <div className="flex items-center gap-2 mb-2 text-neon font-bold uppercase tracking-wide text-xs">
            <Lightbulb className="size-4" />
            Dica
          </div>
          {missao.dica}
        </div>
      )}
      {painel === "snippet" && (
        <div className="px-5 py-4 bg-[#2a3a3a] rounded-b-none overflow-x-auto border-x-0">
          <pre className="text-xs text-mint font-mono leading-relaxed whitespace-pre">
            {missao.snippet}
          </pre>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-2 px-5 py-3 border-t border-mint/10">
        <button
          onClick={() => toggle("dica")}
          className={`flex items-center gap-1.5 text-xs rounded-lg px-3 py-2 transition-all font-bold uppercase tracking-wide ${
            painel === "dica"
              ? "bg-neon text-[#3D5454]"
              : "text-off-white/60 hover:bg-off-white/10 hover:text-off-white"
          }`}
        >
          <Lightbulb className="size-3.5" />
          Dica
          {painel === "dica" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
        </button>
        <button
          onClick={() => toggle("snippet")}
          className={`flex items-center gap-1.5 text-xs rounded-lg px-3 py-2 transition-all font-bold uppercase tracking-wide ${
            painel === "snippet"
              ? "bg-mint text-[#3D5454]"
              : "text-off-white/60 hover:bg-off-white/10 hover:text-off-white"
          }`}
        >
          <Terminal className="size-3.5" />
          Snippet
          {painel === "snippet" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
        </button>
      </div>
    </div>
  );
}

export default function MissoesPage() {
  const [filtro, setFiltro] = useState<"todos" | Nivel>("todos");

  const filtradas = filtro === "todos" ? missoes : missoes.filter(m => m.nivel === filtro);

  const filtros: { value: "todos" | Nivel; label: string }[] = [
    { value: "todos",         label: "Todas" },
    { value: "iniciante",     label: "Iniciante" },
    { value: "intermediario", label: "Intermediário" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-4 animate-slide-in-up">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-xl bg-mint/20">
            <Target className="size-5 text-mint" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wider text-mint italic">
              MISSÕES
            </h1>
            <p className="text-sm text-mint/50 uppercase tracking-[0.15em]">
              Prove bugs reais com automação
            </p>
          </div>
        </div>
        <p className="text-sm text-off-white/60 max-w-xl">
          Cada missão tem um bug real pra você provar com automação. Escolha pelo seu nível, leia o objetivo e escreva o teste.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2">
        {filtros.map(f => (
          <button
            key={f.value}
            onClick={() => setFiltro(f.value)}
            className={`rounded-xl px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all ${
              filtro === f.value
                ? "bg-mint text-[#3D5454]"
                : "text-off-white/60 hover:bg-off-white/10 hover:text-off-white border border-mint/20"
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-off-white/40 uppercase tracking-wide">
          {filtradas.length} missão{filtradas.length !== 1 ? "ões" : ""}
        </span>
      </div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 stagger">
        {filtradas.map(m => (
          <MissaoCard key={m.id} missao={m} />
        ))}
      </div>
    </div>
  );
}
