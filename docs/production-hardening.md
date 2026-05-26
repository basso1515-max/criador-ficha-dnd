# Checklist De Produção

Este projeto pode rodar localmente sem muita cerimônia, mas publicação pública pede alguns cuidados extras. Use esta lista antes de abrir o app para outras pessoas.

## Ambiente

- Configure HTTPS no domínio final.
- Use Upstash Redis persistente em produção.
- Defina `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` somente no painel da Vercel ou no provedor de deploy.
- Defina `ACCOUNT_PASSWORD_PEPPER` como um segredo longo e aleatório antes de criar contas reais, se quiser uma camada extra para hashes de senha.
- Configure `RESEND_API_KEY`, `ACCOUNT_EMAIL_FROM` e, se necessário, `ACCOUNT_PUBLIC_BASE_URL` para recuperação de senha e validação de e-mail.
- Nunca habilite `ACCOUNT_EMAIL_DEBUG_RESPONSE` em produção.
- Não publique `.env.local`, dumps de Redis, `server-data/`, logs ou arquivos gerados em `out/`.
- Rode `npm audit --omit=dev` antes do deploy.
- Rode `npm test` antes de promover uma versão. Ele cobre validação estrutural, smoke DOM, conta/API e exportação PDF 5e/2024.
- Se precisar isolar falhas, rode `npm run check`, `npm run smoke:dom`, `npm run test:e2e`, `npm run test:pdf:5e` e `npm run test:pdf:2024`.
- Garanta que Chrome ou Edge esteja disponível para os testes headless; se necessário, defina `CHROME_PATH`.

## Segredos

- Se qualquer token local já foi compartilhado, rotacione no Upstash/Vercel.
- Se `ACCOUNT_PASSWORD_PEPPER` vazar, rotacione o segredo e force redefinição de senha para contas criadas com pepper.
- Revogue tokens antigos depois de confirmar que a produção usa os novos.
- Mantenha `.env.example` atualizado com nomes de variáveis, nunca com valores reais.
- Evite colar tokens em issues, commits, prints ou conversas públicas.

## Dados E Backups

- Defina uma rotina de export/backup do Redis antes de depender do app para campanhas reais.
- Teste restauração em um ambiente separado antes de precisar dela.
- Documente quem pode acessar o banco de produção.
- Se o app for aberto a outras pessoas, defina política clara de retenção/exclusão de contas.

## Segurança Da Aplicação

- Confirme que os cookies de sessão estão com `HttpOnly`, `SameSite=Lax` e `Secure` em HTTPS.
- Mantenha rate limit ativo para cadastro, login e migração.
- Mantenha a política de senha nova em 15+ caracteres e bloqueio de senhas comuns.
- Verifique se rotas sensíveis rejeitam origem cross-site.
- Mantenha `Cache-Control: no-store` em respostas da API.
- Revise headers de produção no `vercel.json` após mudanças grandes.

## Privacidade

- Explique quais dados são salvos: nome, e-mail, personagens, escolhas da ficha e snapshots.
- Informe que PDFs gerados no navegador não são salvos automaticamente pelo servidor.
- Inclua contato/caminho para pedir exclusão de conta se houver usuários externos.
- Evite coletar dados que não ajudam diretamente o produto.

## Conteúdo E Licenças

- Separe claramente código, dados próprios, dados SRD e templates de PDF.
- Antes de publicar amplamente, revise atribuições, permissões de uso e marcas.
- Não apresente o projeto como oficial, afiliado ou endossado pela Wizards of the Coast.

## Monitoramento

- Ative logs da Vercel para erros de API.
- Acompanhe falhas de cadastro/login/salvamento depois de cada deploy.
- Confira `/api/community-stats` depois de publicar, pois ele depende do mesmo Redis persistente usado pelas contas.
- Se o app receber usuários externos, considere alertas simples para erro 5xx e limite de Redis.

## Promocao De Deploy

- Use `vercel deploy` para gerar um preview manual quando não estiver usando Git Integration.
- Valide o preview com criação de conta, salvamento de personagem, geração de PDF e estatísticas públicas.
- Promova para produção com `vercel deploy --prod` ou promova um preview já validado com `vercel promote`.
- Em caso de regressão em produção, use `vercel rollback` e investigue a falha antes de novo deploy.
