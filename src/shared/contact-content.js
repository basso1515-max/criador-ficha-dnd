const CONTACT_EMAIL = "sheetfy.ctt@gmail.com";

export const CONTACT_CONTENT = Object.freeze({
  email: CONTACT_EMAIL,
  blocks: Object.freeze({
    homeContact: Object.freeze([
      "Encontrou um erro de regra, teve problema usando o site, quer sugerir uma melhoria ou apoiar o projeto? Escreva para ",
      { type: "email" },
      ".",
    ]),
    privacyContact: Object.freeze([
      "O responsável pelo projeto é o mantenedor do Sheetfy. Para assuntos de privacidade, exclusão de dados, remoção de conteúdo ou dúvidas sobre estes termos, use o contato: ",
      { type: "email" },
      ".",
    ]),
    termsContact: Object.freeze([
      "Para dúvidas, pedidos de privacidade, remoção de conteúdo ou avisos sobre direitos autorais, use o contato: ",
      { type: "email" },
      ".",
    ]),
  }),
  actions: Object.freeze({
    feedback: Object.freeze({
      subject: "Feedback sobre o Sheetfy",
      body: "Oi! Quero deixar um feedback sobre o Sheetfy.\n\n",
    }),
    bug: Object.freeze({
      subject: "Erro ou bug no Sheetfy",
      body: "Oi! Encontrei um erro no Sheetfy.\n\nPagina ou edicao:\nO que aconteceu:\nO que eu esperava:\n",
    }),
    support: Object.freeze({
      subject: "Quero apoiar o Sheetfy",
      body: "Oi! Quero saber como posso apoiar ou fazer uma doacao para o Sheetfy.\n\n",
    }),
  }),
});

function encodeMailtoValue(value) {
  return encodeURIComponent(value);
}

export function getContactHref() {
  return `mailto:${CONTACT_CONTENT.email}`;
}

export function getContactActionHref(actionId) {
  const action = CONTACT_CONTENT.actions[actionId];
  if (!action) return getContactHref();

  const query = [
    ["subject", action.subject],
    ["body", action.body],
  ]
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${encodeMailtoValue(value)}`)
    .join("&");

  return `${getContactHref()}${query ? `?${query}` : ""}`;
}
