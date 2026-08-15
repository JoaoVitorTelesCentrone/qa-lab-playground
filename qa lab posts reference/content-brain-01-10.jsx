/* ── QALabBrain Carrosséis 01–10 — TIPO 1: Passo a passo prático ── */
const { DesignCanvas, DCSection, DCArtboard } = window;

function App() {
  return (
    <DesignCanvas>

      {/* ── 01. PRIORIZAR O QUE TESTAR ──────────────────── */}
      <DCSection id="b01" title="01 — Como priorizar o que testar">
        <DCArtboard id="b01-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="Fundamentos" headline={"PRIORIZAR\nQUANDO NÃO\nDÁ TEMPO"} sub="Você tem 2 dias e 40 cenários. Aqui está a ordem certa pra testar."/>
        </DCArtboard>
        <DCArtboard id="b01-s1" label="Slide 01" width={S} height={S}>
          <Versus topic="A pergunta que muda a ordem"
            wrong='"Por onde eu começo a testar?"'
            right='"O que, se quebrar, causa o maior estrago?"'/>
        </DCArtboard>
        <DCArtboard id="b01-s2" label="Slide 02" width={S} height={S}>
          <ChecklistAmber heading="Teste primeiro o que tem:"
            items={['Maior impacto no usuário', 'Maior risco financeiro', 'Mudança mais recente no código', 'Histórico de bug naquele fluxo', 'Menor cobertura existente']}/>
        </DCArtboard>
        <DCArtboard id="b01-s3" label="Slide 03" width={S} height={S}>
          <SplitH left={"RISCO\nORDENA.\nPRAZO\nNÃO."} right="Sem tempo, você não testa menos. Testa na ordem certa e comunica o que ficou de fora."/>
        </DCArtboard>
        <DCArtboard id="b01-cta" label="CTA" width={S} height={S}>
          <CTA lines={['TESTE','POR RISCO.','NÃO POR','SEQUÊNCIA.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 02. CRITÉRIO DE ACEITE SEM AMBIGUIDADE ──────── */}
      <DCSection id="b02" title="02 — Critério de aceite sem ambiguidade">
        <DCArtboard id="b02-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="QA no Ágil" headline={"CRITÉRIO\nDE ACEITE\nSEM RUÍDO"} sub="Esse critério de aceite vai gerar bug. Eu te mostro por quê."/>
        </DCArtboard>
        <DCArtboard id="b02-s1" label="Slide 01" width={S} height={S}>
          <Versus topic="O mesmo critério, dois jeitos"
            wrong='"O sistema deve responder rápido."'
            right='"A busca retorna em até 2s para 95% das requisições."'/>
        </DCArtboard>
        <DCArtboard id="b02-s2" label="Slide 02" width={S} height={S}>
          <ChecklistLight heading="Um bom critério responde:"
            items={['Quem faz a ação?', 'Em qual condição?', 'Qual o resultado esperado?', 'Qual o limite mensurável?', 'O que acontece no caminho de erro?']}/>
        </DCArtboard>
        <DCArtboard id="b02-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="CRITÉRIO VAGO NÃO É CRITÉRIO. É UM BUG ESPERANDO O FIM DA SPRINT." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b02-cta" label="CTA" width={S} height={S}>
          <CTALight lines={['CLAREZA NO','CRITÉRIO.','MENOS BUG','NA ENTREGA.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 03. PLANO DE TESTE DE RISCO EM 15 MINUTOS ───── */}
      <DCSection id="b03" title="03 — Plano de teste de risco em 15 min">
        <DCArtboard id="b03-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Fundamentos" headline={"PLANO DE\nTESTE EM\n15 MINUTOS"} sub="Não precisa de 10 páginas. Precisa de 15 minutos bem usados."/>
        </DCArtboard>
        <DCArtboard id="b03-s1" label="01–02" width={S} height={S}>
          <RoadmapDouble items={[
            { n: '01', t: 'Liste o que foi tocado', d: 'Funcionalidades afetadas pela entrega, nada além disso.' },
            { n: '02', t: 'Marque o risco de cada uma', d: 'Chance de falhar × impacto se falhar.' },
          ]}/>
        </DCArtboard>
        <DCArtboard id="b03-s2" label="03–04" width={S} height={S}>
          <RoadmapDouble items={[
            { n: '03', t: 'Defina a profundidade', d: 'Risco alto, teste a fundo. Risco baixo, teste raso.' },
            { n: '04', t: 'Escreva o que NÃO testa', d: 'O fora do escopo é a parte mais importante do plano.' },
          ]}/>
        </DCArtboard>
        <DCArtboard id="b03-s3" label="Slide 03" width={S} height={S}>
          <AmberPointLight headline={"PLANO NÃO É\nDOCUMENTO.\nÉ DECISÃO."} body="Um plano de risco serve pra alinhar prioridade, não pra encher pasta de evidência."/>
        </DCArtboard>
        <DCArtboard id="b03-cta" label="CTA" width={S} height={S}>
          <CTA lines={['15 MINUTOS','DE PLANO','EVITAM DIAS','DE RETRABALHO.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 04. O QUE AUTOMATIZAR ANTES DA PRIMEIRA LINHA ── */}
      <DCSection id="b04" title="04 — O que automatizar antes de escrever">
        <DCArtboard id="b04-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="Automação" headline={"O QUE\nAUTOMATIZAR\n(E O QUE NÃO)"} sub="Antes de escrever script, responda 4 perguntas. Senão você só criou trabalho futuro."/>
        </DCArtboard>
        <DCArtboard id="b04-s1" label="Slide 01" width={S} height={S}>
          <ChecklistAmber heading="Antes da primeira linha:"
            items={['Esse fluxo é estável?', 'Vai rodar muitas vezes?', 'O risco coberto vale a manutenção?', 'Quem vai sustentar isso depois?']}/>
        </DCArtboard>
        <DCArtboard id="b04-s2" label="Slide 02" width={S} height={S}>
          <CompareTable rows={[
            ['Roda 1x por release', 'Roda a cada commit'],
            ['Tela muda toda sprint', 'Fluxo estável há meses'],
            ['Exploratório resolve', 'Regressão repetitiva'],
          ]}/>
        </DCArtboard>
        <DCArtboard id="b04-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="AUTOMATIZAR O FLUXO ERRADO É CRIAR DÍVIDA TÉCNICA COM CARA DE PRODUTIVIDADE." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b04-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['AUTOMATIZE','O QUE SE','REPETE.','NÃO O QUE','MUDA.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 05. BUG REPORT QUE RESOLVE DE PRIMEIRA ──────── */}
      <DCSection id="b05" title="05 — Bug report que resolve de primeira">
        <DCArtboard id="b05-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Fundamentos" headline={"BUG REPORT\nQUE RESOLVE\nDE PRIMEIRA"} sub="Esse bug vai voltar 3 vezes. E a culpa não é do dev."/>
        </DCArtboard>
        <DCArtboard id="b05-s1" label="Slide 01" width={S} height={S}>
          <Versus topic="O mesmo bug"
            wrong='"Não funciona o login."'
            right='"Login falha com e-mail válido + senha correta no Safari 17. Esperado: entrar. Real: erro 500."'/>
        </DCArtboard>
        <DCArtboard id="b05-s2" label="Slide 02" width={S} height={S}>
          <ChecklistLight heading="Todo bug report precisa de:"
            items={['Passos para reproduzir', 'Resultado esperado', 'Resultado real', 'Ambiente e versão', 'Evidência (print/log)', 'Impacto no usuário']}/>
        </DCArtboard>
        <DCArtboard id="b05-s3" label="Slide 03" width={S} height={S}>
          <SplitH left={"BUG\nVOLTA\nQUANDO\nFALTA\nCON-\nTEXTO."} right="Dev não adivinha. Quanto mais claro o report, menos idas e vindas pra resolver."/>
        </DCArtboard>
        <DCArtboard id="b05-cta" label="CTA" width={S} height={S}>
          <CTA lines={['REPORT CLARO.','FIX RÁPIDO.','MENOS','RETRABALHO.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 06. BOUNDARY VALUE NA PRÁTICA ───────────────── */}
      <DCSection id="b06" title="06 — Boundary value sem teoria vazia">
        <DCArtboard id="b06-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="Fundamentos" headline={"BOUNDARY\nVALUE NA\nPRÁTICA"} sub="Essa técnica tem nome difícil e uso simples. Veja na prática."/>
        </DCArtboard>
        <DCArtboard id="b06-s1" label="Slide 01" width={S} height={S}>
          <AmberPoint headline={"O BUG\nMORA NA\nBORDA."} body="Erros raramente aparecem no meio do intervalo. Aparecem no limite e logo depois dele."/>
        </DCArtboard>
        <DCArtboard id="b06-s2" label="Slide 02" width={S} height={S}>
          <GridCards heading="Campo aceita de 1 a 100. Teste:"
            items={['0', '1', '2', '99', '100', '101']}/>
        </DCArtboard>
        <DCArtboard id="b06-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="QUEM TESTA SÓ O VALOR DO MEIO TESTA JUSTO O CAMINHO QUE NUNCA QUEBRA." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b06-cta" label="CTA" width={S} height={S}>
          <CTALight lines={['TESTE OS','LIMITES.','É ONDE O BUG','SE ESCONDE.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 07. PROMPT DE IA QUE GERA TESTE ÚTIL ────────── */}
      <DCSection id="b07" title="07 — Prompt de IA que gera teste útil">
        <DCArtboard id="b07-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="IA em QA" headline={"PROMPT QUE\nGERA TESTE\nÚTIL"} sub="O prompt errado te dá 20 testes genéricos. O certo te dá 5 que importam."/>
        </DCArtboard>
        <DCArtboard id="b07-s1" label="Slide 01" width={S} height={S}>
          <Versus topic="O mesmo pedido"
            wrong='"Crie casos de teste pra tela de login."'
            right='"Aja como QA sênior. Liste cenários de risco pra login com 2FA, foco em borda e falha. Contexto: banco."'/>
        </DCArtboard>
        <DCArtboard id="b07-s2" label="Slide 02" width={S} height={S}>
          <ChecklistAmber heading="Um bom prompt traz:"
            items={['Papel (aja como QA sênior)', 'Contexto do produto', 'O risco que você quer cobrir', 'O formato da resposta', 'O que deve ser ignorado']}/>
        </DCArtboard>
        <DCArtboard id="b07-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="A IA NÃO ADIVINHA O RISCO DO SEU PRODUTO. VOCÊ PRECISA ENTREGAR ESSE CONTEXTO." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b07-cta" label="CTA" width={S} height={S}>
          <CTA lines={['CONTEXTO','BOM GERA','TESTE BOM.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 08. CODE REVIEW DE TESTE AUTOMATIZADO ───────── */}
      <DCSection id="b08" title="08 — Code review de teste automatizado">
        <DCArtboard id="b08-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Automação" headline={"CODE REVIEW\nDE TESTE\n(SIM, EXISTE)"} sub="Seu time revisa código de produção. Quem revisa o código do teste?"/>
        </DCArtboard>
        <DCArtboard id="b08-s1" label="Slide 01" width={S} height={S}>
          <AmberPointLight headline={"TESTE\nTAMBÉM É\nCÓDIGO."} body="Se ninguém revisa, ele apodrece: seletor frágil, espera fixa, cenário que não testa nada."/>
        </DCArtboard>
        <DCArtboard id="b08-s2" label="Slide 02" width={S} height={S}>
          <ChecklistLight heading="No review de teste, olhe:"
            items={['O cenário cobre o risco certo?', 'Os seletores são estáveis?', 'Tem espera fixa (sleep)?', 'O teste é independente?', 'O nome diz o que valida?', 'Vai ser fácil de manter?']}/>
        </DCArtboard>
        <DCArtboard id="b08-s3" label="Slide 03" width={S} height={S}>
          <Quote text="UM TESTE QUE NINGUÉM REVISA É UM FALSO POSITIVO ESPERANDO PRA ACONTECER." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b08-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['REVISE O','TESTE COMO','REVISA O','PRODUTO.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 09. MATRIZ DE RISCO EM 4 PERGUNTAS ──────────── */}
      <DCSection id="b09" title="09 — Matriz de risco em 4 perguntas">
        <DCArtboard id="b09-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="Fundamentos" headline={"MATRIZ DE\nRISCO EM 4\nPERGUNTAS"} sub="Risco não é feeling. São 4 perguntas que qualquer QA faz hoje."/>
        </DCArtboard>
        <DCArtboard id="b09-s1" label="Slide 01" width={S} height={S}>
          <ChecklistAmber heading="Pra cada funcionalidade, pergunte:"
            items={['Qual a chance de falhar?', 'Qual o impacto se falhar?', 'Quantos usuários afeta?', 'Dá pra perceber rápido se quebrar?']}/>
        </DCArtboard>
        <DCArtboard id="b09-s2" label="Slide 02" width={S} height={S}>
          <CompareTable rows={[
            ['Baixa chance + baixo impacto', 'Alta chance + alto impacto'],
            ['Testa por último', 'Testa primeiro'],
            ['Cobertura leve', 'Cobertura profunda'],
          ]}/>
        </DCArtboard>
        <DCArtboard id="b09-s3" label="Slide 03" width={S} height={S}>
          <SplitH left={"RISCO =\nCHANCE\n×\nIM-\nPACTO."} right="Não é sobre testar tudo igual. É sobre dar profundidade onde o estrago é maior."/>
        </DCArtboard>
        <DCArtboard id="b09-cta" label="CTA" width={S} height={S}>
          <CTA lines={['MEÇA O','RISCO.','PARE DE','ADIVINHAR.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 10. REFINAMENTO SEM SER O CHATO ─────────────── */}
      <DCSection id="b10" title="10 — Refinamento sem ser o chato">
        <DCArtboard id="b10-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="QA no Ágil" headline={"REFINAMENTO\nSEM SER O\nCHATO"} sub="Tem um jeito de fazer pergunta no refinamento que não irrita ninguém. E funciona."/>
        </DCArtboard>
        <DCArtboard id="b10-s1" label="Slide 01" width={S} height={S}>
          <Versus topic="A mesma dúvida"
            wrong='"Isso aí não vai funcionar."'
            right='"E se o usuário fizer X nesse fluxo? Como a gente quer que o sistema responda?"'/>
        </DCArtboard>
        <DCArtboard id="b10-s2" label="Slide 02" width={S} height={S}>
          <ChecklistLight heading="Perguntas que somam:"
            items={['"Qual o comportamento esperado no erro?"', '"Esse campo é obrigatório?"', '"O que acontece se vier vazio?"', '"Tem limite de valor aqui?"', '"Quem é o usuário desse fluxo?"']}/>
        </DCArtboard>
        <DCArtboard id="b10-s3" label="Slide 03" width={S} height={S}>
          <AmberPointLight headline={"PERGUNTA\nNÃO ATRASA.\nEVITA RETRA-\nBALHO."} body="A dúvida que você levanta no refinamento é a sprint que você não perde depois."/>
        </DCArtboard>
        <DCArtboard id="b10-cta" label="CTA" width={S} height={S}>
          <CTALight lines={['PERGUNTE','CEDO.','ENTREGUE','MELHOR.']}/>
        </DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
