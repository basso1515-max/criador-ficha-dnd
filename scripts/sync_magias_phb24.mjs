import fs from "fs/promises";
import path from "path";

const ROOT = process.cwd();
const PDF_PATH = path.join(ROOT, "src", "data", "5.5e", "DnD 5.5 - Livro do Jogador (2024).pdf");
const MAGIAS_PATH = path.join(ROOT, "src", "data", "5.5e", "magias.js");

const TITLE_TO_EXISTING_ID = {
  "Invocar Elementais Menores": "conjurar-elementais-menores",
  "Invocar Feérico": "invocar-fada",
  "Invocar Fera": "invocar-besta",
  "Invocar Ínfero": "invocar-corruptor",
  "Invocar Saraivada": "conjurar-voleio",
  "Invocar Seres da Floresta": "conjurar-seres-da-floresta",
  "Lâmina Flamejante": "espada-de-chamas",
  "Lendas e Histórias": "conhecimento-da-lenda",
  "Leque Cromático": "spray-de-cores",
  "Ligação Telepática de Rary": "elo-telepatico",
  "Limpar a Mente": "mente-vazia",
  "Línguas": "idiomas",
  "Localizar Animais ou Plantas": "localizar-animais-e-plantas",
  "Loquacidade": "labia",
  "Luzes Dançantes": "globos-de-luz",
  "Malogro": "praga",
  "Mansão Magnífica de Mordenkainen": "mansao-magnifica",
  "Mão de Bigby": "mao-de-energia",
  "Marca do Predador": "marca-do-cacador",
  "Mesclar-se às Rochas": "moldar-se-a-pedra",
  "Moldar Rochas": "moldar-pedra",
  "Moléstia": "contagio",
  "Movimentação Livre": "movimento-livre",
  "Nevasca": "tempestade-de-granizo",
  "Névoa Obscurecente": "neblina",
  "Nuvem Fétida": "nevoa-fetida",
  "Onda Trovejante": "onda-de-trovao",
  "Orbe Cromático": "esfera-cromatica",
  "Palavra Curativa": "palavra-da-cura",
  "Palavra Curativa em Massa": "palavra-de-cura-em-massa",
  "Palavra de Poder: Atordoar": "palavra-do-poder-atordoar",
  "Palavra de Poder: Matar": "palavra-do-poder-matar",
  "Palavra de Poder: Salvar": "palavra-do-poder-cura",
  "Palavra de Radiância": "palavra-do-esplendor",
  "Palavra de Regresso": "palavra-do-chamado",
  "Palavra Sagrada": "palavra-divina",
  "Paralisar Monstro": "imobilizar-monstro",
  "Paralisar Pessoa": "imobilizar-pessoa",
  "Passo Arbóreo": "passo-de-arvore",
  "Passo Nebuloso": "passo-da-neblina",
  "Passo Sem Rastro": "passos-sem-pegadas",
  "Passos Largos": "passolargo",
  "Pele-Casca": "pele-de-arvore",
  "Pele-Rocha": "pele-de-pedra",
  "Pequeno Refúgio de Leomund": "pequena-cabana",
  "Polimorfia": "metamorfose",
  "Polimorfia Total": "metamorfose-verdadeira",
  "Portais Arcanos": "portao-arcano",
  "Presságio": "augurio",
  "Prestidigitação Arcana": "prestidigitacao",
  "Proteção Contra a Morte": "protecao-contra-morte",
  "Raio de Bruxa": "disparo-da-bruxa",
  "Raio de Fogo": "disparo-de-fogo",
  "Raio Guia": "disparo-guia",
  "Raio Lunar": "raio-de-lua",
  "Raio Místico": "rajada-mistica",
  "Raio Nauseante": "raio-do-enjoo",
  "Raio Solar": "raio-de-sol",
  "Rajada de Veneno": "spray-venenoso",
  "Rajada Prismática": "spray-prismatico",
  "Receptáculo Arcano": "jarra-magica",
  "Reencarnar": "reencarnacao",
  "Refugiar": "sequestro",
  "Remeter": "enviar-mensagem",
  "Reparar": "consertar",
  "Repouso Tranquilo": "descanso-tranquilo",
  "Repreensão Diabólica": "repreensao-infernal",
  "Respirar na Água": "respirar-agua",
  "Retirada Acelerada": "recuo-acelerado",
  "Reviver os Mortos": "ressuscitar-os-mortos",
  "Revivificar": "revificar",
  "Santuário Particular de Mordenkainen": "santuario-privativo",
  "Saraivada de Espinhos": "rajada-de-espinhos",
  "Semiplano": "demiplano",
  "Sentido Feral": "sentido-da-besta",
  "Similaridade": "aparencia",
  "Simular Morte": "fingir-morte",
  "Sinal de Esperança": "farol-de-esperanca",
  "Sopro de Dragão": "sopro-do-dragao",
  "Suplício": "enfraquecer-o-intelecto",
  "Talho Mental": "estilhaco-mental",
  "Teleporte": "teletransporte",
  "Tempestade Glacial": "tempestade-de-gelo"
};

