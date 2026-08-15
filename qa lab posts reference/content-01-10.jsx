/* ── QA Lab Content Posts 01–10 — Visual Variety ────────── */
const { DesignCanvas, DCSection, DCArtboard } = window;

function App() {
  return (
    <DesignCanvas>

      {/* ── 01. COMO SER VALORIZADO SENDO QA ────────────── */}
      <DCSection id="c01" title="01 — Como ser valorizado sendo QA">
        <DCArtboard id="c01-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="Carreira QA" headline={"COMO SER\nVALORIZADO\nSENDO QA"} sub="Não é sobre achar bug. É sobre gerar decisões melhores no time."/>
        </DCArtboard>
        <DCArtboard id="c01-s1" label="Slide 01" width={S} height={S}>
          <Versus topic="A diferença que muda tudo"
            wrong='"Tem um bug aqui."'
            right='"Se isso for pra produção assim, podemos impactar o usuário diretamente nesse ponto."'/>
        </DCArtboard>
        <DCArtboard id="c01-s2" label="Slide 02" width={S} height={S}>
          <ChecklistAmber heading="O QA valorizado..."
            items={['Entende o produto, não só a tela', 'Sabe explicar o risco de uma entrega ruim', 'Antecipa problemas antes do dev terminar', 'Ajuda o time a decidir o que testar primeiro', 'Comunica problemas sem criar guerra']}/>
        </DCArtboard>
        <DCArtboard id="c01-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="QA BOM TESTA SOFTWARE. QA VALORIZADO PROTEGE NEGÓCIO, USUÁRIO E ENTREGA." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="c01-cta" label="CTA" width={S} height={S}>
          <CTA lines={['PARA DE','ACHAR BUG.','COMEÇA A','PROTEGER.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 02. 5 ATITUDES DE UM QA VALORIZADO ──────────── */}
      <DCSection id="c02" title="02 — 5 atitudes de um QA valorizado">
        <DCArtboard id="c02-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="Atitudes" headline={"5 ATITUDES\nDE UM QA\nVALORIZADO"} sub="Não é sobre ferramentas. É sobre clareza."/>
        </DCArtboard>
        <DCArtboard id="c02-s1" label="01 Negócio" width={S} height={S}>
          <ListItem num={1} title={"ENTENDER\nO NEGÓCIO"} body="Não teste só botão, tela e campo. Entenda por que aquilo existe e qual problema resolve."/>
        </DCArtboard>
        <DCArtboard id="c02-s2" label="02 Riscos" width={S} height={S}>
          <ListItemAmber num={2} title={"ANTECIPAR\nRISCOS"} body="Não espere o bug no final. Questione regra, fluxo, exceção e impacto desde o refinamento."/>
        </DCArtboard>
        <DCArtboard id="c02-s3" label="03 Comunicar" width={S} height={S}>
          <ListItem num={3} title={"COMUNICAR\nBEM"} body="Um bug mal explicado vira ruído. Um bug bem explicado vira decisão."/>
        </DCArtboard>
        <DCArtboard id="c02-s4" label="04 Priorizar" width={S} height={S}>
          <ListItemAmber num={4} title={"SABER\nPRIORIZAR"} body="Nem tudo tem o mesmo peso. QA bom diferencia erro visual de risco crítico para o usuário."/>
        </DCArtboard>
        <DCArtboard id="c02-s5" label="05 Melhorar" width={S} height={S}>
          <ListItem num={5} title={"PROPOR\nMELHORIA"} body="Não seja só quem valida. Se percebe problema recorrente no processo, traga sugestão."/>
        </DCArtboard>
        <DCArtboard id="c02-cta" label="CTA" width={S} height={S}>
          <CTALight lines={['GERA','CLAREZA.','GERA','VALOR.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 03. AUTOMAÇÃO É O MENOS IMPORTANTE ──────────── */}
      <DCSection id="c03" title="03 — Por que automação é o menos importante">
        <DCArtboard id="c03-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Hot take" headline={"AUTOMAÇÃO\nÉ O MENOS\nIMPORTANTE"} sub="Não porque não importa. Mas porque não é o objetivo."/>
        </DCArtboard>
        <DCArtboard id="c03-s1" label="Slide 01" width={S} height={S}>
          <SplitH left={"AUTO-\nMAÇÃO\nÉ FERRA-\nMENTA."} right="Não é objetivo. Não é métrica de qualidade. Não é o que define um bom QA."/>
        </DCArtboard>
        <DCArtboard id="c03-s2" label="Slide 02" width={S} height={S}>
          <ChecklistLight heading="Antes de automatizar, saiba:"
            items={['O que vale a pena testar?', 'Qual risco esse teste cobre?', 'Esse fluxo é estável o suficiente?', 'Vai ajudar o time ou só aumentar manutenção?']}/>
        </DCArtboard>
        <DCArtboard id="c03-s3" label="Slide 03" width={S} height={S}>
          <GridCards heading="Antes da automação vem:"
            items={['Análise', 'Estratégia', 'Produto', 'Critérios', 'Priorização', 'Comunicação']}/>
        </DCArtboard>
        <DCArtboard id="c03-s4" label="Slide 04" width={S} height={S}>
          <Quote text="TESTE RUIM AUTOMATIZADO CONTINUA SENDO TESTE RUIM. SÓ RODA MAIS RÁPIDO." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="c03-cta" label="CTA" width={S} height={S}>
          <CTA lines={['ANTES DA','FERRAMENTA:','PENSAMENTO','CRÍTICO.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 04. COISAS MAIS IMPORTANTES QUE AUTOMAÇÃO ───── */}
      <DCSection id="c04" title="04 — Outras coisas mais importantes que automação">
        <DCArtboard id="c04-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="Fundamentos" headline={"MAIS\nIMPORTANTE\nQUE AUTO-\nMAÇÃO"} sub="As habilidades que fazem mais diferença no dia a dia."/>
        </DCArtboard>
        <DCArtboard id="c04-s1" label="Slide 01" width={S} height={S}>
          <ListItemAmber num={1} title={"ENTENDER\nO PRODUTO"} body="Se você não entende o objetivo da funcionalidade, você testa só o óbvio."/>
        </DCArtboard>
        <DCArtboard id="c04-s2" label="Slide 02" width={S} height={S}>
          <ListItem num={2} title={"SABER\nPRIORIZAR"} body="Quando o prazo aperta, nem tudo pode ser testado com a mesma profundidade."/>
        </DCArtboard>
        <DCArtboard id="c04-s3" label="Slide 03" width={S} height={S}>
          <ListItemAmber num={3} title={"COMUNICAR\nRISCO"} body="Não basta dizer que está errado. Você precisa explicar o impacto."/>
        </DCArtboard>
        <DCArtboard id="c04-s4" label="Slide 04" width={S} height={S}>
          <ListItem num={4} title={"QUESTIONAR\nREGRA DE\nNEGÓCIO"} body="Muitos bugs nascem antes do código. Nascem em requisito mal entendido."/>
        </DCArtboard>
        <DCArtboard id="c04-s5" label="Slide 05" width={S} height={S}>
          <ListItemAmber num={5} title={"PENSAR\nCOMO\nUSUÁRIO"} body="O sistema pode estar tecnicamente correto e entregar experiência ruim."/>
        </DCArtboard>
        <DCArtboard id="c04-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['AUTOMAÇÃO','AJUDA.','PENSAMENTO','CRÍTICO','TRANSFORMA.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 05. COMO TESTAR TUDO EM 1 DIA ──────────────── */}
      <DCSection id="c05" title="05 — Como testar tudo em 1 dia?">
        <DCArtboard id="c05-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Prazo curto" headline={"COMO\nTESTAR\nTUDO EM\n1 DIA?"} sub="A resposta mais honesta: você não testa."/>
        </DCArtboard>
        <DCArtboard id="c05-s1" label="Slide 01" width={S} height={S}>
          <Versus topic="A pergunta certa"
            wrong='"Como eu testo tudo?"'
            right='"O que não pode quebrar de jeito nenhum?"'/>
        </DCArtboard>
        <DCArtboard id="c05-s2" label="Slide 02" width={S} height={S}>
          <ChecklistAmber heading="Com pouco tempo, priorize:"
            items={['Fluxos mais usados', 'Impacto financeiro', 'Funcionalidades críticas', 'Alterações recentes', 'Integrações', 'Regras sensíveis', 'Histórico de bugs']}/>
        </DCArtboard>
        <DCArtboard id="c05-s3" label="Slide 03" width={S} height={S}>
          <AmberPointLight headline={"TESTAR\nTUDO É\nILUSÃO."} body="Testar com inteligência é habilidade. Deixe claro quais riscos foram cobertos e quais ficaram de fora."/>
        </DCArtboard>
        <DCArtboard id="c05-cta" label="CTA" width={S} height={S}>
          <CTA lines={['QUALIDADE','TAMBÉM É','SOBRE','TRANSPARÊNCIA.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 06. POR QUE SEMPRE TEMOS 1 DIA ─────────────── */}
      <DCSection id="c06" title="06 — Por que sempre temos apenas 1 dia para testar?">
        <DCArtboard id="c06-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="Processo" headline={"POR QUE\nSEMPRE\nTEMOS\n1 DIA?"} sub='"Consegue testar hoje?" — Alguém, sempre.'/>
        </DCArtboard>
        <DCArtboard id="c06-s1" label="Slide 01" width={S} height={S}>
          <Stacked heading="O que acontece antes:"
            boxes={[
              { label: 'Dev', text: 'O desenvolvimento atrasa.', amber: false, outline: false },
              { label: 'Produto', text: 'O refinamento foi incompleto.', amber: false, outline: false },
              { label: 'Escopo', text: 'A entrega ficou maior que parecia.', amber: false, outline: false },
              { label: 'Resultado', text: '"Consegue testar hoje?"', amber: false, outline: true },
            ]}/>
        </DCArtboard>
        <DCArtboard id="c06-s2" label="Slide 02" width={S} height={S}>
          <SplitH left={"QA\nNÃO É\nGARGALO."} right="Quando QA entra só no final, ele vira gargalo. Quando participa desde o começo, ajuda a evitar retrabalho."/>
        </DCArtboard>
        <DCArtboard id="c06-s3" label="Slide 03" width={S} height={S}>
          <ChecklistAmber heading="Qualidade começa no:"
            items={['Refinamento', 'Na pergunta certa', 'No critério de aceite claro', 'No alinhamento com produto e dev']}/>
        </DCArtboard>
        <DCArtboard id="c06-s4" label="Slide 04" width={S} height={S}>
          <QuoteLight text="O IDEAL NÃO É TER MAIS TEMPO PRA TESTAR NO FINAL. É PRECISAR DE MENOS CORREÇÃO." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="c06-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['O PROBLEMA','NÃO É','PRAZO.','É PROCESSO.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 07. POR QUE SUAS IDEIAS SÃO REJEITADAS ─────── */}
      <DCSection id="c07" title="07 — Por que suas ideias são rejeitadas">
        <DCArtboard id="c07-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Comunicação" headline={"POR QUE\nSUAS IDEIAS\nSÃO REJEI-\nTADAS"} sub="Nem sempre é a ideia. Às vezes é a forma."/>
        </DCArtboard>
        <DCArtboard id="c07-s1" label="Slide 01" width={S} height={S}>
          <AmberPoint headline={"OPINIÃO\nSOLTA NÃO\nCONVENCE."} body="Para uma ideia ser levada a sério, precisa vir com contexto, dado e consequência."/>
        </DCArtboard>
        <DCArtboard id="c07-s2" label="Slide 02" width={S} height={S}>
          <GridCards heading="Sua ideia precisa mostrar:"
            items={['O problema', 'A frequência', 'O impacto', 'Quem afetou', 'Primeiro teste', 'Resultado']}/>
        </DCArtboard>
        <DCArtboard id="c07-s3" label="Slide 03" width={S} height={S}>
          <Versus topic="Na prática"
            wrong='"Vamos melhorar nossos testes."'
            right='"Nas últimas entregas, tivemos retrabalho aqui. Se ajustarmos essa etapa, reduzimos o problema."'/>
        </DCArtboard>
        <DCArtboard id="c07-cta" label="CTA" width={S} height={S}>
          <CTALight lines={['IDEIA BOA','PRECISA DE','NARRATIVA.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 08. APRENDA A IMPLEMENTAR SUAS IDEIAS ───────── */}
      <DCSection id="c08" title="08 — Aprenda a implementar suas ideias como QA">
        <DCArtboard id="c08-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="Ação" headline={"IMPLEMENTE\nSUAS\nIDEIAS"} sub="Ter boas ideias é importante. Saber implementar é o que faz crescer."/>
        </DCArtboard>
        <DCArtboard id="c08-s1" label="Slide 01" width={S} height={S}>
          <ListItem num={1} title={"IDENTIFIQUE\nO PROBLEMA"} body="Olhe para bugs repetidos, processos confusos, critérios mal definidos."/>
        </DCArtboard>
        <DCArtboard id="c08-s2" label="Slide 02" width={S} height={S}>
          <ListItemAmber num={2} title={"COLETE\nEXEMPLOS\nREAIS"} body="Dados concretos. Sprints, tickets, impactos. Sem achismo."/>
        </DCArtboard>
        <DCArtboard id="c08-s3" label="Slide 03" width={S} height={S}>
          <ListItem num={3} title={"PROPONHA\nMUDANÇA\nPEQUENA"} body="Não tente transformar o processo inteiro. Comece por um checklist, uma conversa, um padrão."/>
        </DCArtboard>
        <DCArtboard id="c08-s4" label="Slide 04" width={S} height={S}>
          <ListItemAmber num={4} title={"TESTE E\nCOMPARTILHE"} body="Rode por um período. Mostre antes e depois. Resultado fala mais que opinião."/>
        </DCArtboard>
        <DCArtboard id="c08-cta" label="CTA" width={S} height={S}>
          <CTA lines={['QA QUE','IMPLEMENTA','IDEIAS VIRA','REFERÊNCIA.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 09. 5 MOTIVOS QUE TE VÊEM COMO EXECUTOR ────── */}
      <DCSection id="c09" title="09 — 5 motivos que te vêem como executor">
        <DCArtboard id="c09-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="Auto-crítica" headline={"POR QUE\nTE VÊEM\nCOMO\nEXECUTOR"} sub="Às vezes o QA reclama que não é ouvido. Mas olha pra própria postura."/>
        </DCArtboard>
        <DCArtboard id="c09-s1" label="01" width={S} height={S}>
          <ListItemAmber num={1} title={"SÓ ESPERA\nA TAREFA\nCHEGAR"} body="Não participa antes, não questiona, não antecipa nenhum risco."/>
        </DCArtboard>
        <DCArtboard id="c09-s2" label="02" width={S} height={S}>
          <ListItem num={2} title={"SÓ SEGUE\nROTEIRO"} body="Não investiga, não explora, não conecta cenários entre funcionalidades."/>
        </DCArtboard>
        <DCArtboard id="c09-s3" label="03" width={S} height={S}>
          <ListItemAmber num={3} title={"REPORTA\nSEM\nCONTEXTO"} body="Aponta o erro, mas não explica impacto no negócio ou no usuário."/>
        </DCArtboard>
        <DCArtboard id="c09-s4" label="04" width={S} height={S}>
          <ListItem num={4} title={"NÃO\nENTENDE O\nPRODUTO"} body="Testa a funcionalidade, mas não entende o motivo dela existir."/>
        </DCArtboard>
        <DCArtboard id="c09-s5" label="05" width={S} height={S}>
          <ListItemAmber num={5} title={"NÃO PROPÕE\nMELHORIA"} body="Percebe problemas no processo, mas só comenta nos bastidores."/>
        </DCArtboard>
        <DCArtboard id="c09-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['EXECUTOR','É POSTURA.','NÃO É','CARGO.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 10. POR QUE O QA VÊ O QUE NINGUÉM VÊ ────────── */}
      <DCSection id="c10" title="10 — Por que o QA vê o que ninguém vê">
        <DCArtboard id="c10-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Visão QA" headline={"O QA VÊ\nO QUE\nNINGUÉM\nVÊ"} sub="Enquanto todos estão no happy path, o QA pergunta: e se?"/>
        </DCArtboard>
        <DCArtboard id="c10-s1" label="Slide 01" width={S} height={S}>
          <Stacked heading="O QA pergunta:"
            boxes={[
              { label: 'Usuário', text: '"E se o usuário fizer diferente?"', amber: false, outline: false },
              { label: 'Dados', text: '"E se esse dado vier vazio?"', amber: false, outline: false },
              { label: 'Integração', text: '"E se essa integração falhar?"', amber: false, outline: true },
            ]}/>
        </DCArtboard>
        <DCArtboard id="c10-s2" label="Slide 02" width={S} height={S}>
          <GridCards heading="Um bom QA procura:"
            items={['Pontos cegos', 'Inconsistências', 'Impacto escondido', 'Riscos futuros', 'Edge cases', 'Exceções']}/>
        </DCArtboard>
        <DCArtboard id="c10-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="O VALOR DO QA ESTÁ MENOS EM CLICAR NA TELA E MAIS EM ENXERGAR RISCO ONDE NINGUÉM OLHAVA." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="c10-cta" label="CTA" width={S} height={S}>
          <CTA lines={['TREINADO','PARA','DESCONFIAR','DO ÓBVIO.']}/>
        </DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
