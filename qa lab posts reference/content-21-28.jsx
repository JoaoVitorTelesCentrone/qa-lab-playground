/* ── QA Lab Content Posts 21–28 — Visual Variety ────────── */
const { DesignCanvas, DCSection, DCArtboard } = window;

function App() {
  return (
    <DesignCanvas>

      {/* ── 21. COMO PROVAR SEU VALOR ───────────────────── */}
      <DCSection id="c21" title="21 — Como provar o seu valor sendo QA">
        <DCArtboard id="c21-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Impacto" headline={"COMO\nPROVAR\nSEU VALOR\nSENDO QA"} sub='Você não prova valor dizendo: "Testei bastante."'/>
        </DCArtboard>
        <DCArtboard id="c21-s1" label="Slide 01" width={S} height={S}>
          <SplitH left={"TRA-\nBALHO\nIMPOR-\nTANTE\nMAS\nINVI-\nSÍVEL."} right="Muitos QAs encontram riscos, evitam retrabalho, melhoram regras. Mas não registram nada disso."/>
        </DCArtboard>
        <DCArtboard id="c21-s2" label="Slide 02" width={S} height={S}>
          <ChecklistAmber heading="Mostre evidências:"
            items={['Riscos identificados antes', 'Bugs críticos evitados', 'Dúvidas de regra esclarecidas', 'Melhorias de processo', 'Decisões baseadas na sua análise', 'O que ficou fora por prazo']}/>
        </DCArtboard>
        <DCArtboard id="c21-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="SE VOCÊ NÃO MOSTRA O VALOR DO SEU TRABALHO, VÃO ACHAR QUE VOCÊ SÓ TESTA TELA." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="c21-cta" label="CTA" width={S} height={S}>
          <CTA lines={['NARRE','SEU','IMPACTO.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 22. NÃO LEVE A PRESSÃO SÓ PRA VOCÊ ─────────── */}
      <DCSection id="c22" title="22 — Não leve a pressão só pra você">
        <DCArtboard id="c22-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="Saúde" headline={"NÃO LEVE\nA PRESSÃO\nSÓ PRA\nVOCÊ"} sub="Muitos QAs carregam uma pressão que não deveria ser só deles."/>
        </DCArtboard>
        <DCArtboard id="c22-s1" label="Slide 01" width={S} height={S}>
          <GridCards heading="O cenário:"
            items={['Prazo apertado', 'Requisito incompleto', 'Mudança de última hora', 'Ambiente instável', 'Entrega crítica', '"Se der problema..."']}/>
        </DCArtboard>
        <DCArtboard id="c22-s2" label="Slide 02" width={S} height={S}>
          <Stacked heading="O papel do QA é:"
            boxes={[
              { label: 'Comunicar', text: 'Risco com clareza para todo o time', amber: false, outline: false },
              { label: 'Documentar', text: 'O que foi testado e o que não foi', amber: false, outline: false },
              { label: 'Alinhar', text: 'O que pode quebrar e o que precisa de decisão', amber: false, outline: true },
            ]}/>
        </DCArtboard>
        <DCArtboard id="c22-s3" label="Slide 03" width={S} height={S}>
          <Quote text="QA MADURO NÃO ACEITA PRESSÃO CALADO. TRANSFORMA PRESSÃO EM VISIBILIDADE PRO TIME." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="c22-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['A ENTREGA','É COMPAR-','TILHADA.','A PRESSÃO','TAMBÉM.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 23. AUTOMAÇÃO VAI TRANSFORMAR SUA CARREIRA? ─── */}
      <DCSection id="c23" title="23 — Automação sozinha vai transformar?">
        <DCArtboard id="c23-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="Carreira" headline={"AUTOMAÇÃO\nSOZINHA\nVAI TE\nTRANS-\nFORMAR?"} sub="Pode ajudar. Mas sozinha, não vai transformar nada."/>
        </DCArtboard>
        <DCArtboard id="c23-s1" label="Slide 01" width={S} height={S}>
          <ChecklistLight heading="Antes de escrever o teste:"
            items={['Qual risco estou cobrindo?', 'Esse fluxo é importante?', 'Vai quebrar toda hora?', 'O resultado ajuda a decidir?', 'Vai rodar em pipeline?', 'Vai ser mantido por quem?']}/>
        </DCArtboard>
        <DCArtboard id="c23-s2" label="Slide 02" width={S} height={S}>
          <Versus topic="Como se vender"
            wrong='"Sei automatizar."'
            right='"Ajudo times a entregar com mais segurança."'/>
        </DCArtboard>
        <DCArtboard id="c23-cta" label="CTA" width={S} height={S}>
          <CTA lines={['TÉCNICA +','ESTRATÉGIA +','COMUNICAÇÃO','= CARREIRA.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 24. COMO CRIAR AUTOMAÇÃO ROBUSTA ─────────────── */}
      <DCSection id="c24" title="24 — Automação robusta">
        <DCArtboard id="c24-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Automação" headline={"AUTOMAÇÃO\nROBUSTA:\nCOMO\nCRIAR"} sub="Não é a que cobre tudo. É a que entrega confiança."/>
        </DCArtboard>
        <DCArtboard id="c24-s1" label="Slide 01" width={S} height={S}>
          <GridCards heading="Teste automatizado bom é:"
            items={['Estável', 'Legível', 'Fácil manter', 'Rápido', 'Independente', 'Útil pro time']}/>
        </DCArtboard>
        <DCArtboard id="c24-s2" label="Slide 02" width={S} height={S}>
          <ChecklistAmber heading="Cuidados que fazem diferença:"
            items={['Use seletores confiáveis', 'Controle a massa de dados', 'Evite depender de testes anteriores', 'Não automatize fluxo instável', 'Dê nomes claros aos cenários', 'Entenda o objetivo antes']}/>
        </DCArtboard>
        <DCArtboard id="c24-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="AUTOMAÇÃO FRÁGIL GERA O EFEITO CONTRÁRIO. EM VEZ DE CONFIANÇA, VIRA RUÍDO." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="c24-cta" label="CTA" width={S} height={S}>
          <CTALight lines={['BOA AUTO-','MAÇÃO NÃO','É QUANTI-','DADE. É','CONFIANÇA.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 25. PRINCÍPIOS DE UMA BOA AUTOMAÇÃO ─────────── */}
      <DCSection id="c25" title="25 — 7 princípios de boa automação">
        <DCArtboard id="c25-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="Princípios" headline={"7 PRINCÍPIOS\nDE BOA\nAUTO-\nMAÇÃO"} sub='Não basta "funcionar na minha máquina".'/>
        </DCArtboard>
        <DCArtboard id="c25-s1" label="01" width={S} height={S}>
          <ListItem num={1} title={"CLARA"} body="Qualquer pessoa do time deve entender o objetivo do teste."/>
        </DCArtboard>
        <DCArtboard id="c25-s2" label="02" width={S} height={S}>
          <ListItemAmber num={2} title={"CONFIÁVEL"} body="Se falhou, o time precisa acreditar que existe algo real para investigar."/>
        </DCArtboard>
        <DCArtboard id="c25-s3" label="03" width={S} height={S}>
          <ListItem num={3} title={"RÁPIDA"} body="Teste que demora demais perde espaço no fluxo de entrega."/>
        </DCArtboard>
        <DCArtboard id="c25-s4" label="04" width={S} height={S}>
          <ListItemAmber num={4} title={"INDEPEN-\nDENTE"} body="Um teste não deveria depender do sucesso de outro."/>
        </DCArtboard>
        <DCArtboard id="c25-s5" label="05" width={S} height={S}>
          <ListItem num={5} title={"FÁCIL DE\nMANTER"} body="Se cada mudança pequena quebra tudo, tem problema de estrutura."/>
        </DCArtboard>
        <DCArtboard id="c25-s6" label="06" width={S} height={S}>
          <ListItemAmber num={6} title={"RELE-\nVANTE"} body="Nem tudo precisa ser automatizado. Automatize o que cobre risco importante."/>
        </DCArtboard>
        <DCArtboard id="c25-s7" label="07" width={S} height={S}>
          <ListItem num={7} title={"INTEGRADA"} body="Automação precisa fazer parte do processo, não ser um projeto paralelo esquecido."/>
        </DCArtboard>
        <DCArtboard id="c25-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['AUTOMAÇÃO','BOA AJUDA','O TIME.','NÃO','IMPRESSIONA.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 26. COMO MONTAR SEU PLANO DE CARREIRA ───────── */}
      <DCSection id="c26" title="26 — Plano de carreira QA">
        <DCArtboard id="c26-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="Plano" headline={"MONTE\nSEU PLANO\nDE\nCARREIRA"} sub="Primeiro: que tipo de QA você quer ser?"/>
        </DCArtboard>
        <DCArtboard id="c26-s1" label="Slide 01" width={S} height={S}>
          <GridCards heading="Qual caminho?"
            items={['Trilha técnica', 'Automação', 'Produto', 'Liderança', 'Especialista', 'Migrar pra dev']}/>
        </DCArtboard>
        <DCArtboard id="c26-s2" label="Slide 02" width={S} height={S}>
          <ChecklistAmber heading="Um bom plano tem:"
            items={['Objetivo claro', 'Habilidades técnicas', 'Habilidades comportamentais', 'Projetos práticos', 'Métricas de evolução', 'Feedback', 'Prazo']}/>
        </DCArtboard>
        <DCArtboard id="c26-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="CARREIRA NÃO EVOLUI SÓ COM CURSO. EVOLUI COM DIREÇÃO, PRÁTICA E CONSISTÊNCIA." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="c26-cta" label="CTA" width={S} height={S}>
          <CTA lines={['DIREÇÃO +','PRÁTICA +','CONSIS-','TÊNCIA.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 27. 5 COISAS DO PLANO DE CARREIRA ───────────── */}
      <DCSection id="c27" title="27 — 5 coisas que não podem faltar">
        <DCArtboard id="c27-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Essencial" headline={"5 COISAS\nQUE NÃO\nPODEM\nFALTAR"} sub="Um plano QA não pode ser só uma lista de cursos."/>
        </DCArtboard>
        <DCArtboard id="c27-s1" label="01" width={S} height={S}>
          <ListItemAmber num={1} title={"OBJETIVO\nCLARO"} body="Pleno, sênior, especialista, automação, liderança ou migrar pra dev?"/>
        </DCArtboard>
        <DCArtboard id="c27-s2" label="02" width={S} height={S}>
          <ListItem num={2} title={"HABILIDADES\nTÉCNICAS"} body="API, banco, automação, testes não funcionais, CI/CD."/>
        </DCArtboard>
        <DCArtboard id="c27-s3" label="03" width={S} height={S}>
          <ListItemAmber num={3} title={"HABILIDADES\nDE NEGÓCIO"} body="Entender produto, usuário, prioridade e impacto."/>
        </DCArtboard>
        <DCArtboard id="c27-s4" label="04" width={S} height={S}>
          <ListItem num={4} title={"PROVAS\nPRÁTICAS"} body="Projetos, automações, documentações, cases e melhorias implementadas."/>
        </DCArtboard>
        <DCArtboard id="c27-s5" label="05" width={S} height={S}>
          <ListItemAmber num={5} title={"FEEDBACK\nRECORRENTE"} body="Sem feedback, pode achar que está evoluindo enquanto repete os mesmos erros."/>
        </DCArtboard>
        <DCArtboard id="c27-cta" label="CTA" width={S} height={S}>
          <CTALight lines={['PLANO BOM','MUDA SUA','FORMA DE','ATUAR.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 28. POR QUE PRECISAMOS DE LÍDERES QAs ───────── */}
      <DCSection id="c28" title="28 — Por que precisamos de líderes QAs">
        <DCArtboard id="c28-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="Liderança" headline={"POR QUE\nPRECISAMOS\nDE LÍDERES\nQAs"} sub="Não para mandar em testers. Para elevar a maturidade."/>
        </DCArtboard>
        <DCArtboard id="c28-s1" label="Slide 01" width={S} height={S}>
          <ChecklistLight heading="Um líder QA ajuda a pensar em:"
            items={['Estratégia de testes', 'Riscos da entrega', 'Processo e métricas', 'Automação com propósito', 'Qualidade desde o refinamento', 'Evolução dos profissionais']}/>
        </DCArtboard>
        <DCArtboard id="c28-s2" label="Slide 02" width={S} height={S}>
          <VersusSplit
            wrong={['Testa no final', 'Corre contra prazo', 'Apaga incêndio', 'Culpa o QA', 'Repete problemas']}
            right={['Planeja cobertura', 'Antecipa risco', 'Previne incêndio', 'Compartilha dono', 'Melhora contínua']}/>
        </DCArtboard>
        <DCArtboard id="c28-s3" label="Slide 03" width={S} height={S}>
          <AmberPoint headline={"LIDERANÇA\nQA NÃO É\nCENTRALIZAR\nQUALIDADE."} body="É espalhar responsabilidade. É criar direção. É transformar teste em estratégia."/>
        </DCArtboard>
        <DCArtboard id="c28-cta" label="CTA" width={S} height={S}>
          <CTA lines={['QUALIDADE','NÃO MELHORA','SOZINHA.','ALGUÉM','PRECISA','PUXAR.']}/>
        </DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