const NEW_SPELLS = {
  Metamorfose: {
    id: "metamorfose-shapechange",
    nomeEN: "Shapechange",
    resumo: "Você assume a forma de outra criatura e acessa capacidades dela por até 1 hora.",
    tags: ["transformação", "buff", "versatilidade"]
  },
  "Invocar Dragão": {
    nomeEN: "Summon Dragon",
    resumo: "Invoca um espírito dracônico aliado com bloco próprio.",
    tags: ["invocação", "companheiro", "dragão"]
  },
  "Palavra de Poder: Fortificar": {
    nomeEN: "Power Word Fortify",
    resumo: "Distribui 120 Pontos de Vida Temporários entre até seis criaturas.",
    tags: ["cura", "buff", "temporario"]
  },
  "Presença Régia de Yolande": {
    nomeEN: "Yolande's Regal Presence",
    resumo: "Uma emanação majestosa derruba inimigos e causa dano psíquico.",
    tags: ["controle", "psíquico", "emanação"]
  },
  "Tempestade Radiante de Jallarzi": {
    nomeEN: "Jallarzi's Storm of Radiance",
    resumo: "Uma tempestade de luz e trovões que cega, ensurdece e pune quem permanece nela.",
    tags: ["área", "radiante", "trovejante", "controle"]
  }
};

const SCHOOL_DISPLAY_TO_ID = {
  Abjuração: "abjuração",
  Adivinhação: "adivinhação",
  Conjuração: "conjuração",
  Encantamento: "encantamento",
  Evocação: "evocação",
  Ilusão: "ilusão",
  Necromancia: "necromancia",
  Transmutação: "transmutação"
};

const SCHOOL_ID_TO_DISPLAY = Object.fromEntries(
  Object.entries(SCHOOL_DISPLAY_TO_ID).map(([display, id]) => [id, display])
);

const SCHOOL_HEADER_TO_ID = {
  abjuração: "abjuração",
  adivinhação: "adivinhação",
  encantamento: "encantamento",
  evocação: "evocação",
  ilusão: "ilusão",
  necromancia: "necromancia",
  transmutação: "transmutação",
  invocação: "conjuração"
};

const CLASS_HEADER_TO_ID = {
  artífice: "artifice",
  bárbaro: "barbaro",
  bardo: "bardo",
  bruxo: "bruxo",
  clérigo: "clerigo",
  druida: "druida",
  feiticeiro: "feiticeiro",
  guerreiro: "guerreiro",
  guardião: "patrulheiro",
  mago: "mago",
  monge: "monge",
  paladino: "paladino",
  patrulheiro: "patrulheiro",
  ladino: "ladino"
};

const FIELD_PATTERNS = {
  tempoConjuracao: /Tempo de Conjuração:/i,
  alcance: /Alcance:/i,
  componentes: /Componentes?:/i,
  duracao: /Duração:/i
};

