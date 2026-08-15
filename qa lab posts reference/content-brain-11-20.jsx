/* ── QALabBrain Carrosséis 11–20 — TIPO 2: Comparativo + TIPO 3: Erros ── */
const { DesignCanvas, DCSection, DCArtboard } = window;

function App() {
  return (
    <DesignCanvas>

      {/* ── 11. SMOKE TEST VS SANITY TEST ───────────────── */}
      <DCSection id="b11" title="11 — Smoke test vs sanity test">
        <DCArtboard id="b11-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Fundamentos" headline={"SMOKE VS\nSANITY\nTEST"} sub="Você usa os dois termos como sinônimo. E isso já causou retrabalho."/>
        </DCArtboard>
        <DCArtboard id="b11-s1" label="Slide 01" width={S} height={S}>
          <CompareTable rows={[
            ['A build está de pé?', 'A correção funcionou?'],
            ['Amplo e superficial', 'Estreito e profundo'],
            ['A cada novo deploy', 'Após um bug fix'],
          ]}/>
        </DCArtboard>
        <DCArtboard id="b11-s2" label="Slide 02" width={S} height={S}>
          <Stacked heading="Quando usar cada um:"
            boxes={[
              { label: 'Smoke', text: 'Build nova chegou. Roda antes de investir tempo testando a fundo.', amber: false },
              { label: 'Sanity', text: 'Saiu um fix pontual. Roda só naquela área alterada.', amber: true },
            ]}/>
        </DCArtboard>
        <DCArtboard id="b11-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="USAR O TERMO ERRADO NÃO É DETALHE. É O TIME TESTANDO A COISA ERRADA NA HORA ERRADA." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b11-cta" label="CTA" width={S} height={S}>
          <CTA lines={['TERMO CERTO.','TESTE CERTO.','NA HORA','CERTA.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 12. COBERTURA ALTA VS COBERTURA ÚTIL ────────── */}
      <DCSection id="b12" title="12 — Cobertura alta vs cobertura útil">
        <DCArtboard id="b12-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="Automação" headline={"COBERTURA\nALTA VS\nÚTIL"} sub="90% de cobertura e o bug crítico passou direto. Como isso acontece."/>
        </DCArtboard>
        <DCArtboard id="b12-s1" label="Slide 01" width={S} height={S}>
          <BigStat number="90" unit="%" caption="de cobertura. E o bug que derrubou o checkout passou direto. Cobertura mede linha, não risco."/>
        </DCArtboard>
        <DCArtboard id="b12-s2" label="Slide 02" width={S} height={S}>
          <CompareTable rows={[
            ['Cobre linhas de código', 'Cobre cenários de risco'],
            ['Mira a métrica', 'Mira o usuário'],
            ['Testa o que é fácil', 'Testa o que importa'],
          ]}/>
        </DCArtboard>
        <DCArtboard id="b12-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="COBERTURA ALTA DIZ QUANTO CÓDIGO RODOU. NÃO DIZ SE O QUE IMPORTA FOI TESTADO." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b12-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['COBERTURA','NÃO É PROVA','DE','QUALIDADE.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 13. QA QUE PERGUNTA VS QA QUE ASSUME ─────────── */}
      <DCSection id="b13" title="13 — QA que pergunta vs QA que assume">
        <DCArtboard id="b13-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="Carreira QA" headline={"PERGUNTAR\nTUDO VS\nASSUMIR TUDO"} sub="Os dois parecem produtivos. Só um realmente protege a entrega."/>
        </DCArtboard>
        <DCArtboard id="b13-s1" label="Slide 01" width={S} height={S}>
          <CompareTable rows={[
            ['Assume o requisito', 'Confirma o requisito'],
            ['"Acho que é assim"', '"Como deve se comportar?"'],
            ['Descobre o erro no fim', 'Descobre a dúvida no início'],
          ]}/>
        </DCArtboard>
        <DCArtboard id="b13-s2" label="Slide 02" width={S} height={S}>
          <AmberPoint headline={"ASSUMIR É\nRÁPIDO.\nE CARO."} body="Cada suposição não confirmada é um bug em potencial esperando a sprint acabar."/>
        </DCArtboard>
        <DCArtboard id="b13-s3" label="Slide 03" width={S} height={S}>
          <Quote text="O QA QUE PERGUNTA PARECE MAIS LENTO HOJE. E EVITA O RETRABALHO DE AMANHÃ." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b13-cta" label="CTA" width={S} height={S}>
          <CTA lines={['NA DÚVIDA,','PERGUNTE.','NÃO ASSUMA.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 14. RÁPIDO DE FAZER VS FÁCIL DE MANTER ──────── */}
      <DCSection id="b14" title="14 — Automação: rápida vs sustentável">
        <DCArtboard id="b14-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Automação" headline={"RÁPIDO DE\nFAZER VS\nFÁCIL DE\nMANTER"} sub="O script que você escreveu em 1 hora vai te custar 10 horas em 3 meses."/>
        </DCArtboard>
        <DCArtboard id="b14-s1" label="Slide 01" width={S} height={S}>
          <CompareTable rows={[
            ['Seletor pelo texto da tela', 'Seletor estável (data-testid)'],
            ['Espera fixa (sleep)', 'Espera pela condição'],
            ['Copia e cola cenário', 'Função reutilizável'],
          ]}/>
        </DCArtboard>
        <DCArtboard id="b14-s2" label="Slide 02" width={S} height={S}>
          <SplitH left={"O CUSTO\nNÃO É\nESCRE-\nVER.\nÉ MAN-\nTER."} right="Você escreve um teste uma vez. Mantém ele toda vez que a tela muda."/>
        </DCArtboard>
        <DCArtboard id="b14-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="AUTOMAÇÃO RÁPIDA DE FAZER E DIFÍCIL DE MANTER É DÍVIDA QUE VENCE TODA SPRINT." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b14-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['ESCREVA','PENSANDO','EM QUEM','VAI MANTER.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 15. TESTE MANUAL: ATRASO OU ESTRATÉGIA ──────── */}
      <DCSection id="b15" title="15 — Teste manual: atraso ou estratégia">
        <DCArtboard id="b15-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="Fundamentos" headline={"TESTE MANUAL:\nATRASO OU\nESTRATÉGIA?"} sub="82% dos QAs ainda fazem teste manual todo dia. Não é atraso, é decisão."/>
        </DCArtboard>
        <DCArtboard id="b15-s1" label="Slide 01" width={S} height={S}>
          <BigStat number="82" unit="%" caption="dos QAs ainda fazem teste manual no dia a dia. Não porque ficaram pra trás, mas porque há coisas que só o olhar humano pega."/>
        </DCArtboard>
        <DCArtboard id="b15-s2" label="Slide 02" width={S} height={S}>
          <GridCards heading="Manual é insubstituível em:"
            items={['Exploratório', 'Usabilidade', 'Fluxo novo e instável', 'Caso de borda raro', 'Contexto de negócio', 'Olhar crítico']}/>
        </DCArtboard>
        <DCArtboard id="b15-s3" label="Slide 03" width={S} height={S}>
          <Quote text="AUTOMAÇÃO REPETE O QUE VOCÊ JÁ SABE. O MANUAL DESCOBRE O QUE VOCÊ AINDA NÃO PERGUNTOU." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b15-cta" label="CTA" width={S} height={S}>
          <CTA lines={['MANUAL NÃO','É ATRASO.','É ESCOLHA','CONSCIENTE.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 16. A IA VAI SUBSTITUIR O QA? ───────────────── */}
      <DCSection id="b16" title="16 — IA substitui QA ou tarefa repetitiva?">
        <DCArtboard id="b16-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="IA em QA" headline={"A IA VAI\nSUBSTITUIR\nO QA?"} sub="Essa frase assustou muita gente. Ela está errada pela metade."/>
        </DCArtboard>
        <DCArtboard id="b16-s1" label="Slide 01" width={S} height={S}>
          <CompareTable rows={[
            ['IA substitui o QA', 'IA substitui a tarefa repetitiva'],
            ['Gera o caso de teste', 'Decide qual risco importa'],
            ['Executa', 'Interpreta o resultado'],
          ]}/>
        </DCArtboard>
        <DCArtboard id="b16-s2" label="Slide 02" width={S} height={S}>
          <AmberPointLight headline={"A IA FAZ.\nVOCÊ\nDECIDE."} body="Gerar 50 testes é fácil. Saber quais 5 protegem o negócio continua sendo trabalho humano."/>
        </DCArtboard>
        <DCArtboard id="b16-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="A IA NÃO TIRA O LUGAR DE QUEM PENSA. TIRA O LUGAR DE QUEM SÓ EXECUTA." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b16-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['USE A IA','COMO','FERRAMENTA.','NÃO COMO','MURO.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 17. DoD ESCRITO VS DoD PRATICADO ────────────── */}
      <DCSection id="b17" title="17 — Definition of Done: escrito vs praticado">
        <DCArtboard id="b17-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="QA no Ágil" headline={"DoD ESCRITO\nVS DoD\nPRATICADO"} sub="Seu time tem DoD no quadro. Pergunta se alguém olha ele antes de codar."/>
        </DCArtboard>
        <DCArtboard id="b17-s1" label="Slide 01" width={S} height={S}>
          <CompareTable rows={[
            ['DoD no Confluence', 'DoD na conversa do refino'],
            ['Lido na auditoria', 'Usado em cada PR'],
            ['"Tá pronto"', '"Pronto pelo critério X"'],
          ]}/>
        </DCArtboard>
        <DCArtboard id="b17-s2" label="Slide 02" width={S} height={S}>
          <ChecklistAmber heading="Um DoD vivo inclui:"
            items={['Critérios de aceite atendidos', 'Testado em borda e erro', 'Sem regressão conhecida', 'Documentação atualizada', 'Revisado por outra pessoa']}/>
        </DCArtboard>
        <DCArtboard id="b17-s3" label="Slide 03" width={S} height={S}>
          <Quote text="DoD QUE NINGUÉM PRATICA NÃO DEFINE PRONTO. SÓ DECORA A PAREDE DO QUADRO." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b17-cta" label="CTA" width={S} height={S}>
          <CTA lines={['DoD É PRA','USAR.','NÃO PRA','EXIBIR.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 18. BUG EM PROD: CULPA DE QUEM? ─────────────── */}
      <DCSection id="b18" title="18 — Bug em produção: QA ou processo?">
        <DCArtboard id="b18-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="Fundamentos" headline={"BUG EM PROD:\nCULPA DE\nQUEM?"} sub="Todo time aponta o dedo pro QA primeiro. Os dados dizem outra coisa."/>
        </DCArtboard>
        <DCArtboard id="b18-s1" label="Slide 01" width={S} height={S}>
          <Stacked heading="Onde o bug realmente nasceu:"
            boxes={[
              { label: 'Requisito', text: 'Critério ambíguo desde o início', amber: false },
              { label: 'Prazo', text: 'Tempo de teste cortado no fim', amber: false },
              { label: 'Mudança', text: 'Alteração de última hora sem aviso', amber: false },
              { label: 'Processo', text: 'QA entrou tarde demais', amber: true },
            ]}/>
        </DCArtboard>
        <DCArtboard id="b18-s2" label="Slide 02" width={S} height={S}>
          <AmberPoint headline={"CAÇA AO\nCULPADO NÃO\nCONSERTA O\nPROCESSO."} body="Apontar o QA é rápido. Entender por que o bug passou é o que evita o próximo."/>
        </DCArtboard>
        <DCArtboard id="b18-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="BUG EM PRODUÇÃO QUASE NUNCA É FALHA DE UMA PESSOA. É SINTOMA DE UM PROCESSO." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b18-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['PERGUNTE','POR QUE','PASSOU.','NÃO QUEM','DEIXOU.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 19. 5 SINAIS DE AUTOMAÇÃO DOENTE ────────────── */}
      <DCSection id="b19" title="19 — 5 sinais de automação doente">
        <DCArtboard id="b19-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Automação" headline={"5 SINAIS DE\nAUTOMAÇÃO\nDOENTE"} sub="Sua suíte de testes demora mais que o deploy. Isso é um sintoma."/>
        </DCArtboard>
        <DCArtboard id="b19-s1" label="01" width={S} height={S}>
          <ListItem num={1} title={"DEMORA\nMAIS QUE\nO DEPLOY"} body="Quando o teste vira gargalo, o time começa a pular ele. E aí ele perde a função."/>
        </DCArtboard>
        <DCArtboard id="b19-s2" label="02" width={S} height={S}>
          <ListItemAmber num={2} title={"FALHA SEM\nMOTIVO\nREAL"} body="Flaky test treina o time a ignorar vermelho. Falso alarme vira ruído."/>
        </DCArtboard>
        <DCArtboard id="b19-s3" label="03" width={S} height={S}>
          <ListItem num={3} title={"NINGUÉM\nSABE\nMANTER"} body="Só uma pessoa entende a suíte. Ela sai e a automação morre junto."/>
        </DCArtboard>
        <DCArtboard id="b19-s4" label="04" width={S} height={S}>
          <ListItemAmber num={4} title={"QUEBRA A\nCADA TELA\nNOVA"} body="Seletor frágil faz qualquer mudança de UI derrubar 20 testes que nem eram sobre aquilo."/>
        </DCArtboard>
        <DCArtboard id="b19-s5" label="05" width={S} height={S}>
          <ListItem num={5} title={"NÃO COBRE\nO QUE\nIMPORTA"} body="Cem testes verdes no que nunca quebra. Zero no fluxo crítico de verdade."/>
        </DCArtboard>
        <DCArtboard id="b19-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['AUTOMAÇÃO','BOA AJUDA.','DOENTE','ATRAPALHA.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 20. 4 ERROS QUE FAZEM IGNORAR SEU BUG ───────── */}
      <DCSection id="b20" title="20 — 4 erros que fazem o PO ignorar seu bug">
        <DCArtboard id="b20-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="QA no Ágil" headline={"4 ERROS QUE\nFAZEM IGNORAR\nSEU BUG"} sub="Você escreveu o bug certo. Mas do jeito errado pra essa pessoa ler."/>
        </DCArtboard>
        <DCArtboard id="b20-s1" label="01" width={S} height={S}>
          <ListItemAmber num={1} title={"SÓ FALA O\nTÉCNICO"} body='"Erro 500 no endpoint" não diz nada pro PO. Diga o que o usuário não consegue fazer.'/>
        </DCArtboard>
        <DCArtboard id="b20-s2" label="02" width={S} height={S}>
          <ListItem num={2} title={"NÃO MOSTRA\nO IMPACTO"} body="Sem impacto, todo bug parece P3. Conecte com venda, retenção ou risco."/>
        </DCArtboard>
        <DCArtboard id="b20-s3" label="03" width={S} height={S}>
          <ListItemAmber num={3} title={"FALTA\nEVIDÊNCIA"} body="Sem print, sem log, sem passo. O PO não vai reproduzir pra acreditar em você."/>
        </DCArtboard>
        <DCArtboard id="b20-s4" label="04" width={S} height={S}>
          <ListItem num={4} title={"ESCREVE\nUM TEXTÃO"} body="Report de dois parágrafos não é lido. Vá direto: o quê, onde, impacto."/>
        </DCArtboard>
        <DCArtboard id="b20-cta" label="CTA" width={S} height={S}>
          <CTA lines={['ESCREVA O','BUG PRA','QUEM VAI','PRIORIZAR.']}/>
        </DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
