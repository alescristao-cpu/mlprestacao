/* ----------------------------------------------------
   Modern Life Residence - Global Data Store & Mock Data
   Síndico: Alessandro Cristiano da Silva
   Ocorrências Privadas (Reclamações, Elogios, Sugestões)
   ---------------------------------------------------- */

const STORAGE_KEY = 'MODERN_LIFE_CONDO_DATA_V6';
const CURRENT_USER_KEY = 'MODERN_LIFE_CURRENT_USER';

const INITIAL_DATA = {
  moradores: [
    {
      id: 'usr_sindico',
      nome: 'Alessandro Cristiano da Silva',
      apartamento: '152',
      bloco: 'A',
      cpf: '123.456.789-00',
      telefone: '(11) 98765-4321',
      email: 'condominio.modern.life@gmail.com',
      status: 'Aprovado',
      role: 'Administrador',
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
    }
  ],

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
      objeto: 'Manutenção Preventiva e Corretiva dos Elevadores',
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
      nome: 'Edital Convocação AGE 11.08.2026 (Assinado pelo Síndico Alessandro)',
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
      texto: 'Prezados moradores,\n\nÉ com satisfação que comunicamos a conclusão do projeto de eficiência energética do condomínio. Todas as lâmpadas fluorescentes dos subsolos, corredores e hall principal foram substituídas por painéis e refletores LED de alta durabilidade.',
      comentarios: []
    }
  ],

  // Ocorrências Estritamente Privadas (Reclamações, Elogios, Sugestões)
  ocorrencias: [
    {
      id: 'oco_01',
      moradorId: 'usr_02',
      moradorNome: 'Mariana Castro',
      moradorEmail: 'mariana.castro@gmail.com',
      apartamento: '84B',
      categoria: 'Sugestão',
      assunto: 'Instalação de tomadas para veículos elétricos na garagem',
      descricao: 'Gostaria de sugerir que o condomínio avalie um estudo de viabilidade técnica para pontos de recarga no subsolo.',
      data: '2026-07-18',
      status: 'Respondido pelo Síndico',
      respostas: [
        {
          autor: 'Síndico Alessandro Cristiano da Silva',
          data: '2026-07-19 10:15',
          texto: 'Prezada Mariana, recebemos sua sugestão com satisfação. Já contratamos um engenheiro eletricista para parecer técnico.'
        }
      ]
    },
    {
      id: 'oco_02',
      moradorId: 'usr_03',
      moradorNome: 'Roberto Almeida',
      moradorEmail: 'roberto.almeida@hotmail.com',
      apartamento: '121A',
      categoria: 'Elogio',
      assunto: 'Limpeza e manutenção da área da piscina',
      descricao: 'Parabéns à equipe de manutenção e limpeza da área da piscina no último final de semana.',
      data: '2026-07-20',
      status: 'Respondido pelo Síndico',
      respostas: [
        {
          autor: 'Síndico Alessandro Cristiano da Silva',
          data: '2026-07-20 14:00',
          texto: 'Obrigado pelo reconhecimento, Roberto! Repassarei o elogio à equipe de conservação.'
        }
      ]
    }
  ],

  agendaReservas: [
    {
      id: 'res_01',
      area: 'Piscina',
      data: '2026-07-28',
      horario: '10:00 às 11:00',
      moradorNome: 'Mariana Castro',
      status: 'Confirmado'
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
    }
  ],

  galeria: [
    { id: 'gal_01', titulo: 'Torre Modern Life Residence', categoria: 'Fachada', imagem: './assets/images/IMG_2956.jpg' }
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
    return null;
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

      if (this.currentUser && this.currentUser.id === id) {
        this.currentUser.status = newStatus;
        this.setCurrentUser(this.currentUser);
      }
    }
  }

  addOcorrencia(oco) {
    if (!this.data.ocorrencias) this.data.ocorrencias = [];
    const newOco = {
      id: 'oco_' + Date.now(),
      data: new Date().toISOString().split('T')[0],
      status: 'Enviado ao Síndico',
      respostas: [],
      ...oco
    };
    this.data.ocorrencias.unshift(newOco);
    this.saveData();
    return newOco;
  }

  addRespostaOcorrencia(ocoId, respostaTexto, autorNome) {
    const oco = (this.data.ocorrencias || []).find(o => o.id === ocoId);
    if (oco) {
      if (!oco.respostas) oco.respostas = [];
      oco.respostas.push({
        autor: autorNome || 'Síndico Alessandro',
        data: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
        texto: respostaTexto
      });
      oco.status = 'Respondido pelo Síndico';
      this.saveData();
      return true;
    }
    return false;
  }
}

window.CondoStore = new StoreEngine();
