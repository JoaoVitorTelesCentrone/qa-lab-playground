/* ── QA Lab Content Posts 11–20 — Visual Variety ────────── */
const { DesignCanvas, DCSection, DCArtboard } = window;

function App() {
  return (
    <DesignCanvas>

      {/* ── 11. O QUE O QA NÃO VÊ SOZINHO ──────────────── */}
      <DCSection id="c11" title="11 — O que o QA não vê sozinho">
        <DCArtboard id="c11-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="Colaboração" headline={"O QUE\nO QA NÃO\nVÊ SOZINHO"} sub="QA tem um olhar importante. Mas não vê tudo sozinho."/>
        </DCArtboard>
        <DCArtboard id="c11-s1" label="Slide 01" width={S} height={S}>
          <Stacked heading="Quem enxerga o quê:"
            boxes={[
              { label: 'Dev', text: 'Riscos técnicos que o QA talvez não veja', amber: false, outline: false },
              { label: 'Produto', text: 'Decisões de negócio que mudam o impacto de um bug', amber: false, outline: false },
              { label: 'Suporte', text: 'Dores reais dos usuários no dia a dia', amber: false, outline: false },
              { label: 'Design', text: 'Problemas de experiência e usabilidade', amber: false, outline: true },
            ]}/>
        </DCArtboard>
        <DCArtboard id="c11-s2" label="Slide 02" width={S} height={S}>
          <SplitH left={"QA\nFAZ AS\nPER-\nGUNTAS\nCERTAS."} right="O QA não precisa ter todas as respostas. Pode ser a pessoa que conecta o time."/>
        </DCArtboard>
        <DCArtboard id="c11-cta" label="CTA" width={S} height={S}>
          <CTALight lines={['QUALIDADE','NÃO NASCE','DE UM OLHAR','ISOLADO.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 12. COMO NÃO SER SUBSTITUÍDO ────────────────── */}
      <DCSection id="c12" title="12 — Como não ser substituído">
        <DCArtboard id="c12-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Futuro QA" headline={"COMO NÃO\nSER\nSUBSTI-\nTUÍDO"} sub="Se seu trabalho se resume a executar roteiro, você está em risco."/>
        </DCArtboard>
        <DCArtboard id="c12-s1" label="Slide 01" width={S} height={S}>
          <GridCards heading="Difícil de substituir:"
            items={['Pensamento crítico', 'Contexto de produto', 'Comunicação de risco', 'Priorização', 'Influência no time', 'Visão do usuário']}/>
        </DCArtboard>
        <DCArtboard id="c12-s2" label="Slide 02" width={S} height={S}>
          <Versus topic="A pergunta certa"
            wrong='"A IA vai substituir QA?"'
            right='"Que parte do meu trabalho é realmente estratégica?"'/>
        </DCArtboard>
        <DCArtboard id="c12-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="O CAMINHO NÃO É COMPETIR COM FERRAMENTA. É DEIXAR DE SER APENAS OPERADOR DELA." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="c12-cta" label="CTA" width={S} height={S}>
          <CTA lines={['FERRAMENTAS','MUDAM.','QUEM ENTENDE','RISCO','PERMANECE.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 13. 3 MOTIVOS QUE VOCÊ NÃO EVOLUI ──────────── */}
      <DCSection id="c13" title="13 — 3 motivos que você não evolui como QA">
        <DCArtboard id="c13-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="Evolução" headline={"POR QUE\nVOCÊ NÃO\nEVOLUI\nCOMO QA"} sub="Nem sempre trava por falta de oportunidade."/>
        </DCArtboard>
        <DCArtboard id="c13-s1" label="01" width={S} height={S}>
          <ListItemAmber num={1} title={"ESTUDA\nSEM\nAPLICAR"} body="Assiste curso, salva conteúdo, lê post, mas não transforma nada em prática."/>
        </DCArtboard>
        <DCArtboard id="c13-s2" label="02" width={S} height={S}>
          <ListItem num={2} title={"ESPERA\nALGUÉM\nTE GUIAR"} body="Mentoria ajuda, liderança ajuda, mas carreira também exige iniciativa própria."/>
        </DCArtboard>
        <DCArtboard id="c13-s3" label="03" width={S} height={S}>
          <ListItemAmber num={3} title={"NÃO SABE\nMOSTRAR\nIMPACTO"} body="Trabalha muito, mas ninguém entende o valor do que entregou."/>
        </DCArtboard>
        <DCArtboard id="c13-s4" label="Slide 04" width={S} height={S}>
          <ChecklistLight heading="Comece por:"
            items={['Documente melhor seus testes', 'Participe mais do refinamento', 'Estude API e banco de dados', 'Aprenda automação com propósito', 'Mostre os riscos que você evitou']}/>
        </DCArtboard>
        <DCArtboard id="c13-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['A CARREIRA','MUDA QUANDO','SUA FORMA','DE ATUAR','MUDA.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 14. ROADMAP PARA EVOLUÇÃO QA ────────────────── */}
      <DCSection id="c14" title="14 — Roadmap para evolução QA">
        <DCArtboard id="c14-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="Trilha" headline={"ROADMAP\nEVOLUÇÃO\nQA"} sub="Eu não começaria por automação. Começaria por base."/>
        </DCArtboard>
        <DCArtboard id="c14-s1" label="01–02" width={S} height={S}>
          <RoadmapDouble items={[
            { n: '01', t: 'Fundamentos de teste', d: 'Tipos, níveis, caixa preta, regressão, exploratório, critérios de aceite.' },
            { n: '02', t: 'Produto e negócio', d: 'Entender regra, usuário, impacto e prioridade.' },
          ]}/>
        </DCArtboard>
        <DCArtboard id="c14-s2" label="03–04" width={S} height={S}>
          <RoadmapDouble items={[
            { n: '03', t: 'Comunicação', d: 'Bugs claros, explicar risco e alinhar expectativa com o time.' },
            { n: '04', t: 'API', d: 'Validar contrato, status code, payload, autenticação e cenários negativos.' },
          ]}/>
        </DCArtboard>
        <DCArtboard id="c14-s3" label="05–06" width={S} height={S}>
          <RoadmapDouble items={[
            { n: '05', t: 'Banco de dados', d: 'Consultar dados, entender relacionamento e validar além da interface.' },
            { n: '06', t: 'Automação', d: 'Automatizar fluxos que fazem sentido, com código limpo e manutenção simples.' },
          ]}/>
        </DCArtboard>
        <DCArtboard id="c14-s4" label="07–08" width={S} height={S}>
          <RoadmapDouble items={[
            { n: '07', t: 'CI/CD', d: 'Entender onde os testes entram no fluxo de entrega.' },
            { n: '08', t: 'Estratégia de qualidade', d: 'Pensar em cobertura, risco, processo e melhoria contínua.' },
          ]}/>
        </DCArtboard>
        <DCArtboard id="c14-cta" label="CTA" width={S} height={S}>
          <CTA lines={['QA EVOLUI','QUANDO PARA','DE PENSAR','SÓ EM','EXECUÇÃO.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 15. COMO LIDAR COM BUGS EM PRODUÇÃO ─────────── */}
      <DCSection id="c15" title="15 — Como lidar com bugs em produção">
        <DCArtboard id="c15-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Produção" headline={"BUG EM\nPRODUÇÃO.\nE AGORA?"} sub="Não deveria virar caça às bruxas. Deveria virar aprendizado."/>
        </DCArtboard>
        <DCArtboard id="c15-s1" label="Slide 01" width={S} height={S}>
          <ChecklistAmber heading="Primeiro: entender o impacto"
            items={['Quem foi afetado?', 'Qual fluxo quebrou?', 'Existe contorno?', 'Precisa de rollback?', 'Qual a prioridade real?']}/>
        </DCArtboard>
        <DCArtboard id="c15-s2" label="Slide 02" width={S} height={S}>
          <Checklist heading="Depois: investigar a causa"
            items={['Cenário não foi testado?', 'Requisito estava incompleto?', 'Houve mudança de última hora?', 'Faltou monitoramento?', 'Risco aceito mas não documentado?']}/>
        </DCArtboard>
        <DCArtboard id="c15-s3" label="Slide 03" width={S} height={S}>
          <Quote text="O PIOR BUG NÃO É O QUE CHEGA EM PRODUÇÃO. É AQUELE QUE NÃO ENSINA NADA AO TIME." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="c15-cta" label="CTA" width={S} height={S}>
          <CTALight lines={['QUALIDADE','É RESULTADO','DO TIME.','NÃO SÓ','DO QA.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 16. É POSSÍVEL NÃO TER BUGS EM PRODUÇÃO? ───── */}
      <DCSection id="c16" title="16 — É possível não ter bugs em produção?">
        <DCArtboard id="c16-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="Realidade" headline={"ZERO BUGS\nEM PROD.\nPOSSÍVEL?"} sub="Não. E quem promete isso está vendendo ilusão."/>
        </DCArtboard>
        <DCArtboard id="c16-s1" label="Slide 01" width={S} height={S}>
          <ChecklistLight heading="O objetivo não é eliminar 100%. É:"
            items={['Reduzir risco', 'Encontrar problemas mais cedo', 'Evitar falhas críticas', 'Ter monitoramento', 'Ter rollback', 'Tomar decisões conscientes']}/>
        </DCArtboard>
        <DCArtboard id="c16-s2" label="Slide 02" width={S} height={S}>
          <SplitH left={"APP\nMADURA\nNÃO É\nA QUE\nNUNCA\nTEM BUG."} right="É a que sabe prevenir, detectar, responder e aprender com cada incidente."/>
        </DCArtboard>
        <DCArtboard id="c16-cta" label="CTA" width={S} height={S}>
          <CTA lines={['QUALIDADE','REAL NÃO É','PERFEIÇÃO.','É CONTROLE','DE RISCO.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 17. COMO DEIXAR DE SER TESTER ───────────────── */}
      <DCSection id="c17" title="17 — Como deixar de ser tester">
        <DCArtboard id="c17-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="Evolução" headline={"COMO\nDEIXAR\nDE SER\nTESTER"} sub="Não é parar de testar. É parar de ser visto só como executor."/>
        </DCArtboard>
        <DCArtboard id="c17-s1" label="Slide 01" width={S} height={S}>
          <ChecklistAmber heading="Comece a perguntar:"
            items={['"Qual problema essa feature resolve?"', '"O que pode dar errado?"', '"Qual impacto se falhar?"', '"Quais cenários são mais críticos?"', '"O que melhorar antes de desenvolver?"']}/>
        </DCArtboard>
        <DCArtboard id="c17-s2" label="Slide 02" width={S} height={S}>
          <CompareTable rows={[
            ['Tester executa cenário.', 'QA analisa risco.'],
            ['Tester valida entrega.', 'QA influencia processo.'],
            ['Tester aparece no final.', 'QA participa do começo.'],
          ]}/>
        </DCArtboard>
        <DCArtboard id="c17-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['A EVOLUÇÃO','NÃO ESTÁ','NO CARGO.','ESTÁ NA','POSTURA.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 18. QUALIDADE NÃO É SÓ DO QA ───────────────── */}
      <DCSection id="c18" title="18 — Você não é o único responsável">
        <DCArtboard id="c18-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Responsabilidade" headline={"VOCÊ NÃO\nÉ O ÚNICO\nRESPON-\nSÁVEL"} sub="Se um bug vai pra prod, muita gente olha pro QA. Mas deveria?"/>
        </DCArtboard>
        <DCArtboard id="c18-s1" label="Slide 01" width={S} height={S}>
          <Stacked heading="Cada área é responsável:"
            boxes={[
              { label: 'Produto', text: 'Clareza de requisito', amber: false, outline: false },
              { label: 'Dev', text: 'Qualidade técnica', amber: false, outline: false },
              { label: 'Design', text: 'Experiência do usuário', amber: false, outline: false },
              { label: 'QA', text: 'Riscos, cenários e impacto', amber: false, outline: true },
            ]}/>
        </DCArtboard>
        <DCArtboard id="c18-s2" label="Slide 02" width={S} height={S}>
          <AmberPointLight headline={"QUANDO\nQUALIDADE\nVIRA SÓ\nDO QA..."} body="O time terceiriza o problema. O QA entra tarde, com pouco tempo e muita pressão."/>
        </DCArtboard>
        <DCArtboard id="c18-cta" label="CTA" width={S} height={S}>
          <CTA lines={['QUALIDADE','NÃO SE','INSPECIONA.','SE CONSTRÓI.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 19. COMO MOSTRAR QUE QUALIDADE É DE TODOS ───── */}
      <DCSection id="c19" title="19 — Como mostrar que qualidade é de todos">
        <DCArtboard id="c19-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="Cultura" headline={"QUALIDADE\nÉ DE\nTODOS.\nCOMO?"} sub="Dizer é fácil. Difícil é transformar em prática."/>
        </DCArtboard>
        <DCArtboard id="c19-s1" label="Slide 01" width={S} height={S}>
          <Stacked boxes={[
            { label: 'Produto', text: 'Escreve critérios de aceite mais claros', amber: false, outline: false },
            { label: 'Dev', text: 'Pensa em testes unitários e impactos', amber: false, outline: false },
            { label: 'QA', text: 'Participa do refinamento antes do dev', amber: true },
            { label: 'Design', text: 'Considera estados de erro e vazio', amber: false, outline: false },
            { label: 'Liderança', text: 'Não trata teste como sobra de prazo', amber: false, outline: true },
          ]}/>
        </DCArtboard>
        <DCArtboard id="c19-s2" label="Slide 02" width={S} height={S}>
          <QuoteLight text="QUALIDADE NÃO NASCE DE UMA PESSOA NO FINAL. NASCE DE UM TIME QUE CONSTRÓI MELHOR." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="c19-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['NÃO JOGUE','TUDO NO','COLO DO QA','NO ÚLTIMO','DIA.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 20. 5 MANEIRAS DE MOSTRAR VALOR ─────────────── */}
      <DCSection id="c20" title="20 — 5 maneiras de mostrar valor sendo QA">
        <DCArtboard id="c20-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="Valor" headline={"5 FORMAS\nDE MOSTRAR\nVALOR\nSENDO QA"} sub="Trabalhar muito ≠ valor claro."/>
        </DCArtboard>
        <DCArtboard id="c20-s1" label="01" width={S} height={S}>
          <ListItem num={1} title={"MOSTRE\nRISCOS\nEVITADOS"} body="Não fale só dos bugs encontrados. Explique o que aconteceria se fossem pra prod."/>
        </DCArtboard>
        <DCArtboard id="c20-s2" label="02" width={S} height={S}>
          <ListItemAmber num={2} title={"CONECTE\nBUG COM\nIMPACTO"} body="Um erro no checkout não é só um bug. Pode ser perda de venda real."/>
        </DCArtboard>
        <DCArtboard id="c20-s3" label="03" width={S} height={S}>
          <ListItem num={3} title={"PARTICIPE\nANTES"} body="Quanto mais cedo o QA entra, mais retrabalho pode evitar."/>
        </DCArtboard>
        <DCArtboard id="c20-s4" label="04" width={S} height={S}>
          <ListItemAmber num={4} title={"MELHORE O\nPROCESSO"} body="Se o mesmo problema acontece sempre, proponha uma mudança concreta."/>
        </DCArtboard>
        <DCArtboard id="c20-s5" label="05" width={S} height={S}>
          <ListItem num={5} title={"COMUNIQUE\nRESULTADO"} body="Mostre o que foi testado, o que ficou fora, quais riscos e a recomendação."/>
        </DCArtboard>
        <DCArtboard id="c20-cta" label="CTA" width={S} height={S}>
          <CTA lines={['VALOR É','CLAREZA,','PREVENÇÃO','E IMPACTO.']}/>
        </DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
