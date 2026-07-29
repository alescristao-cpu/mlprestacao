/* ----------------------------------------------------
   Modern Life Residence - Global Data Store & Cloud Sync Engine
   Recuperação Automática de Cadastros + Preservação de Dados de Moradores
   Sincronização Cloud Completa (Moradores, Reservas, Ocorrências, Balancetes, Contratos, Documentos e Recados)
   ---------------------------------------------------- */

const STORAGE_KEY = 'MODERN_LIFE_CONDO_DATA_V37';
const CURRENT_USER_KEY = 'MODERN_LIFE_CURRENT_USER_V37';

const INITIAL_DATA = {
  moradores: [
    {
      id: 'usr_sindico',
      nome: 'Alessandro Cristiano da Silva',
      apartamento: 'Administração',
      cpf: 'Cadastrado no Portal',
      telefone: '27992516970',
      email: 'condominio.modern.life@gmail.com',
      senha: 'ModernLife2026',
      status: 'Aprovado',
      role: 'Administrador',
      dataCadastro: '2025-01-10',
      photoURL: 'https://lh3.googleusercontent.com/a/default-user'
    },
    {
      id: 'usr_portaria',
      nome: 'Portaria & Guarita',
      apartamento: 'Guarita',
      cpf: 'Portaria Condomínio',
      telefone: '27999999999',
      email: 'portaria.modern.life@gmail.com',
      senha: '123456',
      status: 'Aprovado',
      role: 'Portaria',
      dataCadastro: '2025-01-10'
    },
    {
      id: 'usr_morador_01',
      nome: 'Carlos Eduardo Santos',
      apartamento: '101 - Bloco A',
      cpf: '123.456.789-00',
      telefone: '27998887766',
      email: 'carlos.santos@gmail.com',
      senha: '123456',
      status: 'Aprovado',
      role: 'Morador',
      dataCadastro: '2025-02-01'
    },
    {
      id: 'usr_morador_02',
      nome: 'Mariana Oliveira Costa',
      apartamento: '202 - Bloco A',
      cpf: '234.567.890-11',
      telefone: '27997776655',
      email: 'mariana.costa@gmail.com',
      senha: '123456',
      status: 'Aprovado',
      role: 'Morador',
      dataCadastro: '2025-02-05'
    },
    {
      id: 'usr_morador_03',
      nome: 'Roberto Mendes Ferreira',
      apartamento: '304 - Bloco B',
      cpf: '345.678.901-22',
      telefone: '27996665544',
      email: 'roberto.mendes@gmail.com',
      senha: '123456',
      status: 'Aprovado',
      role: 'Morador',
      dataCadastro: '2025-02-10'
    },
    {
      id: 'usr_morador_04',
      nome: 'Juliana Alencar Lima',
      apartamento: '402 - Bloco B',
      cpf: '456.789.012-33',
      telefone: '27995554433',
      email: 'juliana.alencar@gmail.com',
      senha: '123456',
      status: 'Aprovado',
      role: 'Morador',
      dataCadastro: '2025-02-15'
    },
    {
      id: 'usr_morador_05',
      nome: 'Patricia Vasconcelos',
      apartamento: '501 - Bloco B',
      cpf: '567.890.123-44',
      telefone: '27994443322',
      email: 'patricia.v@gmail.com',
      senha: '123456',
      status: 'Pendente',
      role: 'Morador',
      dataCadastro: '2025-03-01'
    }
  ],

  prestacaoContas: [
    {
      id: 'pc_2026_05',
      mesAno: 'Maio 2026',
      mes: 'Maio',
      ano: 2026,
      saldoInicial: 498438.09,
      receitas: 90351.01,
      despesas: 69866.77,
      saldoAtual: 518922.33,
      status: 'Aprovado',
      receitasDetalhadas: [
        { categoria: 'Taxa de Condomínio Ordinária', valor: 53017.98 },
        { categoria: 'Fundo de Reserva Regulamentar', valor: 2612.57 },
        { categoria: 'Água & Esgoto (Leitura Individual)', valor: 7787.45 },
        { categoria: 'Gás Encanado (Consumo Individual)', valor: 2164.37 },
        { categoria: 'Taxa Extra / Obras Aprovadas', valor: 19055.25 },
        { categoria: 'Rendimentos de Aplicações Financeiras', valor: 3797.93 },
        { categoria: 'Uso de Salão de Festas & Churrasqueiras', valor: 502.78 },
        { categoria: 'Energia Áreas Comuns', valor: 419.58 }
      ],
      categoriasDespesa: [
        { nome: 'Mão de Obra Terceirizada (Portaria & Limpeza Geral)', valor: 28933.49 },
        { nome: 'Consumo de Água & Esgoto Concessionária', valor: 9404.63 },
        { nome: 'Consumo de Gás Encanado', valor: 2592.73 },
        { nome: 'Manutenção Preventiva de Elevadores', valor: 1050.00 },
        { nome: 'Manutenção de Piscina & Produtos', valor: 435.00 },
        { nome: 'Jardinagem & Conservação Verde', valor: 365.00 },
        { nome: 'Manutenção de CFTV, Portão & Interfonia', valor: 485.00 },
        { nome: 'Limpeza, Desinsetização & Reservatórios', valor: 200.00 },
        { nome: 'Reposição de Peças de Elevadores & Equipamentos', valor: 1425.57 },
        { nome: 'Compras de Materiais de Limpeza & Insumos', valor: 1125.30 },
        { nome: 'Honorários de Gestão Administrativa & Contábil', valor: 2450.03 },
        { nome: 'Seguro Predial e Placas Solares', valor: 1512.95 },
        { nome: 'Impostos & Retenções (ISS, Imposto Unificado)', valor: 4305.34 }
      ]
    }
  ],

  balancetes: [
    {
      id: 'bal_2026_05',
      titulo: 'Demonstrativo Consolidado - Maio 2026',
      ano: 2026,
      mes: 'Maio',
      dataPublicacao: '2026-05-31',
      receitaBruta: 90351.01,
      despesaBruta: 69866.77,
      saldoAnterior: 498438.09,
      saldoMes: 20484.24,
      saldoAtual: 518922.33,
      categoriasDespesa: [
        { nome: 'Mão de Obra Terceirizada (Portaria & Limpeza)', valor: 28933.49, corGradiente: 'linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)', corSolida: '#3B82F6' },
        { nome: 'Consumo de Água & Esgoto', valor: 9404.63, corGradiente: 'linear-gradient(90deg, #14B8A6 0%, #2DD4BF 100%)', corSolida: '#14B8A6' },
        { nome: 'Consumo de Gás Encanado', valor: 2592.73, corGradiente: 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)', corSolida: '#F59E0B' },
        { nome: 'Manutenção de Elevadores & CFTV', valor: 1535.00, corGradiente: 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)', corSolida: '#8B5CF6' },
        { nome: 'Honorários de Gestão & Contábil', valor: 2450.03, corGradiente: 'linear-gradient(90deg, #6366F1 0%, #818CF8 100%)', corSolida: '#6366F1' },
        { nome: 'Seguro Predial & Placas Solares', valor: 1512.95, corGradiente: 'linear-gradient(90deg, #0284C7 0%, #38BDF8 100%)', corSolida: '#0284C7' },
        { nome: 'Impostos & Retenções Tributárias', valor: 4305.34, corGradiente: 'linear-gradient(90deg, #EC4899 0%, #F472B6 100%)', corSolida: '#EC4899' },
        { nome: 'Manutenção Predial & Materiais', valor: 1912.60, corGradiente: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)', corSolida: '#10B981' }
      ]
    }
  ],

  contratos: [
    {
      id: 'ctr_01',
      empresa: 'Manutenção de Elevadores',
      categoria: 'Elevadores',
      objeto: 'Manutenção Preventiva e Corretiva dos Elevadores Sociais e de Serviço da Torre',
      valorMensal: 1050.00,
      valorTotalAnual: 12600.00,
      vigenciaInicio: '2025-01-01',
      vigenciaFim: '2027-01-01',
      obrigacoes: 'Atendimento de emergência 24h em até 30 minutos, substituição de peças originais, vistoria preventiva mensal com laudo técnico e manutenção do sistema de resgate de passageiros.',
      status: 'Ativo',
      arquivoNome: 'CONTRATO_MANUTENCAO_ELEVADORES.pdf'
    },
    {
      id: 'ctr_02',
      empresa: 'Portaria & Limpeza Terceirizada',
      categoria: 'Portaria & Limpeza',
      objeto: 'Prestação de Serviços Terceirizados de Portaria 24h, Ronda e Limpeza Predial',
      valorMensal: 28933.49,
      valorTotalAnual: 347201.88,
      vigenciaInicio: '2024-09-01',
      vigenciaFim: '2026-09-01',
      obrigacoes: 'Escala 12x36, cobertura imediata de faltas em até 2h, auditoria mensal de crachás de visitantes, fornecimento de uniformes, EPIs e treinamento contínuo de segurança.',
      status: 'A Vencer',
      arquivoNome: 'CONTRATO_PORTARIA_E_LIMPEZA.pdf'
    },
    {
      id: 'ctr_03',
      empresa: 'Manutenção de Piscinas & Paisagismo',
      categoria: 'Piscina & Verde',
      objeto: 'Manutenção Química e Física da Piscina e Conservação dos Jardins Comuns',
      valorMensal: 800.00,
      valorTotalAnual: 9600.00,
      vigenciaInicio: '2025-03-01',
      vigenciaFim: '2027-03-01',
      obrigacoes: 'Tratamento de água com cloro 3x por semana, verificação de parâmetros de pH e alcalinidade, podas mensais de paisagismo e controle fitossanitário das plantas.',
      status: 'Ativo',
      arquivoNome: 'CONTRATO_PISCINAS_E_JARDINS.pdf'
    },
    {
      id: 'ctr_04',
      empresa: 'Assessoria Contábil & Gestão',
      categoria: 'Administração & Contábil',
      objeto: 'Assessoria Contábil, Jurídica, Cobrança de Inadimplência e Folha de Pagamento',
      valorMensal: 2450.03,
      valorTotalAnual: 29400.36,
      vigenciaInicio: '2025-01-01',
      vigenciaFim: '2027-01-01',
      obrigacoes: 'Emissão de boletos bancários com código PIX, balancete mensal auditável, certidões negativas tributárias e representação jurídica em assembleias de moradores.',
      status: 'Ativo',
      arquivoNome: 'CONTRATO_ASSESSORIA_CONTABIL.pdf'
    }
  ],

  documentos: [
    {
      id: 'doc_01',
      nome: 'Convenção do Condomínio Modern Life Residence',
      categoria: 'Convenção',
      visibilidade: 'Moradores',
      dataUpload: '2024-01-15',
      tamanho: '4.2 MB',
      arquivo: 'assets/docs/EDITAL_AGE_11.08.2026_-_MODERN_LIFE_assinado.pdf'
    }
  ],

  recados: [
    {
      id: 'rec_01',
      titulo: 'Modernização da Iluminação das Áreas Comuns para LED',
      data: '2026-07-15',
      autor: 'Síndico Alessandro Cristiano da Silva',
      visibilidade: 'Publico',
      imagem: './assets/images/IMG_2909.JPG',
      resumo: 'Concluímos a substituição das lâmpadas da garagem por iluminação LED ecoeficiente.',
      texto: 'Prezados moradores,\n\nÉ com satisfação que comunicamos a conclusão do projeto de eficiência energética do condomínio.'
    }
  ],

  ocorrencias: [],
  agendaReservas: [],
  agenda: [
    {
      id: 'evt_01',
      titulo: 'Assembleia Geral Extraordinária (AGE)',
      data: '2026-08-11',
      hora: '19:30',
      tipo: 'Assembleia',
      local: 'Salão de Festas Principal / Formato Híbrido',
      descricao: 'Deliberação sobre a aprovação das contas do 1º semestre.'
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
    this.isSyncing = false;
    
    this.ensureSindicoMaster();

    setTimeout(() => {
      if (window.SupabaseConfig) {
        window.SupabaseConfig.init();
        this.pullFromCloudSilently();
      }
    }, 150);

    this.startCloudSyncLoop();
  }

  ensureSindicoMaster() {
    let sindico = this.data.moradores.find(m => m.email.toLowerCase().trim() === 'condominio.modern.life@gmail.com');
    if (!sindico) {
      sindico = {
        id: 'usr_sindico',
        nome: 'Alessandro Cristiano da Silva',
        apartamento: 'Administração',
        cpf: 'Cadastrado no Portal',
        telefone: '27992516970',
        email: 'condominio.modern.life@gmail.com',
        senha: 'ModernLife2026',
        status: 'Aprovado',
        role: 'Administrador',
        dataCadastro: '2025-01-10'
      };
      this.data.moradores.unshift(sindico);
    } else {
      sindico.role = 'Administrador';
      sindico.status = 'Aprovado';
      if (!sindico.senha) sindico.senha = 'ModernLife2026';
    }

    if (this.data.documentos) {
      this.data.documentos = this.data.documentos.filter(d => d.id !== 'doc_sistema_md');
    }

    this.saveData();
  }

  loadData() {
    let loadedData = null;

    // 1. Tentar chave atual V37
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) loadedData = JSON.parse(raw);
    } catch (e) {}

    // 2. Escanear e mesclar de todas as chaves legadas anteriores para nunca perder moradores
    const legacyKeys = [
      'MODERN_LIFE_CONDO_DATA_V36',
      'MODERN_LIFE_CONDO_DATA_V35',
      'MODERN_LIFE_CONDO_DATA_V34',
      'MODERN_LIFE_CONDO_DATA_V33',
      'MODERN_LIFE_CONDO_DATA_V32',
      'MODERN_LIFE_CONDO_DATA_V31',
      'MODERN_LIFE_CONDO_DATA_V30',
      'MODERN_LIFE_CONDO_DATA_V2'
    ];

    legacyKeys.forEach(k => {
      try {
        const rawOld = localStorage.getItem(k);
        if (rawOld) {
          const old = JSON.parse(rawOld);
          if (old && old.moradores && old.moradores.length > 0) {
            if (!loadedData) {
              loadedData = old;
            } else {
              // Resgata e mescla moradores antigos que não estejam na lista
              old.moradores.forEach(m => {
                if (!loadedData.moradores.some(x => x.email.toLowerCase().trim() === m.email.toLowerCase().trim())) {
                  loadedData.moradores.push(m);
                }
              });
            }
          }
        }
      } catch (err) {}
    });

    if (!loadedData) {
      loadedData = INITIAL_DATA;
    }

    // 3. Garantir que os moradores padrão da INITIAL_DATA estejam todos presentes
    INITIAL_DATA.moradores.forEach(m => {
      if (!loadedData.moradores.some(x => x.email.toLowerCase().trim() === m.email.toLowerCase().trim())) {
        loadedData.moradores.push(m);
      }
    });

    this.saveData(loadedData);
    return loadedData;
  }

  saveData(data) {
    this.data = data || this.data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {}
    this.notify();
    this.broadcastToCloud();
  }

  loadUser() {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      if (raw) {
        const u = JSON.parse(raw);
        const fresh = this.data.moradores.find(m => m.id === u.id || m.email.toLowerCase() === u.email.toLowerCase());
        return fresh || u;
      }
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

  startCloudSyncLoop() {
    this.pullFromCloudSilently();
    setInterval(() => {
      this.pullFromCloudSilently();
    }, 3000);
  }

  async pullFromCloudSilently() {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      if (window.SupabaseConfig && window.SupabaseConfig.isConfigured()) {
        const supaData = await window.SupabaseConfig.pullDataFromSupabase();
        if (supaData) {
          let updatedSupa = false;

          // 1. Moradores - Preservação e Mesclagem Total
          if (supaData.moradores && supaData.moradores.length > 0) {
            supaData.moradores.forEach(m => {
              const idx = this.data.moradores.findIndex(item => item.id === m.id || item.email.toLowerCase().trim() === m.email.toLowerCase().trim());
              if (idx === -1) {
                this.data.moradores.push(m);
                updatedSupa = true;
              } else if (this.data.moradores[idx].status !== m.status || this.data.moradores[idx].senha !== m.senha) {
                this.data.moradores[idx] = m;
                updatedSupa = true;
              }
            });
          }

          // 2. Reservas
          if (supaData.reservas && supaData.reservas.length > 0) {
            if (!this.data.agendaReservas) this.data.agendaReservas = [];
            supaData.reservas.forEach(r => {
              const idx = this.data.agendaReservas.findIndex(item => item.id === r.id);
              if (idx === -1) {
                this.data.agendaReservas.unshift(r);
                updatedSupa = true;
              } else if (this.data.agendaReservas[idx].status !== r.status) {
                this.data.agendaReservas[idx] = r;
                updatedSupa = true;
              }
            });
          }

          // 3. Ocorrências
          if (supaData.ocorrencias && supaData.ocorrencias.length > 0) {
            if (!this.data.ocorrencias) this.data.ocorrencias = [];
            supaData.ocorrencias.forEach(o => {
              const idx = this.data.ocorrencias.findIndex(item => item.id === o.id);
              if (idx === -1) {
                this.data.ocorrencias.unshift(o);
                updatedSupa = true;
              } else if (this.data.ocorrencias[idx].status !== o.status || (o.respostas && o.respostas.length !== (this.data.ocorrencias[idx].respostas || []).length)) {
                this.data.ocorrencias[idx] = o;
                updatedSupa = true;
              }
            });
          }

          // 4. Balancetes
          if (supaData.balancetes && supaData.balancetes.length > 0) {
            if (!this.data.balancetes) this.data.balancetes = [];
            supaData.balancetes.forEach(b => {
              const idx = this.data.balancetes.findIndex(item => item.id === b.id || (item.mes === b.mes && item.ano === b.ano));
              if (idx === -1) {
                this.data.balancetes.unshift(b);
                updatedSupa = true;
              }
            });
          }

          // 5. Contratos
          if (supaData.contratos && supaData.contratos.length > 0) {
            if (!this.data.contratos) this.data.contratos = [];
            supaData.contratos.forEach(c => {
              const idx = this.data.contratos.findIndex(item => item.id === c.id || item.empresa === c.empresa);
              if (idx === -1) {
                this.data.contratos.unshift(c);
                updatedSupa = true;
              }
            });
          }

          // 6. Documentos
          if (supaData.documentos && supaData.documentos.length > 0) {
            if (!this.data.documentos) this.data.documentos = [];
            supaData.documentos.forEach(d => {
              const idx = this.data.documentos.findIndex(item => item.id === d.id);
              if (idx === -1) {
                this.data.documentos.unshift(d);
                updatedSupa = true;
              }
            });
          }

          // 7. Recados
          if (supaData.recados && supaData.recados.length > 0) {
            if (!this.data.recados) this.data.recados = [];
            supaData.recados.forEach(r => {
              const idx = this.data.recados.findIndex(item => item.id === r.id);
              if (idx === -1) {
                this.data.recados.unshift(r);
                updatedSupa = true;
              } else if (this.data.recados[idx].titulo !== r.titulo || this.data.recados[idx].imagem !== r.imagem) {
                this.data.recados[idx] = r;
                updatedSupa = true;
              }
            });
          }

          if (updatedSupa) {
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data)); } catch (e) {}
            this.notify();
          }
        }
      }
    } catch (e) {
    } finally {
      this.isSyncing = false;
    }
  }

  async broadcastToCloud() {
    if (window.SupabaseConfig && window.SupabaseConfig.isConfigured()) {
      window.SupabaseConfig.pushDataToSupabase(this.data);
    }
  }

  addContrato(contrato) {
    if (!this.data.contratos) this.data.contratos = [];
    const newCtr = {
      id: 'ctr_' + Date.now(),
      status: contrato.status || 'Ativo',
      valorTotalAnual: (contrato.valorMensal || 0) * 12,
      ...contrato
    };
    this.data.contratos.unshift(newCtr);
    this.saveData();
    return newCtr;
  }

  deleteContrato(id) {
    if (!this.data.contratos) return false;
    this.data.contratos = this.data.contratos.filter(c => c.id !== id);
    this.saveData();
    return true;
  }

  addBalancete(balancete) {
    if (!this.data.balancetes) this.data.balancetes = [];
    const newBal = {
      id: 'bal_' + Date.now(),
      dataPublicacao: new Date().toISOString().split('T')[0],
      ...balancete
    };

    const existingIdx = this.data.balancetes.findIndex(b => b.mes === newBal.mes && b.ano === newBal.ano);
    if (existingIdx !== -1) {
      this.data.balancetes[existingIdx] = newBal;
    } else {
      this.data.balancetes.unshift(newBal);
    }

    if (!this.data.prestacaoContas) this.data.prestacaoContas = [];
    const pcIdx = this.data.prestacaoContas.findIndex(p => p.mes === newBal.mes && p.ano === newBal.ano);
    
    const newPc = {
      id: 'pc_' + Date.now(),
      mesAno: `${newBal.mes} ${newBal.ano}`,
      mes: newBal.mes,
      ano: newBal.ano,
      saldoInicial: newBal.saldoAnterior || 0,
      receitas: newBal.receitaBruta || 0,
      despesas: newBal.despesaBruta || 0,
      saldoAtual: newBal.saldoAtual || 0,
      status: 'Aprovado',
      receitasDetalhadas: [
        { categoria: 'Taxa de Condomínio Ordinária', valor: Math.round(newBal.receitaBruta * 0.65 * 100) / 100 },
        { categoria: 'Fundo de Reserva Regulamentar', valor: Math.round(newBal.receitaBruta * 0.05 * 100) / 100 },
        { categoria: 'Água & Esgoto (Leitura Individual)', valor: Math.round(newBal.receitaBruta * 0.10 * 100) / 100 },
        { categoria: 'Gás Encanado (Consumo Individual)', valor: Math.round(newBal.receitaBruta * 0.04 * 100) / 100 },
        { categoria: 'Taxa Extra / Obras Aprovadas', valor: Math.round(newBal.receitaBruta * 0.12 * 100) / 100 },
        { categoria: 'Rendimentos de Aplicações Financeiras', valor: Math.round(newBal.receitaBruta * 0.04 * 100) / 100 }
      ],
      categoriasDespesa: (newBal.categoriasDespesa || []).map(c => ({ nome: c.nome, valor: c.valor }))
    };

    if (pcIdx !== -1) {
      this.data.prestacaoContas[pcIdx] = newPc;
    } else {
      this.data.prestacaoContas.unshift(newPc);
    }

    if (window.PrestacaoComponent) {
      window.PrestacaoComponent.selectedPeriodIndex = 0;
    }

    this.saveData();
    return newBal;
  }

  deleteBalancete(id) {
    if (!this.data.balancetes) return false;
    this.data.balancetes = this.data.balancetes.filter(b => b.id !== id);
    this.saveData();
    return true;
  }

  addDocumento(doc) {
    if (!this.data.documentos) this.data.documentos = [];
    const newDoc = {
      id: 'doc_' + Date.now(),
      dataUpload: new Date().toISOString().split('T')[0],
      tamanho: doc.tamanho || '1.5 MB',
      visibilidade: doc.visibilidade || 'Moradores',
      ...doc
    };

    this.data.documentos.unshift(newDoc);
    this.saveData();
    return newDoc;
  }

  deleteDocumento(id) {
    if (!this.data.documentos) return false;
    this.data.documentos = this.data.documentos.filter(d => d.id !== id);
    this.saveData();
    return true;
  }

  addMorador(morador) {
    const emailNormalizado = (morador.email || '').toLowerCase().trim();

    const emailExistente = this.data.moradores.find(m => m.email.toLowerCase().trim() === emailNormalizado);
    if (emailExistente) {
      return { 
        success: false, 
        message: `O e-mail "${morador.email}" já está cadastrado no sistema para o morador ${emailExistente.nome} (Apto ${emailExistente.apartamento}).` 
      };
    }

    const newMorador = {
      id: 'usr_' + Date.now(),
      dataCadastro: new Date().toISOString().split('T')[0],
      status: 'Pendente',
      role: morador.role || 'Morador',
      senha: morador.senha || '123456',
      senhaTemporaria: false,
      ...morador
    };

    this.data.moradores.push(newMorador);
    this.saveData();
    return { success: true, morador: newMorador };
  }

  gerarSenhaTemporaria(moradorId, novaSenhaTemp) {
    const target = this.data.moradores.find(m => m.id === moradorId || m.email.toLowerCase().trim() === moradorId.toLowerCase().trim());
    if (!target) return { success: false, message: 'Morador não encontrado.' };

    target.senha = novaSenhaTemp;
    target.senhaTemporaria = true;
    this.saveData();
    return { success: true, morador: target };
  }

  concluirTrocaSenhaPessoal(moradorId, novaSenhaPessoal) {
    const target = this.data.moradores.find(m => m.id === moradorId || m.email.toLowerCase().trim() === moradorId.toLowerCase().trim());
    if (!target) return { success: false, message: 'Morador não encontrado.' };

    target.senha = novaSenhaPessoal;
    target.senhaTemporaria = false;

    this.saveData();

    if (this.currentUser && (this.currentUser.id === target.id || this.currentUser.email.toLowerCase() === target.email.toLowerCase())) {
      this.currentUser.senha = novaSenhaPessoal;
      this.currentUser.senhaTemporaria = false;
      this.setCurrentUser(this.currentUser);
    }

    return { success: true, morador: target };
  }

  updateMoradorDetails(id, details) {
    const target = this.data.moradores.find(m => m.id === id || m.email.toLowerCase().trim() === id.toLowerCase().trim());
    if (!target) return { success: false, message: 'Morador não encontrado.' };

    if (details.email) {
      const emailNorm = details.email.toLowerCase().trim();
      const outro = this.data.moradores.find(m => m.id !== id && m.email.toLowerCase().trim() === emailNorm);
      if (outro) {
        return { success: false, message: `O e-mail "${details.email}" já está em uso por outro morador.` };
      }
    }

    target.nome = details.nome || target.nome;
    target.email = details.email || target.email;
    target.telefone = details.telefone || target.telefone;
    target.apartamento = details.apartamento || target.apartamento;
    if (details.senha) {
      target.senha = details.senha;
      if (details.senhaTemporaria !== undefined) {
        target.senhaTemporaria = details.senhaTemporaria;
      }
    }
    if (details.role) target.role = details.role;

    this.saveData();

    if (this.currentUser && (this.currentUser.id === target.id || this.currentUser.email.toLowerCase() === target.email.toLowerCase())) {
      this.setCurrentUser(target);
    }

    return { success: true, morador: target };
  }

  updateMoradorStatus(id, newStatus) {
    const item = this.data.moradores.find(m => m.id === id || m.email.toLowerCase().trim() === id.toLowerCase().trim());
    if (item) {
      item.status = newStatus;
      this.saveData();

      if (this.currentUser && (this.currentUser.id === item.id || this.currentUser.email.toLowerCase() === item.email.toLowerCase())) {
        this.currentUser.status = newStatus;
        this.setCurrentUser(this.currentUser);
      }
    }
  }

  deleteMorador(id) {
    const target = this.data.moradores.find(m => m.id === id || m.email.toLowerCase().trim() === id.toLowerCase().trim());
    
    if (target && (target.role === 'Administrador' || target.id === 'usr_sindico' || target.email.toLowerCase() === 'condominio.modern.life@gmail.com')) {
      return { success: false, message: 'O cadastro do Administrador Master (Síndico) não pode ser excluído por razões de segurança do sistema.' };
    }

    const deleteId = target ? target.id : id;

    this.data.moradores = this.data.moradores.filter(m => m.id !== deleteId && m.email.toLowerCase() !== deleteId.toLowerCase());

    if (this.currentUser && (this.currentUser.id === deleteId || (target && this.currentUser.email.toLowerCase() === target.email.toLowerCase()))) {
      this.setCurrentUser(null);
    } else {
      this.saveData();
    }

    return { success: true };
  }

  addAgendamento(reserva) {
    if (!this.data.agendaReservas) this.data.agendaReservas = [];
    const resId = 'res_' + Date.now();
    const newReserva = {
      id: resId,
      status: 'Confirmado',
      observacao: '',
      ...reserva
    };
    this.data.agendaReservas.unshift(newReserva);
    this.saveData();
    return newReserva;
  }

  updateReservaStatus(id, newStatus, observacao = '') {
    const r = (this.data.agendaReservas || []).find(item => item.id === id);
    if (r) {
      if (newStatus) r.status = newStatus;
      if (observacao) r.observacao = observacao;
      this.saveData();
      return true;
    }
    return false;
  }

  deleteReserva(id) {
    if (!this.data.agendaReservas) return false;
    this.data.agendaReservas = this.data.agendaReservas.filter(r => r.id !== id);
    this.saveData();
    return true;
  }

  addOcorrencia(oco) {
    if (!this.data.ocorrencias) this.data.ocorrencias = [];
    const newOco = {
      id: 'oco_' + Date.now(),
      data: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
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
