/* ----------------------------------------------------
   Modern Life Residence - Global Data Store & Mock Data
   Dados Financeiros Fiéis extraídos dos Relatórios Oficiais
   ---------------------------------------------------- */

const STORAGE_KEY = 'MODERN_LIFE_CONDO_DATA_V3';
const CURRENT_USER_KEY = 'MODERN_LIFE_CURRENT_USER';

const INITIAL_DATA = {
  moradores: [
    {
      id: 'usr_admin',
      nome: 'Alessandro Cristiano da Silva',
      apartamento: '152',
      bloco: 'A',
      cpf: '123.456.789-00',
      telefone: '(11) 98765-4321',
      email: 'condominio.modern.life@gmail.com',
      status: 'Aprovado', // Aprovado, Pendente, Rejeitado
      role: 'Administrador', // Administrador, Conselheiro, Morador
      dataCadastro: '2025-01-10',
      photoURL: 'https://lh3.googleusercontent.com/a/default-user'
    },
    {
      id: 'usr_02',
      nome: 'Mariana Castro',
      apartamento: '84',
      bloco: 'B',
      cpf: '234.567.890-11',
      telefone: '(11) 97654-3210',
      email: 'mariana.castro@gmail.com',
      status: 'Aprovado',
      role: 'Conselheiro',
      dataCadastro: '2025-02-15'
    },
    {
      id: 'usr_03',
      nome: 'Roberto Almeida',
      apartamento: '121',
      bloco: 'A',
      cpf: '345.678.901-22',
      telefone: '(11) 96543-2109',
      email: 'roberto.almeida@hotmail.com',
      status: 'Aprovado',
      role: 'Morador',
      dataCadastro: '2025-03-01'
    },
    {
      id: 'usr_04_pendente',
      nome: 'Fernanda Oliveira',
      apartamento: '43',
      bloco: 'A',
      cpf: '456.789.012-33',
      telefone: '(11) 95432-1098',
      email: 'fernanda.oliveira@gmail.com',
      status: 'Pendente',
      role: 'Morador',
      dataCadastro: '2026-07-20'
    }
  ],

  // Dados reais consolidados dos PDFs da Gestão
  prestacaoContas: [
    {
      id: 'pc_2026_05',
      mesAno: 'Maio 2026',
      mes: 5,
      ano: 2026,
      receitas: 100992.34,
      despesas: 74706.09,
      saldoAnterior: 472151.84,
      saldo: 26286.25,
      saldoAtual: 498438.09,
      status: 'Publicado e Auditado',
      categoriasDespesa: [
        { nome: 'Consumo (Água, Energia, Gás, Tel, Internet)', valor: 12574.41 },
        { nome: 'Manutenção e Conservação Predial', valor: 4561.11 },
        { nome: 'Despesas Administrativas & Síndico', valor: 7943.33 },
        { nome: 'Taxa Extra / Obras Calçada', valor: 1361.00 },
        { nome: 'Contratos (Mão de Obra, Elevadores, Portaria)', valor: 39121.61 },
        { nome: 'Impostos & Retenções (ISS, Receita Federal)', valor: 4305.34 }
      ]
    },
    {
      id: 'pc_2026_04',
      mesAno: 'Abril 2026',
      mes: 4,
      ano: 2026,
      receitas: 100992.34,
      despesas: 74706.09,
      saldoAnterior: 472151.84,
      saldo: 26286.25,
      saldoAtual: 498438.09,
      status: 'Publicado e Auditado',
      categoriasDespesa: [
        { nome: 'Consumo (Água, Energia, Gás, Tel, Internet)', valor: 11406.96 },
        { nome: 'Manutenção e Conservação Predial', valor: 6855.48 },
        { nome: 'Despesas Administrativas & Síndico', valor: 3625.52 },
        { nome: 'Taxa Extra / Obras Calçada', valor: 9730.66 },
        { nome: 'Contratos (Mão de Obra, Elevadores, Portaria)', valor: 39069.72 },
        { nome: 'Impostos & Retenções (ISS, Receita Federal)', valor: 4017.75 }
      ]
    },
    {
      id: 'pc_2026_03',
      mesAno: 'Março 2026',
      mes: 3,
      ano: 2026,
      receitas: 91253.90,
      despesas: 81879.48,
      saldoAnterior: 462777.42,
      saldo: 9374.42,
      saldoAtual: 472151.84,
      status: 'Publicado e Auditado',
      categoriasDespesa: [
        { nome: 'Consumo (Água, Energia, Gás, Tel, Internet)', valor: 12211.96 },
        { nome: 'Manutenção e Conservação Predial', valor: 3533.29 },
        { nome: 'Despesas Administrativas & Síndico', valor: 5167.52 },
        { nome: 'Taxa Extra / Obra Calçada', valor: 16164.26 },
        { nome: 'Contratos (Mão de Obra, Elevadores, Portaria)', valor: 40828.32 },
        { nome: 'Impostos & Retenções (ISS, Receita Federal)', valor: 3974.13 }
      ]
    },
    {
      id: 'pc_2026_02',
      mesAno: 'Fevereiro 2026',
      mes: 2,
      ano: 2026,
      receitas: 100772.74,
      despesas: 64811.66,
      saldoAnterior: 426816.34,
      saldo: 35961.08,
      saldoAtual: 462777.42,
      status: 'Publicado e Auditado',
      categoriasDespesa: [
        { nome: 'Consumo (Água, Energia, Gás, Tel, Internet)', valor: 15697.96 },
        { nome: 'Manutenção e Conservação Predial', valor: 5854.78 },
        { nome: 'Despesas Administrativas & Síndico', valor: 3221.55 },
        { nome: 'Contratos (Mão de Obra, Elevadores, Portaria)', valor: 35965.62 },
        { nome: 'Impostos & Retenções (ISS, Receita Federal)', valor: 4071.75 }
      ]
    }
  ],

  balancetes: [
    {
      id: 'bal_2026_05',
      titulo: 'Balancete Geral Consolidado - Maio 2026',
      ano: 2026,
      mes: 'Maio',
      dataPublicacao: '2026-05-31',
      receitaBruta: 100992.34,
      despesaBruta: 74706.09,
      saldoAnterior: 472151.84,
      saldoMes: 26286.25,
      saldoAtual: 498438.09
    },
    {
      id: 'bal_2026_04',
      titulo: 'Balancete Geral Consolidado - Abril 2026',
      ano: 2026,
      mes: 'Abril',
      dataPublicacao: '2026-04-30',
      receitaBruta: 100992.34,
      despesaBruta: 74706.09,
      saldoAnterior: 472151.84,
      saldoMes: 26286.25,
      saldoAtual: 498438.09
    },
    {
      id: 'bal_2026_03',
      titulo: 'Balancete Geral Consolidado - Março 2026',
      ano: 2026,
      mes: 'Março',
      dataPublicacao: '2026-03-31',
      receitaBruta: 91253.90,
      despesaBruta: 81879.48,
      saldoAnterior: 462777.42,
      saldoMes: 9374.42,
      saldoAtual: 472151.84
    },
    {
      id: 'bal_2026_02',
      titulo: 'Balancete Geral Consolidado - Fevereiro 2026',
      ano: 2026,
      mes: 'Fevereiro',
      dataPublicacao: '2026-02-28',
      receitaBruta: 100772.74,
      despesaBruta: 64811.66,
      saldoAnterior: 426816.34,
      saldoMes: 35961.08,
      saldoAtual: 462777.42
    }
  ],

  contratos: [
    {
      id: 'ctr_01',
      empresa: 'Otis Elevadores S.A.',
      objeto: 'Manutenção Preventiva e Corretiva dos 4 Elevadores',
      valorMensal: 14500.00,
      vigenciaInicio: '2025-01-01',
      vigenciaFim: '2027-01-01',
      status: 'Ativo'
    },
    {
      id: 'ctr_02',
      empresa: 'SeguraPort Segurança e Monitoramento',
      objeto: 'Monitoramento 24h, Portaria Remota e Cftv',
      valorMensal: 16800.00,
      vigenciaInicio: '2024-06-01',
      vigenciaFim: '2026-06-01',
      status: 'Em Renovação'
    },
    {
      id: 'ctr_03',
      empresa: 'Verde Vida Paisagismo',
      objeto: 'Manutenção dos Jardins e Áreas Verdes Externa',
      valorMensal: 3800.00,
      vigenciaInicio: '2025-03-01',
      vigenciaFim: '2026-03-01',
      status: 'Ativo'
    },
    {
      id: 'ctr_04',
      empresa: 'Porto Seguro Cia de Seguros',
      objeto: 'Apólice de Seguro Condominial Compreensivo',
      valorMensal: 2950.00,
      vigenciaInicio: '2026-01-01',
      vigenciaFim: '2027-01-01',
      status: 'Ativo'
    }
  ],

  documentos: [
    {
      id: 'doc_01',
      nome: 'Convenção do Condomínio Modern Life Residence',
      categoria: 'Convenção',
      dataUpload: '2024-01-15',
      tamanho: '4.2 MB',
      arquivo: 'assets/docs/EDITAL_AGE_11.08.2026_-_MODERN_LIFE_assinado.pdf'
    },
    {
      id: 'doc_02',
      nome: 'Regimento Interno Atualizado 2025/2026',
      categoria: 'Regimento Interno',
      dataUpload: '2025-11-10',
      tamanho: '2.8 MB',
      arquivo: 'assets/docs/EDITAL_AGE_11.08.2026_-_MODERN_LIFE_assinado.pdf'
    },
    {
      id: 'doc_03',
      nome: 'Manual do Proprietário e Especificações Técnicas',
      categoria: 'Manual do Proprietário',
      dataUpload: '2024-02-01',
      tamanho: '8.5 MB',
      arquivo: 'assets/docs/EDITAL_AGE_11.08.2026_-_MODERN_LIFE_assinado.pdf'
    },
    {
      id: 'doc_04',
      nome: 'Edital Convocação AGE 11.08.2026 (Assinado)',
      categoria: 'Assembleias',
      dataUpload: '2026-07-23',
      tamanho: '181 KB',
      arquivo: 'assets/docs/EDITAL_AGE_11.08.2026_-_MODERN_LIFE_assinado.pdf'
    }
  ],

  recados: [
    {
      id: 'rec_01',
      titulo: 'Modernização da Iluminação das Áreas Comuns para LED',
      data: '2026-07-15',
      autor: 'Síndico Alessandro Cristiano da Silva',
      imagem: './assets/images/IMG_2909.JPG',
      resumo: 'Concluímos a substituição das lâmpadas da garagem e corredores por iluminação LED ecoeficiente, gerando redução estimada de 18% na conta de energia.',
      texto: 'Prezados moradores,\n\nÉ com satisfação que comunicamos a conclusão do projeto de eficiência energética do condomínio. Todas as lâmpadas fluorescentes dos subsolos, corredores e hall principal foram substituídas por painéis e refletores LED de alta durabilidade.\n\nEstimamos uma economia mensal de cerca de R$ 3.200,00 na fatura de energia elétrica, além de melhorar substancialmente a iluminação e segurança de nossas garagens.',
      comentarios: [
        { autor: 'Mariana Castro (Apt 84B)', data: '2026-07-15 14:30', texto: 'Excelente iniciativa! A iluminação da garagem ficou ótima!' }
      ]
    },
    {
      id: 'rec_02',
      titulo: 'Manutenção Preventiva das Bombas d\'Água e Reservatório',
      data: '2026-07-02',
      autor: 'Síndico Alessandro Cristiano da Silva',
      imagem: './assets/images/IMG_2930.jpg',
      resumo: 'Realizada higienização anual das caixas d\'água e revisão no sistema de recalque preventivo.',
      texto: 'Informamos a todos os moradores que realizamos com sucesso a limpeza e desinfecção periódica de ambos os reservatórios (superior e inferior), bem como o teste de estanqueidade e troca dos selos mecânicos das bombas.',
      comentarios: []
    }
  ],

  ocorrencias: [
    {
      id: 'oco_01',
      moradorNome: 'Mariana Castro',
      apartamento: '84B',
      categoria: 'Sugestão',
      assunto: 'Instalação de tomadas para veículos elétricos na garagem',
      descricao: 'Gostaria de sugerir que o condomínio avalie um estudo de viabilidade técnica para pontos de recarga individualizados no subsolo.',
      fotos: ['./assets/images/IMG_2955.jpg'],
      data: '2026-07-18',
      status: 'Em análise',
      respostaAdmin: 'Prezada Mariana, a administração já contratou um engenheiro eletricista para apresentar parecer técnico na próxima assembleia.'
    }
  ],

  agenda: [
    {
      id: 'evt_01',
      titulo: 'Assembleia Geral Extraordinária (AGE)',
      data: '2026-08-11',
      hora: '19:30',
      tipo: 'Assembleia',
      local: 'Salão de Festas Principal / Formato Híbrido',
      descricao: 'Deliberação sobre a aprovação das contas do 1º semestre e orçamento da reforma do playground.'
    },
    {
      id: 'evt_02',
      titulo: 'Manutenção Mensal dos Elevadores',
      data: '2026-07-28',
      hora: '08:00 - 12:00',
      tipo: 'Manutenção',
      local: 'Torre Principal',
      descricao: 'Interrupção alternada de 1 elevador social por vez para substituição preventiva de cabos.'
    }
  ],

  galeria: [
    { id: 'gal_01', titulo: 'Torre Modern Life Residence', categoria: 'Fachada', imagem: './assets/images/IMG_2956.jpg' },
    { id: 'gal_02', titulo: 'Fachada Principal & Entrada', categoria: 'Fachada', imagem: './assets/images/IMG_2909.JPG' },
    { id: 'gal_03', titulo: 'Vista Panorâmica da Entrada', categoria: 'Fachada', imagem: './assets/images/IMG_2930.jpg' },
    { id: 'gal_04', titulo: 'Praça de Acesso', categoria: 'Eventos', imagem: './assets/images/IMG_2955.jpg' }
  ],

  reservas: [
    {
      id: 'res_01',
      espaco: 'Salão de Festas',
      moradorNome: 'Mariana Castro',
      apartamento: '84B',
      data: '2026-08-15',
      status: 'Confirmada'
    }
  ]
};

