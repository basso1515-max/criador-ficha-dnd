import fs from 'fs/promises';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

const root = process.cwd();
const pdfDir = path.join(root, 'assets', 'pdf', '5e');
const templatePath = path.join(pdfDir, 'ficha5e.pdf');
const mapPath = path.join(pdfDir, 'pdf-map.json');
const outPath = path.join(root, 'out', 'ficha-exemplo.pdf');

async function main() {
  await fs.mkdir(path.dirname(outPath), { recursive: true });

  const [templateBytes, pdfMapRaw] = await Promise.all([
    fs.readFile(templatePath),
    fs.readFile(mapPath, 'utf8'),
  ]);
  const pdfMap = JSON.parse(pdfMapRaw);

  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  const fieldMap = new Map();
  fields.forEach(f => {
    try { fieldMap.set(f.getName(), f); } catch (e) { /* ignore */ }
  });

  const ficha = {
    texto: {
      nome: ['Druida Exemplo', 'Druida Exemplo — Página 2'],
      classeENivel: 'Druida 3',
      antecedente: 'Sábio',
      nomeJogador: 'Guilherme',
      raca: 'Elfo',
      alinhamento: 'Neutro Bom',
      xp: '0',
      idade: '120',
      altura: '1.7 m (5 ft 7 in)',
      peso: '65 kg (143 lb)',
      olhos: 'Verdes',
      pele: 'Clara',
      cabelo: 'Castanho',
      bonusProficiencia: '+2',
      CA: '13',
      iniciativa: '+2',
      deslocamento: '30 ft (9.1 m)',
      hpMax: '24',
      hpAtual: '24',
      hpTemporario: '',
      dadoVidaTotal: '3d8',
      dadoVidaAtual: '3d8',
      percepcaoPassiva: '13',
      tracosPersonalidade: 'Curioso e calmo.',
      ideais: 'Conhecimento.',
      vinculos: 'Biblioteca da vila.',
      defeitos: 'Obcecado por estudos.',
      historiaPersonagem: 'Estudou as estrelas desde criança.',
      caracteristicasETalentos: 'Forma Estelar: Assume uma forma astral ligada às constelações, concedendo benefícios.\n  - Forma Arqueiro: Como ação bônus, conjura uma flecha luminosa que causa 1d8 + mod. SAB de dano radiante.\n  - Forma Cálice: Ao conjurar uma magia de cura (gastando slot), cura alvos adicionais em 1d8 + mod. SAB.\n  - Forma Dragão: Em testes de Con/Int/Sab, resultados 9 ou menos tornam-se 10.\n\nPresságio Cósmico: Após descanso longo role 1d6: par = Bem-estar (bônus 1d6 a aliado), ímpar = Aflição (penalidade 1d6 a inimigo).',
      caracteristicasETalentosAdicionais: '',
      nomeSimbolo: '',
      aliadosEOrganizacoes: '',
      tesouros: '',
      outrasProficienciasEIdiomas: 'Comum, Élfico',
      equipamento: 'Cimitarra, Foco druídico',
      inspiracao: '',
      divindade: '',
    },
    atributos: {
      for: { valor: '10', mod: '0' },
      des: { valor: '14', mod: '+2' },
      con: { valor: '12', mod: '+1' },
      int: { valor: '11', mod: '0' },
      sab: { valor: '16', mod: '+3' },
      car: { valor: '10', mod: '0' },
    },
    pericias: {
      acrobacia: { proficiente: false, bonus: '2' },
      percepcao: { proficiente: true, bonus: '5' },
    }
  };

  function setTextField(name, value) {
    if (!name) return;
    if (Array.isArray(name)) {
      name.forEach(n => setTextField(n, value));
      return;
    }
    const field = fieldMap.get(name);
    if (!field) {
      console.warn('Field not found:', name);
      return;
    }
    try {
      if (typeof field.setText === 'function') field.setText(String(value ?? ''));
      else console.warn('Field has no setText:', name);
    } catch (e) {
      console.warn('Failed to set field', name, e.message);
    }
  }

  function fillMap(nodeMap, dataNode) {
    if (!nodeMap) return;
    if (typeof nodeMap === 'string' || Array.isArray(nodeMap)) {
      const val = dataNode ?? '';
      if (Array.isArray(nodeMap)) {
        if (Array.isArray(val)) {
          nodeMap.forEach((fieldName, idx) => setTextField(fieldName, val[idx] ?? ''));
        } else {
          setTextField(nodeMap[0], val);
        }
      } else {
        setTextField(nodeMap, val);
      }
      return;
    }
    for (const key of Object.keys(nodeMap)) {
      fillMap(nodeMap[key], dataNode ? dataNode[key] : undefined);
    }
  }

  fillMap(pdfMap.texto, ficha.texto);
  fillMap(pdfMap.atributos, ficha.atributos);

  const periciasMap = pdfMap.pericias || {};
  for (const [k, mapping] of Object.entries(periciasMap)) {
    const data = ficha.pericias && ficha.pericias[k];
    if (!data) continue;
    if (mapping.bonus) setTextField(mapping.bonus, data.bonus ?? '');
    if (mapping.proficiente) {
      const f = fieldMap.get(mapping.proficiente);
      if (f && typeof f.check === 'function') {
        if (data.proficiente) {
          try { f.check(); } catch(e) { console.warn('Failed to check', mapping.proficiente, e.message); }
        }
      }
    }
  }

  const pdfBytesOut = await pdfDoc.save();
  await fs.writeFile(outPath, pdfBytesOut);
  console.log('PDF salvo em', outPath);
}

main().catch((e) => { console.error(e); process.exit(1); });
