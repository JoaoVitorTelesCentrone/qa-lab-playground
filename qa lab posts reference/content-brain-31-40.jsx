/* ── QALabBrain Carrosséis 31–40 — TIPO 5: Dados + TIPO 6: Identidade ── */
const { DesignCanvas, DCSection, DCArtboard } = window;

function App() {
  return (
    <DesignCanvas>

      {/* ── 31. 82% AINDA TESTAM NA MÃO ─────────────────── */}
      <DCSection id="b31" title="31 — 82% ainda fazem teste manual">
        <DCArtboard id="b31-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Dados" headline={"82% AINDA\nTESTAM NA\nMÃO"} sub="Te disseram que teste manual é coisa do passado. Os números discordam."/>
        </DCArtboard>
        <DCArtboard id="b31-s1" label="Slide 01" width={S} height={S}>
          <BigStat number="82" unit="%" caption="dos QAs ainda fazem teste manual no dia a dia, segundo pesquisas recentes da área."/>
        </DCArtboard>
        <DCArtboard id="b31-s2" label="Slide 02" width={S} height={S}>
          <AmberPoint headline={"NÃO É\nATRASO. É A\nNATUREZA\nDO TRABALHO."} body="Exploratório, usabilidade e contexto de negócio não se automatizam de verdade. Dependem de julgamento."/>
        </DCArtboard>
        <DCArtboard id="b31-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="O DADO NÃO DIZ QUE O MANUAL RESISTE POR PREGUIÇA. DIZ QUE ELE COBRE O QUE A MÁQUINA NÃO ALCANÇA." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b31-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['MANUAL E','AUTOMAÇÃO.','NÃO UM','CONTRA O','OUTRO.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 32. A SKILL Nº 1 NÃO É TÉCNICA ──────────────── */}
      <DCSection id="b32" title="32 — A skill nº 1 em QA não é técnica">
        <DCArtboard id="b32-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="Dados" headline={"A SKILL Nº 1\nNÃO É\nTÉCNICA"} sub="Você investiu em mais uma ferramenta. Devia ter investido em outra coisa."/>
        </DCArtboard>
        <DCArtboard id="b32-s1" label="Slide 01" width={S} height={S}>
          <AmberPointLight headline={"COMUNICAÇÃO\nLIDERA HÁ\nANOS."} body="Pesquisa após pesquisa, a habilidade mais valorizada em QA não é uma ferramenta. É saber comunicar risco."/>
        </DCArtboard>
        <DCArtboard id="b32-s2" label="Slide 02" width={S} height={S}>
          <GridCards heading="O que diferencia na prática:"
            items={['Explicar impacto', 'Negociar prazo', 'Traduzir o técnico', 'Influenciar decisão', 'Fazer a pergunta certa', 'Documentar com clareza']}/>
        </DCArtboard>
        <DCArtboard id="b32-s3" label="Slide 03" width={S} height={S}>
          <Quote text="FERRAMENTA QUALQUER UM APRENDE. COMUNICAR RISCO DE FORMA QUE O TIME AGE É O QUE TE TORNA RARO." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b32-cta" label="CTA" width={S} height={S}>
          <CTA lines={['INVISTA NA','SKILL QUE','NENHUM UPDATE','SUBSTITUI.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 33. O QUE OS DADOS DIZEM SOBRE PRAZO ─────────── */}
      <DCSection id="b33" title="33 — O que os dados dizem sobre tempo de teste">
        <DCArtboard id="b33-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="Dados" headline={"O QUE OS\nDADOS DIZEM\nSOBRE PRAZO"} sub="Mais da metade dos QAs dizem a mesma frase sobre prazo. E não é coincidência."/>
        </DCArtboard>
        <DCArtboard id="b33-s1" label="Slide 01" width={S} height={S}>
          <BigStat number="+50" unit="%" caption="dos QAs apontam falta de tempo como a maior barreira pra qualidade. O gargalo raramente é skill. É processo."/>
        </DCArtboard>
        <DCArtboard id="b33-s2" label="Slide 02" width={S} height={S}>
          <SplitH left={"FALTA\nDE\nTEMPO\nÉ SIN-\nTOMA."} right="Quando QA entra só no fim, todo prazo é curto. O problema não é velocidade. É o momento de entrar."/>
        </DCArtboard>
        <DCArtboard id="b33-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="O DADO NÃO PEDE QA MAIS RÁPIDO. PEDE QA MAIS CEDO NO PROCESSO." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b33-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['O PROBLEMA','NÃO É O','RELÓGIO.','É O','PROCESSO.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 34. QUANTOS QAs JÁ USAM IA DE VERDADE ────────── */}
      <DCSection id="b34" title="34 — Quantos QAs já usam IA no dia a dia">
        <DCArtboard id="b34-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Dados" headline={"QUANTOS QAs\nJÁ USAM IA\nDE VERDADE"} sub="O número é maior do que você imagina. E menor do que o hype sugere."/>
        </DCArtboard>
        <DCArtboard id="b34-s1" label="Slide 01" width={S} height={S}>
          <Insight statement={"A ADOÇÃO\nCRESCE\nRÁPIDO.\nA MATURIDADE,\nNEM TANTO."} sub="Muitos QAs já experimentaram IA. Poucos têm processo pra usar com critério."/>
        </DCArtboard>
        <DCArtboard id="b34-s2" label="Slide 02" width={S} height={S}>
          <CompareTable rows={[
            ['Já experimentou IA', 'Usa com processo definido'],
            ['Gera caso de teste', 'Valida o que a IA gerou'],
            ['Hype', 'Resultado'],
          ]}/>
        </DCArtboard>
        <DCArtboard id="b34-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="USAR IA UMA VEZ É CURIOSIDADE. USAR COM CRITÉRIO, TODO DIA, É COMPETÊNCIA." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b34-cta" label="CTA" width={S} height={S}>
          <CTA lines={['NÃO É SOBRE','USAR IA.','É SOBRE','USAR BEM.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 35. SCRIPTS QUE NINGUÉM MANTÉM ──────────────── */}
      <DCSection id="b35" title="35 — O que os dados dizem sobre scripts abandonados">
        <DCArtboard id="b35-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="Dados" headline={"SCRIPTS QUE\nNINGUÉM\nMANTÉM"} sub="A maioria automatiza. Poucos sustentam o que automatizaram."/>
        </DCArtboard>
        <DCArtboard id="b35-s1" label="Slide 01" width={S} height={S}>
          <AmberPoint headline={"AUTOMA-\nTIZAR É O\nCOMEÇO.\nMANTER É O\nCUSTO."} body="A conta da automação não chega na escrita. Chega na manutenção que ninguém planejou."/>
        </DCArtboard>
        <DCArtboard id="b35-s2" label="Slide 02" width={S} height={S}>
          <GridCards heading="Por que o script morre:"
            items={['Sem dono claro', 'Seletor frágil', 'Flaky ignorado', 'Fora do pipeline', 'Sem documentação', 'Sem review']}/>
        </DCArtboard>
        <DCArtboard id="b35-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="SUÍTE ABANDONADA NÃO É COBERTURA. É UM MUSEU DE INTENÇÕES VERDES." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b35-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['AUTOMAÇÃO','SEM DONO','É DÍVIDA,','NÃO ATIVO.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 36. NINGUÉM APLAUDE O INCÊNDIO QUE NÃO HOUVE ── */}
      <DCSection id="b36" title="36 — Ninguém aplaude o incêndio que não houve">
        <DCArtboard id="b36-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Identidade QA" headline={"NINGUÉM\nAPLAUDE O\nINCÊNDIO\nQUE NÃO\nHOUVE"} sub="Seu maior trabalho é invisível. E isso tem um preço emocional."/>
        </DCArtboard>
        <DCArtboard id="b36-s1" label="Slide 01" width={S} height={S}>
          <AmberPoint headline={"O BUG QUE\nVOCÊ EVITOU\nNÃO VIRA\nHISTÓRIA."} body="Ninguém comemora o problema que não chegou ao usuário. Mas foi você que o segurou."/>
        </DCArtboard>
        <DCArtboard id="b36-s2" label="Slide 02" width={S} height={S}>
          <SplitH left={"PRE-\nVENÇÃO\nÉ INVI-\nSÍVEL\nPOR\nDEFI-\nNIÇÃO."} right="O QA bom faz o caos não acontecer. E o que não acontece, ninguém vê."/>
        </DCArtboard>
        <DCArtboard id="b36-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="O VALOR DO QA NÃO ESTÁ NO INCÊNDIO APAGADO. ESTÁ NO QUE NUNCA QUEIMOU." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b36-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['SEU TRABALHO','APARECE NA','AUSÊNCIA DO','PROBLEMA.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 37. VOCÊ NÃO É DONO DE TODO BUG ──────────────── */}
      <DCSection id="b37" title="37 — Você não é responsável por todos os bugs">
        <DCArtboard id="b37-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="Identidade QA" headline={"VOCÊ NÃO É\nDONO DE\nTODO BUG"} sub="Um bug escapou. Você carregou a culpa por uma semana. Vamos conversar sobre isso."/>
        </DCArtboard>
        <DCArtboard id="b37-s1" label="Slide 01" width={S} height={S}>
          <Stacked heading="Quem também responde:"
            boxes={[
              { label: 'Produto', text: 'Definiu o requisito', amber: false },
              { label: 'Dev', text: 'Escreveu o código', amber: false },
              { label: 'Liderança', text: 'Cortou o tempo de teste', amber: false },
              { label: 'QA', text: 'Um elo. Não o único.', amber: true },
            ]}/>
        </DCArtboard>
        <DCArtboard id="b37-s2" label="Slide 02" width={S} height={S}>
          <AmberPointLight headline={"CARREGAR\nTUDO SOZINHO\nNÃO É\nRESPONSA-\nBILIDADE."} body="É um peso que o processo te empurrou. Qualidade é do time inteiro, não só de quem testa por último."/>
        </DCArtboard>
        <DCArtboard id="b37-s3" label="Slide 03" width={S} height={S}>
          <Quote text="VOCÊ É RESPONSÁVEL POR APONTAR O RISCO. NÃO POR CARREGAR SOZINHO A DECISÃO DE TODO MUNDO." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b37-cta" label="CTA" width={S} height={S}>
          <CTAMinimal lines={['DIVIDA O','PESO.','ELE NUNCA','FOI SÓ SEU.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 38. O CANSAÇO DE PROVAR VALOR DE NOVO ────────── */}
      <DCSection id="b38" title="38 — O cansaço de provar valor toda sprint">
        <DCArtboard id="b38-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="Identidade QA" headline={"O CANSAÇO\nDE PROVAR\nVALOR DE\nNOVO"} sub="Você já provou isso mês passado. E vai precisar provar de novo essa semana."/>
        </DCArtboard>
        <DCArtboard id="b38-s1" label="Slide 01" width={S} height={S}>
          <AmberPoint headline={"PROVAR\nVALOR NÃO\nDEVERIA SER\nUM LOOP\nINFINITO."} body="Quando o trabalho é invisível, cada sprint começa do zero. E isso desgasta."/>
        </DCArtboard>
        <DCArtboard id="b38-s2" label="Slide 02" width={S} height={S}>
          <SplitH left={"O CAN-\nSAÇO É\nREAL.\nE NÃO\nÉ FRA-\nQUEZA."} right="Sentir esse peso não te faz menos profissional. Faz de você alguém que carrega valor que ninguém registra."/>
        </DCArtboard>
        <DCArtboard id="b38-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="QUEM PRECISA PROVAR VALOR TODA SEMANA NÃO TEM FALTA DE VALOR. TEM FALTA DE REGISTRO." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b38-cta" label="CTA" width={S} height={S}>
          <CTAMinimal lines={['DOCUMENTE','SEU IMPACTO.','PARE DE','RECOMEÇAR.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 39. O ÚLTIMO A SABER, O PRIMEIRO A SER COBRADO ── */}
      <DCSection id="b39" title="39 — QA é o último a saber e o primeiro a ser cobrado">
        <DCArtboard id="b39-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Identidade QA" headline={"O ÚLTIMO A\nSABER. O\nPRIMEIRO A\nSER COBRADO."} sub="A mudança chegou tarde até você. O prazo continuou o mesmo."/>
        </DCArtboard>
        <DCArtboard id="b39-s1" label="Slide 01" width={S} height={S}>
          <Stacked heading="A sequência de sempre:"
            boxes={[
              { label: 'Escopo', text: 'Mudou na metade da sprint.', amber: false },
              { label: 'Aviso', text: 'Chegou ao QA por último.', amber: false },
              { label: 'Prazo', text: 'Continuou o mesmo.', amber: false },
              { label: 'Cobrança', text: 'Veio primeiro pra você.', amber: true },
            ]}/>
        </DCArtboard>
        <DCArtboard id="b39-s2" label="Slide 02" width={S} height={S}>
          <AmberPointLight headline={"INFORMAÇÃO\nTARDE + PRAZO\nIGUAL = PRESSÃO\nINJUSTA."} body="Não é desorganização sua. É um fluxo que coloca o QA no fim e cobra como se estivesse no começo."/>
        </DCArtboard>
        <DCArtboard id="b39-s3" label="Slide 03" width={S} height={S}>
          <Quote text="QA NÃO PRECISA DE MAIS ESFORÇO. PRECISA DE ENTRAR NA CONVERSA NA MESMA HORA QUE OS OUTROS." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b39-cta" label="CTA" width={S} height={S}>
          <CTAMinimal lines={['ENTRE CEDO.','EXIJA O','MESMO AVISO','QUE O TIME.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 40. IMPOSTOR POR NÃO VIR DO CÓDIGO ───────────── */}
      <DCSection id="b40" title="40 — Síndrome do impostor de quem não é dev">
        <DCArtboard id="b40-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="Identidade QA" headline={"IMPOSTOR\nPOR NÃO\nVIR DO\nCÓDIGO"} sub="Todo mundo no time parece saber mais código que você. Isso não te desqualifica."/>
        </DCArtboard>
        <DCArtboard id="b40-s1" label="Slide 01" width={S} height={S}>
          <AmberPoint headline={"QA NÃO É\nDEV QUE\nDEU ERRADO."} body="É uma disciplina própria: risco, produto, usuário, comunicação. Código é uma ferramenta, não o requisito."/>
        </DCArtboard>
        <DCArtboard id="b40-s2" label="Slide 02" width={S} height={S}>
          <GridCards heading="O que você já traz:"
            items={['Visão de risco', 'Olhar de usuário', 'Pensamento crítico', 'Contexto de negócio', 'Comunicação', 'Atenção ao detalhe']}/>
        </DCArtboard>
        <DCArtboard id="b40-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="VOCÊ NÃO ESTÁ ATRÁS DOS DEVS. VOCÊ OLHA PRA UM LUGAR QUE ELES NÃO OLHAM." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b40-cta" label="CTA" width={S} height={S}>
          <CTAMinimal lines={['SEU OLHAR','TEM VALOR.','MESMO SEM','VIR DO CÓDIGO.']}/>
        </DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
