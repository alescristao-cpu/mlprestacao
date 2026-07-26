/* ----------------------------------------------------
   Modern Life Residence - Global Data Store & Engine
   Validação Anti-Duplicidade & Edição de Moradores pelo Síndico
   ---------------------------------------------------- */

const STORAGE_KEY = 'MODERN_LIFE_CONDO_DATA_V13';
const CURRENT_USER_KEY = 'MODERN_LIFE_CURRENT_USER_V13';

const INITIAL_DATA = {
  moradores: [
    {
      id: 'usr_sindico',
      nome: 'Alessandro Cristiano da Silva',
      apartamento: 'Administração',
      cpf: 'Cadastrado no Portal',
      telefone: '(11) 98765-4321',
      email: 'condominio.modern.life@gmail.com',
      status: 'Aprovado',
      role: 'Administrador',
      dataCadastro: '2025-01-10',
      photoURL: 'https://lh3.googleusercontent.com/a/default-user'
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
        { nome: 'Impostos & Retenções (ISS, Imposto Unificado)', valor: 4305.34 },
        { nome: 'Energia Elétrica Áreas Comuns', valor: 413.63 },
        { nome: 'Telefone, Internet & CFTV', valor: 163.42 }
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

  /**
   * Validação Anti-Duplicidade:
   * Bloqueia cadastros com o mesmo e-mail ou com todos os campos (nome, email, telefone, unidade) idênticos.
   */
  addMorador(morador) {
    const emailNormalizado = (morador.email || '').toLowerCase().trim();

    // 1. Bloqueia e-mail duplicado
    const emailExistente = this.data.moradores.find(m => m.email.toLowerCase().trim() === emailNormalizado);
    if (emailExistente) {
      return { 
        success: false, 
        message: `O e-mail "${morador.email}" já está cadastrado no sistema para o morador ${emailExistente.nome} (Apto ${emailExistente.apartamento}).` 
      };
    }

    // 2. Bloqueia cadastro onde TODOS os 4 campos (Nome, E-mail, Telefone, Unidade) são exatamente iguais
    const duplicadoExato = this.data.moradores.find(m => 
      m.nome.toLowerCase().trim() === morador.nome.toLowerCase().trim() &&
      m.email.toLowerCase().trim() === emailNormalizado &&
      (m.telefone || '').trim() === (morador.telefone || '').trim() &&
      m.apartamento.trim() === morador.apartamento.trim()
    );

    if (duplicadoExato) {
      return { 
        success: false, 
        message: 'Já existe um cadastro idêntico com este mesmo Nome, E-mail, Telefone e Unidade.' 
      };
    }

    const newMorador = {
      id: 'usr_' + Date.now(),
      dataCadastro: new Date().toISOString().split('T')[0],
      status: 'Pendente',
      role: 'Morador',
      ...morador
    };

    this.data.moradores.push(newMorador);
    this.saveData();
    return { success: true, morador: newMorador };
  }

  updateMoradorDetails(id, details) {
    const target = this.data.moradores.find(m => m.id === id);
    if (!target) return { success: false, message: 'Morador não encontrado.' };

    // Verifica se novo e-mail colide com outro morador
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

    this.saveData();

    if (this.currentUser && this.currentUser.id === id) {
      this.setCurrentUser(target);
    }

    return { success: true, morador: target };
  }

  updateMoradorStatus(id, newStatus) {
    const item = this.data.moradores.find(m => m.id === id);
    if (item) {
      item.status = newStatus;
      this.saveData();

      if (this.currentUser && (this.currentUser.id === id || this.currentUser.email.toLowerCase() === item.email.toLowerCase())) {
        this.currentUser.status = newStatus;
        this.setCurrentUser(this.currentUser);
      }
    }
  }

  deleteMorador(id) {
    const target = this.data.moradores.find(m => m.id === id);
    
    if (target && (target.role === 'Administrador' || target.id === 'usr_sindico' || target.email.toLowerCase() === 'condominio.modern.life@gmail.com')) {
      return { success: false, message: 'O cadastro do Administrador Master (Síndico) não pode ser excluído por razões de segurança do sistema.' };
    }

    this.data.moradores = this.data.moradores.filter(m => m.id !== id);

    if (this.currentUser && (this.currentUser.id === id || (target && this.currentUser.email.toLowerCase() === target.email.toLowerCase()))) {
      this.setCurrentUser(null);
    } else {
      this.saveData();
    }

    return { success: true };
  }

  addAgendamento(reserva) {
    if (!this.data.agendaReservas) this.data.agendaReservas = [];
    const newReserva = {
      id: 'res_' + Date.now(),
      status: 'Confirmado',
      ...reserva
    };
    this.data.agendaReservas.unshift(newReserva);
    this.saveData();
    return newReserva;
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