function normalize(text = "") {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slugify(text = "") {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function cleanText(text = "") {
  return String(text)
    .replace(/([A-Za-zÀ-ÖØ-öø-ÿ])-\s+([A-Za-zÀ-ÖØ-öø-ÿ])/g, "$1$2")
    .replace(/CAP[IÍ]TULO\s+7\s+\|\s+MAGIAS\s+\d+/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function pathToFileURL(filePath) {
  return new URL("file:///" + filePath.replace(/\\/g, "/"));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function groupLines(items) {
  items.sort((a, b) => (Math.abs(b.y - a.y) > 1 ? b.y - a.y : a.x - b.x));
  const lines = [];

  for (const item of items) {
    let line = lines.find((candidate) => Math.abs(candidate.y - item.y) < 2);
    if (!line) {
      line = { y: item.y, items: [] };
      lines.push(line);
    }
    line.items.push(item);
  }

  return lines
    .sort((a, b) => b.y - a.y)
    .map((line) =>
      line.items
        .sort((a, b) => a.x - b.x)
        .map((item) => item.str)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter(Boolean);
}

function isSpellTitleLine(line, nextLine) {
  if (!line || !nextLine) return false;
  if (/^CAPÍTULO /i.test(line)) return false;
  if (/^(Tempo de Conjuração|Alcance|Componentes?|Duração|CA|PV|Deslocamento|MOD SG|Sentidos|Idiomas|ND|Traços|Ações|Resistências|Imunidades|1d\d+)/i.test(line)) return false;
  return /^(Truque|\d+º Círculo)/i.test(nextLine);
}

function parseHeader(headerText) {
  const header = cleanText(headerText);
  const lower = header.toLowerCase();
  const levelMatch = header.match(/(\d+)º Círculo/i);
  const nivel = lower.startsWith("truque") ? 0 : levelMatch ? Number(levelMatch[1]) : null;

  let escola = null;
  for (const [label, id] of Object.entries(SCHOOL_HEADER_TO_ID)) {
    if (lower.includes(label)) {
      escola = id;
      break;
    }
  }

  const classMatch = header.match(/\(([^)]*)\)/);
  const classes = classMatch
    ? classMatch[1]
        .split(",")
        .map((part) => cleanText(part).toLowerCase())
        .map((part) => CLASS_HEADER_TO_ID[part])
        .filter(Boolean)
    : [];

  return { header, nivel, escola, classes };
}

function extractField(lines, fieldName) {
  const pattern = FIELD_PATTERNS[fieldName];
  const labels = Object.values(FIELD_PATTERNS);
  const index = lines.findIndex((line) => pattern.test(line));

  if (index === -1) return { value: "", nextIndex: -1 };

  let value = cleanText(lines[index].replace(pattern, ""));
  let cursor = index + 1;

  while (
    cursor < lines.length &&
    !labels.some((label) => label.test(lines[cursor])) &&
    !/^CAPÍTULO /i.test(lines[cursor]) &&
    !isSpellTitleLine(lines[cursor], lines[cursor + 1])
  ) {
    if (fieldName !== "componentes") break;
    value = cleanText(`${value} ${lines[cursor]}`);
    cursor += 1;
  }

  return { value, nextIndex: cursor };
}

function parseComponentData(componentesText) {
  const text = cleanText(componentesText);
  const detailMatch = text.match(/\((.*)\)/);
  const componentesDetalhe = detailMatch ? cleanText(detailMatch[1]) : "";
  const lettersText = detailMatch ? text.slice(0, detailMatch.index).trim() : text;
  const componentes = lettersText
    .split(",")
    .map((part) => cleanText(part))
    .filter(Boolean);

  return { componentes, componentesDetalhe };
}

function splitDescription(description = "") {
  const text = cleanText(description);
  if (!text) return { descricao: "", emNiveisSuperiores: "" };

  for (const marker of [
    "Usando um Espaço de Magia de Círculo Superior.",
    "Aprimoramento de Truque."
  ]) {
    if (text.includes(marker)) {
      const [base, extra] = text.split(marker);
      return {
        descricao: cleanText(base),
        emNiveisSuperiores: cleanText(`${marker} ${extra}`)
      };
    }
  }

  return { descricao: text, emNiveisSuperiores: "" };
}

function parseSpellSection(sectionLines) {
  const title = sectionLines[0];
  let headerEnd = 1;
  let header = sectionLines[1] || "";

  while (
    headerEnd + 1 < sectionLines.length &&
    !header.includes(")") &&
    !FIELD_PATTERNS.tempoConjuracao.test(sectionLines[headerEnd + 1])
  ) {
    headerEnd += 1;
    header = cleanText(`${header} ${sectionLines[headerEnd]}`);
  }

  const detailLines = sectionLines.slice(headerEnd + 1);
  const tempoConjuracaoField = extractField(detailLines, "tempoConjuracao");
  const alcanceField = extractField(detailLines, "alcance");
  const componentesField = extractField(detailLines, "componentes");
  const duracaoField = extractField(detailLines, "duracao");
  const descriptionStart = duracaoField.nextIndex >= 0 ? duracaoField.nextIndex : detailLines.length;
  const descriptionLines = detailLines.slice(descriptionStart);
  const { componentes, componentesDetalhe } = parseComponentData(componentesField.value);
  const { descricao, emNiveisSuperiores } = splitDescription(descriptionLines.join(" "));
  const parsedHeader = parseHeader(header);

  return {
    titulo: title,
    ...parsedHeader,
    tempoConjuracao: tempoConjuracaoField.value,
    alcance: alcanceField.value,
    componentes,
    componentesDetalhe,
    duracao: duracaoField.value,
    ritual: /\bRitual\b/i.test(tempoConjuracaoField.value),
    concentracao: /Concentração/i.test(duracaoField.value),
    descricao,
    emNiveisSuperiores
  };
}

function levelKey(level) {
  return level === 0 ? "TRUQUES" : `NÍVEL ${level}`;
}

function sortSpellGroups(magias) {
  for (const level of Object.keys(magias)) {
    for (const school of Object.keys(magias[level])) {
      const entries = Object.entries(magias[level][school]).sort(([, a], [, b]) =>
        a.nome.localeCompare(b.nome, "pt-BR")
      );
      magias[level][school] = Object.fromEntries(entries);
    }
  }
}

function indexSpells(magias) {
  const byId = new Map();
  const byName = new Map();

  function walk(node) {
    if (!node || typeof node !== "object") return;
    if (node.id && node.nome) {
      byId.set(node.id, node);
      byName.set(normalize(node.nome), node);
      return;
    }

    for (const value of Object.values(node)) walk(value);
  }

  walk(magias);
  return { byId, byName };
}

async function extractSpellsFromPdf() {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const document = await pdfjsLib.getDocument({ url: pathToFileURL(PDF_PATH).href }).promise;
  const spells = [];

  for (let pdfPage = 299; pdfPage <= 343; pdfPage += 1) {
    const page = await document.getPage(pdfPage);
    const content = await page.getTextContent();
    const items = content.items
      .map((item) => ({ str: item.str, x: item.transform[4], y: item.transform[5] }))
      .filter((item) => item.str.trim());

    const footerLines = groupLines(items);
    const footerLine = footerLines.find((line) => /CAPÍTULO 7 \| MAGIAS/i.test(line));
    const printedPageMatch = footerLine && footerLine.match(/(\d+)\s*$/);
    const pagina = printedPageMatch ? Number(printedPageMatch[1]) : pdfPage - 6;

    for (const columnItems of [items.filter((item) => item.x < 300), items.filter((item) => item.x >= 300)]) {
      const lines = groupLines(columnItems);
      const titleIndexes = [];

      for (let index = 0; index < lines.length - 1; index += 1) {
        if (isSpellTitleLine(lines[index], lines[index + 1])) {
          titleIndexes.push(index);
        }
      }

      for (let index = 0; index < titleIndexes.length; index += 1) {
        const start = titleIndexes[index];
        const end = index + 1 < titleIndexes.length ? titleIndexes[index + 1] : lines.length;
        const sectionLines = lines.slice(start, end);
        const parsed = parseSpellSection(sectionLines);
        spells.push({ pdfPage, pagina, ...parsed });
      }
    }
  }

  return spells;
}

function buildNewSpell(record) {
  const newSpellConfig = NEW_SPELLS[record.titulo] || {};
  const englishFallback = newSpellConfig.nomeEN || "";
  const resumoFallback = newSpellConfig.resumo || "";
  const tagsFallback = newSpellConfig.tags || [];
  const id = newSpellConfig.id || slugify(record.titulo);

  return {
    id,
    nome: record.titulo,
    nomeEN: englishFallback,
    nivel: record.nivel,
    escola: record.escola,
    ritual: record.ritual,
    concentracao: record.concentracao,
    tempoConjuracao: record.tempoConjuracao,
    alcance: record.alcance,
    componentes: record.componentes,
    componentesDetalhe: record.componentesDetalhe,
    duracao: record.duracao,
    classes: record.classes,
    descricao: record.descricao,
    emNiveisSuperiores: record.emNiveisSuperiores,
    fonte: "PHB24",
    pagina: record.pagina,
    resumo: resumoFallback || record.descricao.split(".")[0]?.trim() || "",
    tags: tagsFallback
  };
}

async function main() {
  const extractedSpells = await extractSpellsFromPdf();
  const sourceModule = await import(pathToFileURL(MAGIAS_PATH).href);
  const magias = clone(sourceModule.MAGIAS);
  const originalText = await fs.readFile(MAGIAS_PATH, "utf8");
  const exportIndex = originalText.indexOf("export const MAGIAS =");

  if (exportIndex === -1) {
    throw new Error('Não encontrei "export const MAGIAS =" em magias.js');
  }

  const { byId, byName } = indexSpells(magias);
  let updated = 0;
  let created = 0;

  for (const spell of extractedSpells) {
    const shouldForceCreate = spell.titulo === "Metamorfose";
    const existingByName = shouldForceCreate ? null : byName.get(normalize(spell.titulo));
    const mappedId = TITLE_TO_EXISTING_ID[spell.titulo];
    const target = existingByName || (mappedId ? byId.get(mappedId) : null);

    if (target) {
      target.nome = spell.titulo;
      target.nivel = spell.nivel;
      target.escola = spell.escola;
      target.ritual = spell.ritual;
      target.concentracao = spell.concentracao;
      target.tempoConjuracao = spell.tempoConjuracao || target.tempoConjuracao;
      target.alcance = spell.alcance || target.alcance;
      if (spell.componentes.length) target.componentes = spell.componentes;
      target.componentesDetalhe = spell.componentesDetalhe;
      target.duracao = spell.duracao || target.duracao;
      target.classes = spell.classes;
      target.pagina = spell.pagina;
      target.fonte = "PHB24";
      if (NEW_SPELLS[spell.titulo]?.nomeEN) {
        target.nomeEN = NEW_SPELLS[spell.titulo].nomeEN;
      }
      if (NEW_SPELLS[spell.titulo]) {
        target.descricao = spell.descricao;
        target.emNiveisSuperiores = spell.emNiveisSuperiores;
        target.resumo = NEW_SPELLS[spell.titulo].resumo;
        target.tags = NEW_SPELLS[spell.titulo].tags;
      }
      updated += 1;
      continue;
    }

    if (!NEW_SPELLS[spell.titulo]) {
      throw new Error(`Sem mapeamento para "${spell.titulo}"`);
    }

    const levelBucket = levelKey(spell.nivel);
    const schoolBucket = SCHOOL_ID_TO_DISPLAY[spell.escola];

    if (!magias[levelBucket]) magias[levelBucket] = {};
    if (!magias[levelBucket][schoolBucket]) magias[levelBucket][schoolBucket] = {};

    const newSpell = buildNewSpell(spell);
    magias[levelBucket][schoolBucket][newSpell.id] = newSpell;
    byId.set(newSpell.id, newSpell);
    byName.set(normalize(newSpell.nome), newSpell);
    created += 1;
  }

  sortSpellGroups(magias);

  const updatedHeader = originalText
    .slice(0, exportIndex)
    .replace(/export const DATASET_VERSION = ".*?";/, 'export const DATASET_VERSION = "0.2.0";')
    .replace(/builtAt: ".*?"/, 'builtAt: "2026-04-17"')
    .replace(
      /changelog:\s*\[[\s\S]*?\]/,
      `changelog: [
    "0.2.0: Sincroniza magias das páginas 299-343 do Livro do Jogador 2024 e corrige nomes PT-BR, classes e paginação."
  ]`
    );

  const nextText = `${updatedHeader}export const MAGIAS = ${JSON.stringify(magias, null, 2)};\n`;
  await fs.writeFile(MAGIAS_PATH, nextText, "utf8");

  console.log(
    JSON.stringify(
      {
        totalExtraidas: extractedSpells.length,
        atualizadas: updated,
        criadas: created,
        arquivo: MAGIAS_PATH
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
