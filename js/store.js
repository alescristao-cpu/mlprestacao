/* ----------------------------------------------------
   Modern Life Residence - Global Data Store & Cloud Sync Engine
   Suporte Completo a Gestão e Visibilidade por Perfil de Documentos
   ---------------------------------------------------- */

const STORAGE_KEY = 'MODERN_LIFE_CONDO_DATA_V34';
const CURRENT_USER_KEY = 'MODERN_LIFE_CURRENT_USER_V34';

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
    }
  ],

  prestacaoContas: [
    {
      id: 'pc_2026_05',
      mesAno: 'Maio 2026',
      mes: 5,
      ano: 2026,
      saldoInicial: 498438.09,
      receitas: 90351.01,
      despesas: 69866.77,
      saldoAtual: 518922.33,
      status: 'Auditado & Aprovado',
      receitasDetalhadas: [
        { categoria: 'Taxa de Condomínio', valor: 53017.98 },
        { categoria: 'Fundo de Reserva', valor: 2612.57 },
        { categoria: 'Água (Consumo Individual)', valor: 7787.45 },
        { categoria: 'Gás (Consumo Individual)', valor: 2164.37 },
        { categoria: 'Taxa Extra / Obras', valor: 19055.25 },
        { categoria: 'Rendimentos de Aplicações', valor: 3797.93 },
        { categoria: 'Salão de Festas / Churrasqueiras', valor: 502.78 },
        { categoria: 'Energia Áreas Comuns', valor: 419.58 }
      ],
      categoriasDespesa: [
        { nome: 'Mão de Obra Terceirizada (Portaria & Limpeza Geral)', valor: 28933.49 },
        { nome: 'Consumo de Água & Esgoto', valor: 9404.63 },
        { nome: 'Consumo de Gás Encanado', valor: 2592.73 },
        { nome: 'Manutenção de Elevadores', valor: 1050.00 },
        { nome: 'Manutenção de Piscina', valor: 435.00 },
        { nome: 'Jardinagem & Conservação Verde', valor: 365.00 },
        { nome: 'Manutenção de CFTV, Portão & Interfonia', valor: 485.00 },
        { nome: 'Limpeza, Desinsetização & Reservatórios', valor: 200.00 },
        { nome: 'Reposição de Peças de Elevadores & Equipamentos', valor: 1425.57 },
        { nome: 'Compras de Materiais de Limpeza', valor: 1125.30 },
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
      saldoAtual: 518922.33
    }
  ],

  contratos: [
    {
      id: 'ctr_01',
      empresa: 'Manutenção de Elevadores',
      objeto: 'Manutenção Preventiva e Corretiva dos Elevadores da Torre',
      valorMensal: 1050.00,
      vigenciaInicio: '2025-01-01',
      vigenciaFim: '2027-01-01',
      status: 'Ativo'
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

    // Remover doc_sistema_md de qualquer cache se existir
    if (this.data.documentos) {
      this.data.documentos = this.data.documentos.filter(d => d.id !== 'doc_sistema_md');
    }

    this.saveData();
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