class StoreEngine {
  constructor() {
    this.data = this.loadData();
    this.currentUser = this.loadUser();
    this.listeners = [];
  }

  loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    this.saveData(INITIAL_DATA);
    return INITIAL_DATA;
  }

  saveData(data) {
    this.data = data || this.data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {}
    this.notify();
  }

  loadUser() {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null; // Default to unauthenticated visitors so Access Gate is active by default
  }

  setCurrentUser(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l(this.data, this.currentUser));
  }

  addMorador(morador) {
    const newMorador = {
      id: 'usr_' + Date.now(),
      dataCadastro: new Date().toISOString().split('T')[0],
      status: 'Pendente',
      role: 'Morador',
      ...morador
    };
    this.data.moradores.push(newMorador);
    this.saveData();
    return newMorador;
  }

  updateMoradorStatus(id, newStatus) {
    const item = this.data.moradores.find(m => m.id === id);
    if (item) {
      item.status = newStatus;
      this.saveData();
    }
  }

  addOcorrencia(oco) {
    const newOco = {
      id: 'oco_' + Date.now(),
      data: new Date().toISOString().split('T')[0],
      status: 'Recebido',
      respostaAdmin: '',
      ...oco
    };
    this.data.ocorrencias.unshift(newOco);
    this.saveData();
    return newOco;
  }

  addRecado(post) {
    const newRecado = {
      id: 'rec_' + Date.now(),
      data: new Date().toISOString().split('T')[0],
      comentarios: [],
      ...post
    };
    this.data.recados.unshift(newRecado);
    this.saveData();
  }
}

window.CondoStore = new StoreEngine();
