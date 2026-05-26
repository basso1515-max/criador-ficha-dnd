# Modelo Simples De Política De Privacidade

## Quais Dados São Salvos

O Sheetify salva os dados necessários para conta e personagens:

- nome de exibição;
- e-mail;
- senha em formato de hash;
- provedor de login social usado, quando aplicável;
- personagens salvos;
- escolhas e textos preenchidos na ficha;
- datas de criação e atualização dos registros.

## Como Os Dados São Usados

Os dados são usados para permitir login, manter sessão, listar personagens salvos, carregar fichas existentes, migrar personagens entre edições e excluir conta ou personagens quando solicitado. Em logins sociais, o provedor confirma a identidade e o e-mail da conta.

## PDFs Gerados

Os PDFs são gerados a partir das informações preenchidas na ficha. O salvamento da conta guarda as escolhas e textos do personagem, não uma cópia automática do PDF exportado.

## Compartilhamento

Os dados não são vendidos. O armazenamento pode usar serviços de infraestrutura, como Vercel e Upstash Redis, para manter o app funcionando.

## Exclusão De Conta

O usuário pode excluir a própria conta pela área de conta. Essa ação remove a conta, sessões e personagens salvos associados.

## Segurança

O projeto usa cookie de sessão `HttpOnly`, validações de origem, limites básicos de tentativa e hash de senha para contas novas.
