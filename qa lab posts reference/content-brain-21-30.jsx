/* ── QALabBrain Carrosséis 21–30 — TIPO 3: Erros + TIPO 4: Estudo de caso ── */
const { DesignCanvas, DCSection, DCArtboard } = window;

function App() {
  return (
    <DesignCanvas>

      {/* ── 21. 3 HÁBITOS QUE TRAVAM O QA PLENO ─────────── */}
      <DCSection id="b21" title="21 — 3 hábitos que travam o QA pleno">
        <DCArtboard id="b21-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="Carreira QA" headline={"3 HÁBITOS\nQUE TRAVAM\nO QA PLENO"} sub="Nenhum desses hábitos é incompetência. São hábitos que ninguém questiona."/>
        </DCArtboard>
        <DCArtboard id="b21-s1" label="01" width={S} height={S}>
          <ListItemAmber num={1} title={"ESPERAR\nA TAREFA\nCHEGAR"} body="QA que só reage nunca aparece. Quem antecipa risco vira referência."/>
        </DCArtboard>
        <DCArtboard id="b21-s2" label="02" width={S} height={S}>
          <ListItem num={2} title={"NÃO\nMOSTRAR\nIMPACTO"} body="Trabalha muito, comunica pouco. Ninguém promove o que não consegue enxergar."/>
        </DCArtboard>
        <DCArtboard id="b21-s3" label="03" width={S} height={S}>
          <ListItemAmber num={3} title={"PARAR DE\nVER O\nCONTEXTO"} body="Dominar a ferramenta e ignorar o negócio te deixa ótimo no operacional e invisível na estratégia."/>
        </DCArtboard>
        <DCArtboard id="b21-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['SÊNIOR NÃO','É TEMPO','DE CASA.','É POSTURA.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 22. 5 PERGUNTAS QUE FALTAM NO REFINAMENTO ───── */}
      <DCSection id="b22" title="22 — 5 perguntas que faltam no refinamento">
        <DCArtboard id="b22-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="QA no Ágil" headline={"5 PERGUNTAS\nQUE FALTAM NO\nREFINAMENTO"} sub="O refinamento acabou. Você descobre o problema 2 sprints depois."/>
        </DCArtboard>
        <DCArtboard id="b22-s1" label="01" width={S} height={S}>
          <ListItem num={1} title={"E SE VIER\nVAZIO?"} body="Campo opcional, lista sem item, resposta nula. O caminho vazio quase nunca é especificado."/>
        </DCArtboard>
        <DCArtboard id="b22-s2" label="02" width={S} height={S}>
          <ListItemAmber num={2} title={"QUAL O\nCOMPOR-\nTAMENTO\nNO ERRO?"} body="Todo mundo desenha o sucesso. Quase ninguém define o que acontece quando falha."/>
        </DCArtboard>
        <DCArtboard id="b22-s3" label="03" width={S} height={S}>
          <ListItem num={3} title={"QUEM É O\nUSUÁRIO\nDISSO?"} body="O perfil muda o risco. Admin e cliente final não testam igual."/>
        </DCArtboard>
        <DCArtboard id="b22-s4" label="04" width={S} height={S}>
          <ListItemAmber num={4} title={"TEM\nLIMITE\nAQUI?"} body="Valor máximo, tamanho de arquivo, caracteres. Limite não dito é bug garantido."/>
        </DCArtboard>
        <DCArtboard id="b22-s5" label="05" width={S} height={S}>
          <ListItem num={5} title={"COMO A\nGENTE SABE\nSE QUEBROU?"} body="Tem log? Tem alerta? Se ninguém percebe a falha, ela vira incidente."/>
        </DCArtboard>
        <DCArtboard id="b22-cta" label="CTA" width={S} height={S}>
          <CTA lines={['A PERGUNTA','DE HOJE','EVITA O BUG','DE AMANHÃ.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 23. 4 USOS DE IA QUE GERAM RETRABALHO ───────── */}
      <DCSection id="b23" title="23 — 4 usos de IA que geram retrabalho">
        <DCArtboard id="b23-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="IA em QA" headline={"4 USOS DE IA\nQUE GERAM\nRETRABALHO"} sub="A ferramenta prometeu velocidade. Você ganhou um teste que não serve pra nada."/>
        </DCArtboard>
        <DCArtboard id="b23-s1" label="01" width={S} height={S}>
          <ListItemAmber num={1} title={"PROMPT\nSEM\nCONTEXTO"} body='"Crie testes pra essa tela" gera o óbvio. A IA não conhece o risco do seu produto.'/>
        </DCArtboard>
        <DCArtboard id="b23-s2" label="02" width={S} height={S}>
          <ListItem num={2} title={"ACEITAR\nSEM\nREVISAR"} body="A IA inventa cenário que não existe. Sem revisão, você automatiza ficção."/>
        </DCArtboard>
        <DCArtboard id="b23-s3" label="03" width={S} height={S}>
          <ListItemAmber num={3} title={"GERAR\nVOLUME,\nNÃO RISCO"} body="Trinta testes genéricos não cobrem melhor que 5 certeiros. Só dão mais manutenção."/>
        </DCArtboard>
        <DCArtboard id="b23-s4" label="04" width={S} height={S}>
          <ListItem num={4} title={"TERCEIRIZAR\nO PENSA-\nMENTO"} body="Usar IA pra não pensar é o caminho mais rápido pra um teste que ninguém entende."/>
        </DCArtboard>
        <DCArtboard id="b23-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['IA AMPLIA','QUEM PENSA.','EXPÕE QUEM','SÓ EXECUTA.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 24. 3 FRASES QUE REDUZEM SUA AUTORIDADE ─────── */}
      <DCSection id="b24" title="24 — 3 frases que reduzem sua autoridade">
        <DCArtboard id="b24-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="Carreira QA" headline={"3 FRASES QUE\nREDUZEM SUA\nAUTORIDADE"} sub="Você fala isso pra parecer flexível. O efeito é o oposto."/>
        </DCArtboard>
        <DCArtboard id="b24-s1" label="Frase 1" width={S} height={S}>
          <Versus topic="Frase 1"
            wrong='"Acho que talvez tenha um probleminha aqui."'
            right='"Identifiquei um risco no checkout. Se for assim pra prod, impacta venda."'/>
        </DCArtboard>
        <DCArtboard id="b24-s2" label="Frase 2" width={S} height={S}>
          <Versus topic="Frase 2"
            wrong='"Sei lá, vocês que decidem."'
            right='"Minha recomendação é segurar. A decisão é de vocês, mas o risco é esse."'/>
        </DCArtboard>
        <DCArtboard id="b24-s3" label="Frase 3" width={S} height={S}>
          <Versus topic="Frase 3"
            wrong='"Desculpa incomodar, mas..."'
            right='"Preciso de 5 minutos pra alinhar um risco antes do deploy."'/>
        </DCArtboard>
        <DCArtboard id="b24-cta" label="CTA" width={S} height={S}>
          <CTA lines={['COMUNIQUE','COMO QUEM','PROTEGE A','ENTREGA.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 25. 40 TESTES VERMELHOS ÀS 17H ──────────────── */}
      <DCSection id="b25" title="25 — Caso: seletor mudou e quebrou 40 testes">
        <DCArtboard id="b25-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Caso real" headline={"40 TESTES\nVERMELHOS\nÀS 17H"} sub="Sexta-feira, 17h. A suíte inteira ficou vermelha. Aqui está o que eu fiz."/>
        </DCArtboard>
        <DCArtboard id="b25-s1" label="Slide 01" width={S} height={S}>
          <Stacked heading="O que aconteceu:"
            boxes={[
              { label: '17h02', text: 'Pipeline vermelho. 40 testes falhando de uma vez.', amber: false },
              { label: '17h10', text: 'Nenhum bug real. Um id de botão mudou no front.', amber: false },
              { label: '17h15', text: 'Cada teste dependia daquele seletor frágil.', amber: true },
            ]}/>
        </DCArtboard>
        <DCArtboard id="b25-s2" label="Slide 02" width={S} height={S}>
          <SplitH left={"O BUG\nNÃO ERA\nO TESTE.\nERA O\nACO-\nPLAMEN-\nTO."} right="40 testes quebraram por um motivo só. Isso não é cobertura. É fragilidade multiplicada."/>
        </DCArtboard>
        <DCArtboard id="b25-s3" label="Slide 03" width={S} height={S}>
          <ChecklistAmber heading="O que mudou depois:"
            items={['Seletores via data-testid', 'Camada de page object', 'Alerta quando o front altera id', 'Review de seletor no PR']}/>
        </DCArtboard>
        <DCArtboard id="b25-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['TESTE FRÁGIL','NÃO PROTEGE.','SÓ AVISA','TARDE.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 26. O REQUISITO VAGO QUE CUSTOU 2 SPRINTS ───── */}
      <DCSection id="b26" title="26 — Caso: requisito vago, 2 sprints de retrabalho">
        <DCArtboard id="b26-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="Caso real" headline={"O REQUISITO\nVAGO QUE\nCUSTOU 2\nSPRINTS"} sub="Ninguém mentiu. Ninguém foi incompetente. E mesmo assim deu errado."/>
        </DCArtboard>
        <DCArtboard id="b26-s1" label="Slide 01" width={S} height={S}>
          <Versus topic="O requisito"
            wrong='"O usuário deve poder cancelar o pedido."'
            right='Cancelar até quando? Com qual status? Estorna o valor? Quem aprova?'/>
        </DCArtboard>
        <DCArtboard id="b26-s2" label="Slide 02" width={S} height={S}>
          <Stacked heading="O efeito cascata:"
            boxes={[
              { label: 'Sprint 1', text: 'Dev implementou a interpretação dele.', amber: false },
              { label: 'Homologação', text: 'Produto esperava outra coisa.', amber: false },
              { label: 'Sprint 2', text: 'Refez tudo. 2 sprints perdidas por 1 frase.', amber: true },
            ]}/>
        </DCArtboard>
        <DCArtboard id="b26-s3" label="Slide 03" width={S} height={S}>
          <AmberPointLight headline={"A DÚVIDA\nCUSTAVA 5\nMINUTOS."} body="O retrabalho custou 2 sprints. A pergunta que ninguém fez era mais barata que o silêncio."/>
        </DCArtboard>
        <DCArtboard id="b26-cta" label="CTA" width={S} height={S}>
          <CTA lines={['REQUISITO','VAGO É BUG','QUE AINDA','NÃO NASCEU.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 27. 20 MINUTOS QUE A SUÍTE NÃO VIU ──────────── */}
      <DCSection id="b27" title="27 — Caso: exploratório achou o que a automação não viu">
        <DCArtboard id="b27-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="Caso real" headline={"20 MINUTOS\nQUE A SUÍTE\nNÃO VIU"} sub="A suíte automatizada estava 100% verde. O sistema estava quebrado."/>
        </DCArtboard>
        <DCArtboard id="b27-s1" label="Slide 01" width={S} height={S}>
          <SplitH left={"VERDE\nNÃO É\nO MES-\nMO QUE\nCERTO."} right="A automação testava o que foi programada pra testar. O bug estava fora desse roteiro."/>
        </DCArtboard>
        <DCArtboard id="b27-s2" label="Slide 02" width={S} height={S}>
          <Stacked heading="O exploratório encontrou:"
            boxes={[
              { label: 'Caminho', text: 'Usuário voltou no navegador no meio do fluxo.', amber: false },
              { label: 'Efeito', text: 'O pedido duplicou silenciosamente.', amber: false },
              { label: 'Automação', text: 'Nunca testava esse desvio.', amber: true },
            ]}/>
        </DCArtboard>
        <DCArtboard id="b27-s3" label="Slide 03" width={S} height={S}>
          <Quote text="AUTOMAÇÃO CONFIRMA O QUE VOCÊ PREVIU. EXPLORATÓRIO DESCOBRE O QUE VOCÊ NÃO IMAGINOU." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b27-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['VERDE NA','SUÍTE NÃO','É GARANTIA','DE QUALIDADE.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 28. O BUG QUE SÓ APARECIA ÀS 21H ────────────── */}
      <DCSection id="b28" title="28 — Caso: o bug de timezone das 21h">
        <DCArtboard id="b28-cv" label="Capa" width={S} height={S}>
          <Cov eyebrow="Caso real" headline={"O BUG QUE\nSÓ APARECIA\nÀS 21H"} sub="Funcionava em todo teste. Quebrava só na produção, só de noite."/>
        </DCArtboard>
        <DCArtboard id="b28-s1" label="Slide 01" width={S} height={S}>
          <Stacked heading="A investigação:"
            boxes={[
              { label: 'Sintoma', text: 'Relatório com data um dia à frente, só à noite.', amber: false },
              { label: 'Pista', text: 'Acontecia depois das 21h, horário de Brasília.', amber: false },
              { label: 'Causa', text: 'Servidor em UTC. 21h BRT já é o dia seguinte em UTC.', amber: true },
            ]}/>
        </DCArtboard>
        <DCArtboard id="b28-s2" label="Slide 02" width={S} height={S}>
          <AmberPoint headline={"O TESTE\nRODAVA DE\nDIA. O BUG\nMORAVA À\nNOITE."} body="Ambiente de teste em UTC, dados de manhã. As condições do bug nunca eram reproduzidas."/>
        </DCArtboard>
        <DCArtboard id="b28-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="O BUG NÃO SE ESCONDE DO TESTE. SE ESCONDE DA CONDIÇÃO QUE O TESTE NUNCA CRIA." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b28-cta" label="CTA" width={S} height={S}>
          <CTA lines={['TESTE A','CONDIÇÃO.','NÃO SÓ O','CAMINHO.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 29. FORA DA DECISÃO, DENTRO DA COBRANÇA ─────── */}
      <DCSection id="b29" title="29 — Caso: excluído do refino, cobrado no fim">
        <DCArtboard id="b29-cv" label="Capa" width={S} height={S}>
          <CovLight eyebrow="Caso real" headline={"FORA DA\nDECISÃO.\nDENTRO DA\nCOBRANÇA."} sub="Ninguém me chamou pra decidir. Todo mundo me chamou pra explicar o que deu errado."/>
        </DCArtboard>
        <DCArtboard id="b29-s1" label="Slide 01" width={S} height={S}>
          <Stacked heading="A sequência:"
            boxes={[
              { label: 'Refinamento', text: 'QA não foi convidado. "É rápido."', amber: false },
              { label: 'Dev', text: 'Implementou sem cenário de risco mapeado.', amber: false },
              { label: 'Fim da sprint', text: 'Bug em homologação. "Cadê o QA?"', amber: true },
            ]}/>
        </DCArtboard>
        <DCArtboard id="b29-s2" label="Slide 02" width={S} height={S}>
          <AmberPointLight headline={"QA FORA DO\nCOMEÇO É QA\nCOBRADO NO\nFIM."} body="Não dá pra proteger uma entrega cuja decisão você não participou. Mas a conta chega igual."/>
        </DCArtboard>
        <DCArtboard id="b29-s3" label="Slide 03" width={S} height={S}>
          <Quote text="QUALIDADE NÃO SE INSPECIONA NO FIM. SE DECIDE NO COMEÇO, COM QUEM ENTENDE DE RISCO NA SALA." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b29-cta" label="CTA" width={S} height={S}>
          <CTADark lines={['CHAME O QA','PRA DECIDIR.','NÃO SÓ PRA','EXPLICAR.']}/>
        </DCArtboard>
      </DCSection>

      {/* ── 30. 30 TESTES DA IA. 6 ÚTEIS. ───────────────── */}
      <DCSection id="b30" title="30 — Caso: 30 testes da IA, 6 úteis">
        <DCArtboard id="b30-cv" label="Capa" width={S} height={S}>
          <CovSplit eyebrow="Caso real" headline={"30 TESTES\nDA IA. 6\nÚTEIS."} sub="Parecia produtividade. Era ilusão de produtividade."/>
        </DCArtboard>
        <DCArtboard id="b30-s1" label="Slide 01" width={S} height={S}>
          <BigStat number="6" unit="/30" caption="testes gerados pela IA realmente cobriam um risco. O resto era variação do mesmo caminho feliz."/>
        </DCArtboard>
        <DCArtboard id="b30-s2" label="Slide 02" width={S} height={S}>
          <Stacked heading="Por que aconteceu:"
            boxes={[
              { label: 'Prompt', text: 'Pedi volume, não risco.', amber: false },
              { label: 'Contexto', text: 'A IA não sabia o que era crítico no produto.', amber: false },
              { label: 'Filtro', text: 'Eu que precisei separar o útil do ruído.', amber: true },
            ]}/>
        </DCArtboard>
        <DCArtboard id="b30-s3" label="Slide 03" width={S} height={S}>
          <QuoteLight text="A IA ACELERA A GERAÇÃO. MAS QUEM DECIDE O QUE IMPORTA AINDA É O QA." attribution="QA Lab"/>
        </DCArtboard>
        <DCArtboard id="b30-cta" label="CTA" width={S} height={S}>
          <CTA lines={['IA GERA','QUANTIDADE.','VOCÊ GARANTE','RELEVÂNCIA.']}/>
        </DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
