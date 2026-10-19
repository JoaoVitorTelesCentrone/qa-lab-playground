# Publicar videoaulas

O percurso está cadastrado por tema, parte e aula. Não é necessário alterar o código para adicionar vídeos ou materiais.

## Publicação

1. Suba o vídeo no YouTube, Vimeo ou no serviço que hospeda seus arquivos de vídeo.
2. Entre como administrador em `/mentoria/admin#conteudo-aulas`.
3. Em **Publicar aulas**, selecione o tema, a parte e a aula no seletor.
4. Cole o link do vídeo e confira a prévia. Adicione o link do material de apoio, se houver.
5. Escolha **Publicar para os alunos** ou **Agendar publicação** e salve.

O vídeo aparece automaticamente na aba **Vídeo** da aula e na sequência de estudo dos alunos matriculados. O rascunho fica restrito ao painel. O horário do agendamento é o horário local do dispositivo de quem publica e é enviado ao servidor em UTC.

## Links aceitos

- YouTube: link de compartilhamento, `watch`, `embed`, `shorts` ou `live`. Para aulas não públicas, use vídeo não listado com incorporação permitida.
- Vimeo: link normal, link do player ou link não listado com hash de privacidade. Libere o domínio do QA Lab nas configurações de incorporação.
- Arquivo hospedado: URL direta terminando em `.mp4`, `.webm` ou `.ogv`, incluindo parâmetros de acesso. Use um endereço estável; links temporários expiram.
- Outras plataformas: o aluno abre o player na plataforma de origem. Há uma saída para a origem também nos players incorporados.

Não cole código HTML de iframe: use a URL. Ative as legendas no provedor antes de publicar. A aba **Leitura** continua disponível junto ao vídeo; ela não é apresentada como uma transcrição automática.

## Fluxo do aluno

**Tema → Aula (vídeo ou leitura) → Materiais de apoio → Concluir e continuar → Quiz → Exemplo → Missão no Broto → Entrega → Feedback.**

Antes de haver um vídeo publicado, a aula abre na leitura. Para alunos matriculados, a aba de vídeo informa que a gravação está em preparação. Publicar o vídeo muda a entrada da aula para o player, preservando a leitura e o progresso já registrado.

O catálogo e a leitura são públicos. Os links de vídeo e materiais publicados pelo painel seguem o acesso existente da mentoria. A conclusão é uma ação do aluno; não é inferida de tempo assistido.

O envio de arquivos de vídeo diretamente para o QA Lab não faz parte deste caminho de publicação: os arquivos são hospedados no provedor e vinculados pelo painel.
