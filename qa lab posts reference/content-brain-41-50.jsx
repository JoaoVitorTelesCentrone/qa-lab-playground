/* ── QALabBrain Carrosséis 41–50 — TIPO 7: Provocação + TIPO 8: Reframe ── */
const { DesignCanvas, DCSection, DCArtboard } = window;

function App() {
  return (
    <DesignCanvas>

      {/* ── 41. 'ÁGIL NÃO PRECISA DE QA' ────────────────── */}
      <DCSection id="b41" title="41 — 'Somos ágeis, não precisamos de QA'">
        <DCArtboard id="b41-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="Identidade QA" headline={"'ÁGIL NÃO\nPRECISA DE\nQA'"} sub="Essa frase já te incomodou. Vamos desmontar o raciocínio por trás dela."/>
        </DCArtboard>
        <DCArtboard id="b41-s1" label="Slide 01" width={S} height={S}>
          <AmberPointLight headline={"ÁGIL NÃO\nTIROU A\nQUALIDADE.\nDISTRIBUIU."} body="O manifesto nunca disse 'menos teste'. Disse qualidade contínua, de todos, o tempo todo."/>
        </DCArtboard>
        <DCArtboard id="b41-s2" label="Slide 02" width={S} height={S}>
          <Versus topic="O que confundem"
            wrong='"Sem QA dedicado = mais ágil."'
            right='"Qualidade incorporada ≠ qualidade ignorada."'/>
        </DCArtboard>
        <DCArtboard id="b41-s3" label="Slide 03" width={S} height={S}>
          <Quote text="TIRAR O QA EM NOME DA AGILIDADE NÃO ACELERA NADA. SÓ MOVE O BUG PRA MAIS PERTO DO USUÁRIO." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b41-cta" label="CTA" width={S} height={S}>
          <CTAMinimal lines={['ÁGIL PEDE','MAIS','QUALIDADE.','NÃO MENOS.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 42. BLOQUEAR RELEASE NÃO É HEROÍSMO ──────────── */}
      <DCSection id="b42" title="42 — QA que bloqueia release não é herói">
        <DCArtboard id="b42-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Opinião" headline={"BLOQUEAR\nRELEASE NÃO\nÉ HEROÍSMO"} sub="Bloquear o deploy parece responsabilidade. Às vezes é só medo disfarçado de rigor."/>
        </DCArtboard>
        <DCArtboard id="b42-s1" label="Slide 01" width={S} height={S}>
          <AmberPoint headline={"O HERÓI NÃO\nÉ QUEM\nTRAVA. É\nQUEM DÁ\nCLAREZA."} body="Bloquear sem dado vira poder de veto. O papel do QA é informar o risco, não decidir sozinho pelo medo."/>
        </DCArtboard>
        <DCArtboard id="b42-s2" label="Slide 02" width={S} height={S}>
          <Versus topic="A diferença"
            wrong='"Não vai subir enquanto eu não aprovar."'
            right='"O risco de subir assim é esse. A decisão é do time, com a informação na mesa."'/>
        </DCArtboard>
        <DCArtboard id="b42-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="QA MADURO NÃO É O DONO DO BOTÃO DE BLOQUEIO. É O DONO DA CLAREZA SOBRE O RISCO." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b42-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['INFORME O','RISCO.','NÃO USE O','MEDO COMO','PODER.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 43. ZERO BUGS É UMA META RUIM ───────────────── */}
      <DCSection id="b43" title="43 — Zero bugs em produção é meta ruim">
        <DCArtboard id="b43-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="Opinião" headline={"ZERO BUGS\nÉ UMA META\nRUIM"} sub="Toda empresa quer essa meta. Ela está olhando pro número errado."/>
        </DCArtboard>
        <DCArtboard id="b43-s1" label="Slide 01" width={S} height={S}>
          <AmberPointLight headline={"ZERO BUG\nESCONDE\nMEDO DE\nENTREGAR."} body="Buscar zero defeito leva a release lento, a evitar risco e a esconder falha. Não a qualidade."/>
        </DCArtboard>
        <DCArtboard id="b43-s2" label="Slide 02" width={S} height={S}>
          <CompareTable rows={[
            ['Meta: zero bugs', 'Meta: zero falha crítica'],
            ['Mede defeitos', 'Mede impacto'],
            ['Trava entrega', 'Controla risco'],
          ]}/>
        </DCArtboard>
        <DCArtboard id="b43-s3" label="Slide 03" width={S} height={S}>
          <Quote text="O OBJETIVO NÃO É NUNCA FALHAR. É FALHAR PEQUENO, CEDO E COM PLANO DE RECUPERAÇÃO." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b43-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['MIRE EM','RISCO','CONTROLADO.','NÃO EM','PERFEIÇÃO.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 44. COBERTURA É MÉTRICA DE VAIDADE ───────────── */}
      <DCSection id="b44" title="44 — Cobertura é a métrica de vaidade do QA">
        <DCArtboard id="b44-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="Opinião" headline={"COBERTURA É\nMÉTRICA DE\nVAIDADE"} sub="Você comemorou 95% de cobertura. O cliente não comemorou nada."/>
        </DCArtboard>
        <DCArtboard id="b44-s1" label="Slide 01" width={S} height={S}>
          <BigStat number="95" unit="%" caption="de cobertura impressiona em reunião. Não diz nada sobre o risco que de fato foi protegido."/>
        </DCArtboard>
        <DCArtboard id="b44-s2" label="Slide 02" width={S} height={S}>
          <AmberPoint headline={"O NÚMERO\nSOBE. O\nRISCO\nCONTINUA."} body="Dá pra ter 95% cobrindo o trivial e 0% no fluxo que paga a empresa."/>
        </DCArtboard>
        <DCArtboard id="b44-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="COBERTURA É O QUE VOCÊ MOSTRA PRO CHEFE. RISCO COBERTO É O QUE PROTEGE O USUÁRIO." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b44-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['MEÇA RISCO','COBERTO.','NÃO LINHA','EXECUTADA.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 45. GENERALISTA VENCE ESPECIALISTA EM TOOL ──── */}
      <DCSection id="b45" title="45 — Generalista sobrevive melhor que especialista">
        <DCArtboard id="b45-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Opinião" headline={"GENERALISTA\nVENCE O\nESPECIALISTA\nEM TOOL"} sub="Você dominou uma ferramenta. A ferramenta vai mudar antes da sua carreira."/>
        </DCArtboard>
        <DCArtboard id="b45-s1" label="Slide 01" width={S} height={S}>
          <AmberPointLight headline={"FERRAMENTA\nÉ MEIO.\nRACIOCÍNIO\nÉ CARREIRA."} body="Quem só domina uma tool fica refém dela. Quem entende risco e produto migra pra qualquer stack."/>
        </DCArtboard>
        <DCArtboard id="b45-s2" label="Slide 02" width={S} height={S}>
          <CompareTable rows={[
            ['Especialista numa tool', 'Domina o raciocínio de QA'],
            ['Ferramenta muda, ele zera', 'Stack muda, ele adapta'],
            ['Profundidade frágil', 'Base transferível'],
          ]}/>
        </DCArtboard>
        <DCArtboard id="b45-s3" label="Slide 03" width={S} height={S}>
          <Quote text="A FERRAMENTA DE HOJE É A LEGADA DE AMANHÃ. O PENSAMENTO CRÍTICO NÃO TEM DEPRECIAÇÃO." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b45-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['APRENDA A','FERRAMENTA.','DOMINE O','RACIOCÍNIO.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 46. TERCEIRIZAR QA É SINTOMA, NÃO CAUSA ──────── */}
      <DCSection id="b46" title="46 — Terceirizar QA é sintoma de outro problema">
        <DCArtboard id="b46-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="Comunidade" headline={"TERCEIRIZAR\nQA É SINTOMA,\nNÃO CAUSA"} sub="A empresa cortou QA interno. O motivo real não está no orçamento."/>
        </DCArtboard>
        <DCArtboard id="b46-s1" label="Slide 01" width={S} height={S}>
          <AmberPoint headline={"NINGUÉM\nCORTA O QUE\nVÊ COMO\nESTRATÉGICO."} body="Quando QA vira custo terceirizável, o problema é anterior: o valor nunca ficou visível pra liderança."/>
        </DCArtboard>
        <DCArtboard id="b46-s2" label="Slide 02" width={S} height={S}>
          <Stacked heading="O que o corte revela:"
            boxes={[
              { label: 'Percepção', text: 'QA foi visto como execução, não estratégia.', amber: false },
              { label: 'Visibilidade', text: 'O impacto nunca foi comunicado em números.', amber: false },
              { label: 'Posição', text: 'Entrou tarde, virou gargalo, virou custo.', amber: true },
            ]}/>
        </DCArtboard>
        <DCArtboard id="b46-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="A TERCEIRIZAÇÃO NÃO MATA O QA. ELA REVELA QUE O VALOR DELE JÁ TINHA SIDO ESQUECIDO ANTES." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b46-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['QA','ESTRATÉGICO','NÃO VIRA','LINHA DE','CORTE.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 47. 'TESTEI E FUNCIONOU' ────────────────────── */}
      <DCSection id="b47" title="47 — 'Testei e funcionou' é a frase mais perigosa">
        <DCArtboard id="b47-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Reframe" headline={'"TESTEI E\nFUNCIONOU"'} sub="Essa frase passou despercebida por anos. Ela esconde um erro de raciocínio."/>
        </DCArtboard>
        <DCArtboard id="b47-s1" label="Slide 01" width={S} height={S}>
          <Versus topic="A mesma situação"
            wrong='"Testei e funcionou."'
            right='"Testei o caminho X com o dado Y. Não cobri Z nem o cenário de erro."'/>
        </DCArtboard>
        <DCArtboard id="b47-s2" label="Slide 02" width={S} height={S}>
          <AmberPointLight headline={"'FUNCIONOU'\nNÃO DIZ O\nQUE FICOU\nDE FORA."} body="Funcionou pra qual usuário? Qual dado? Qual cenário de erro? 'Funcionou' esconde o não testado."/>
        </DCArtboard>
        <DCArtboard id="b47-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="O TESTE NÃO PROVA QUE FUNCIONA. MOSTRA QUE, NAQUELAS CONDIÇÕES, NÃO FALHOU." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b47-cta" label="CTA" width={S} height={S}>
          <CTA lines={['DIGA O QUE','TESTOU.','E O QUE','FICOU FORA.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 48. QUALIDADE NÃO É FASE, É DECISÃO ──────────── */}
      <DCSection id="b48" title="48 — Qualidade é decisão antes do código existir">
        <DCArtboard id="b48-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="Reframe" headline={"QUALIDADE\nNÃO É FASE.\nÉ DECISÃO."} sub="Você foi chamado quando o código já estava pronto. O problema começou antes disso."/>
        </DCArtboard>
        <DCArtboard id="b48-s1" label="Slide 01" width={S} height={S}>
          <SplitH left={"QUA-\nLIDADE\nNÃO É\nETAPA\nFINAL."} right="Quando vira fase, ela compete com o prazo. Quando vira decisão, ela molda o que é construído."/>
        </DCArtboard>
        <DCArtboard id="b48-s2" label="Slide 02" width={S} height={S}>
          <Stacked heading="A qualidade se decide em:"
            boxes={[
              { label: 'Refinamento', text: 'Critério claro, risco mapeado', amber: false },
              { label: 'Design', text: 'Estados de erro e vazio pensados', amber: false },
              { label: 'Código', text: 'Testabilidade desde o início', amber: false },
              { label: 'Teste', text: 'Confirmação, não descoberta tardia', amber: true },
            ]}/>
        </DCArtboard>
        <DCArtboard id="b48-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="QUALIDADE NÃO É O QUE VOCÊ INSPECIONA NO FIM. É O QUE VOCÊ DECIDE ANTES DA PRIMEIRA LINHA." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b48-cta" label="CTA" width={S} height={S}>
          <CTALight lines={['DECIDA','QUALIDADE','ANTES DO','CÓDIGO.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 49. 'NÃO DÁ TEMPO DE TESTAR TUDO' ────────────── */}
      <DCSection id="b49" title="49 — 'Não dá tempo de testar tudo' é diagnóstico">
        <DCArtboard id="b49-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="Reframe" headline={"'NÃO DÁ\nTEMPO DE\nTESTAR TUDO'"} sub="Você ouve essa frase como fraqueza. Ela é, na verdade, informação valiosa."/>
        </DCArtboard>
        <DCArtboard id="b49-s1" label="Slide 01" width={S} height={S}>
          <AmberPoint headline={"NÃO É\nDESCULPA.\nÉ UM DADO\nDO PRO-\nCESSO."} body="Se nunca dá tempo, o problema não é o QA lento. É o teste entrando tarde demais no fluxo."/>
        </DCArtboard>
        <DCArtboard id="b49-s2" label="Slide 02" width={S} height={S}>
          <Versus topic="Como usar a frase"
            wrong='"Desculpa, não testei tudo."'
            right='"Cobri os 3 riscos críticos. Esses 2 ficaram fora por prazo. Aceita?"'/>
        </DCArtboard>
        <DCArtboard id="b49-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="'NÃO DÁ TEMPO DE TESTAR TUDO' NÃO PEDE DESCULPA. PEDE PRIORIZAÇÃO E DECISÃO COMPARTILHADA." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b49-cta" label="CTA" width={S} height={S}>
          <CTA lines={['TRANSFORME','FALTA DE','TEMPO EM','PRIORIDADE.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 50. A IA NÃO TIRA O SEU LUGAR ────────────────── */}
      <DCSection id="b50" title="50 — IA tira o lugar de quem só executa">
        <DCArtboard id="b50-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Reframe" headline={"A IA NÃO\nTIRA O SEU\nLUGAR"} sub="O medo é real. O alvo do medo está errado."/>
        </DCArtboard>
        <DCArtboard id="b50-s1" label="Slide 01" width={S} height={S}>
          <AmberPointLight headline={"A IA SUBSTITUI\nEXECUÇÃO.\nNÃO\nJULGAMENTO."} body="Quem só roda roteiro compete com a máquina. Quem decide o que importa usa a máquina."/>
        </DCArtboard>
        <DCArtboard id="b50-s2" label="Slide 02" width={S} height={S}>
          <CompareTable rows={[
            ['Só executa o roteiro', 'Decide qual risco testar'],
            ['Reporta o que achou', 'Interpreta o impacto'],
            ['Substituível', 'Insubstituível'],
          ]}/>
        </DCArtboard>
        <DCArtboard id="b50-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="A IA NÃO AMEAÇA O QA QUE PENSA. AMEAÇA A TAREFA QUE NUNCA PRECISOU DE PENSAMENTO." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b50-cta" label="CTA" width={S} height={S}>
          <CTA lines={['DEIXE DE','SÓ EXECUTAR.','COMECE A','DECIDIR.']}/>
        </DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
