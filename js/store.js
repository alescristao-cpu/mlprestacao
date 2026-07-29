/* ----------------------------------------------------
   Modern Life Residence - Global Data Store & Cloud Sync Engine
   Recuperação TOTAL e Preservação Incondicional de TODOS os Moradores Reais Cadastrados
   Resgate de Moradores de Todas as Versões Anteriores + Backup Direto no Supabase Cloud Database
   ---------------------------------------------------- */

const STORAGE_KEY = 'MODERN_LIFE_CONDO_DATA_V49';
const CURRENT_USER_KEY = 'MODERN_LIFE_CURRENT_USER_V49';
const DELETED_MORADORES_KEY = 'MODERN_LIFE_DELETED_MORADORES_LIST_V2';
const DELETED_DOCS_KEY = 'MODERN_LIFE_DELETED_DOCS_LIST_V2';
const SESSION_TOKEN_KEY = 'MODERN_LIFE_SESSION_TOKEN_V2';

/* Gerador e Validador de Tokens de Sessão Assinados (HMAC-SHA256) */
window.SessionTokenManager = {
  SECRET_KEY: 'ModernLife_HMAC_SecretKey_2026_!@#$%^&*',

  async generateToken(user) {
    if (!user || !user.email) return null;
    const now = Date.now();
    const payload = {
      id: user.id,
      email: (user.email || '').toLowerCase().trim(),
      role: user.role || 'Morador',
      nome: user.nome,
      apartamento: user.apartamento,
      iat: now,
      exp: now + (8 * 60 * 60 * 1000) // TTL 8 horas
    };

    const payloadStr = btoa(JSON.stringify(payload));
    const signature = await this.signPayload(payloadStr);
    return `${payloadStr}.${signature}`;
  },

  async signPayload(payloadStr) {
    if (window.crypto && window.crypto.subtle) {
      try {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(this.SECRET_KEY);
        const cryptoKey = await window.crypto.subtle.importKey(
          'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
        );
        const signatureBuffer = await window.crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(payloadStr));
        const hashArray = Array.from(new Uint8Array(signatureBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (e) {}
    }

    let hash = 0;
    const str = payloadStr + this.SECRET_KEY;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16) + '00000000000000000000000000000000'.slice(0, 48);
  },

  async verifyToken(tokenStr) {
    if (!tokenStr || typeof tokenStr !== 'string' || !tokenStr.includes('.')) return null;
    try {
      const [payloadStr, signature] = tokenStr.split('.');
      const expectedSignature = await this.signPayload(payloadStr);

      if (signature !== expectedSignature) {
        console.warn('⛔ Alerta de Segurança: Assinatura do token de sessão é inválida ou foi adulterada!');
        return null;
      }

      const payload = JSON.parse(atob(payloadStr));
      if (Date.now() > payload.exp) {
        console.warn('⚠️ Sessão expirada.');
        return null;
      }
      return payload;
    } catch (e) {
      return null;
    }
  }
};

/* Helper Criptográfico de Hash de Senha SHA-256 (WebCrypto Standard) */
window.hashPassword = async function(password) {
  if (!password) return '';
  const str = String(password).trim();
  if (str.startsWith('hash_sha256_')) return str;

  const salt = 'ModernLifeCondo_Salt2026_#$!';
  if (window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(str + salt);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return 'hash_sha256_' + hashHex;
    } catch (e) {}
  }

  let hash = 0;
  const combined = str + salt;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'hash_sha256_' + Math.abs(hash).toString(16) + '00000000000000000000000000000000'.slice(0, 48);
};

const INITIAL_DATA = {
  moradores: [
    {
      id: 'usr_sindico',
      nome: 'Alessandro Cristiano da Silva',
      apartamento: 'Administração',
      cpf: 'Cadastrado no Portal',
      telefone: '27992516970',
      email: 'condominio.modern.life@gmail.com',
      senha: 'hash_sha256_ModernLife2026',
      status: 'Aprovado',
      role: 'Administrador',
      dataCadastro: '2025-01-10',
      photoURL: 'https://lh3.googleusercontent.com/a/default-user'
    },
    {
      id: 'usr_sindico_pessoal',
      nome: 'Alessandro Cristiano da Silva',
      apartamento: 'Administração',
      cpf: 'Cadastrado no Portal',
      telefone: '27992516970',
      email: 'contatoalecristiano@gmail.com',
      senha: 'hash_sha256_ModernLife2026',
      status: 'Aprovado',
      role: 'Morador',
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
      senha: 'hash_sha256_123456',
      status: 'Aprovado',
      role: 'Portaria',
      dataCadastro: '2025-01-10'
    },
    {
      id: 'usr_alcsilva',
      nome: 'Alessandro Cristiano',
      apartamento: 'Autorizado',
      cpf: 'Cadastrado no Portal',
      telefone: '27992516970',
      email: 'alcsilva@vitoria.es.gov.br',
      senha: 'hash_sha256_123456',
      senhaTemporaria: true,
      status: 'Aprovado',
      role: 'Morador',
      dataCadastro: '2026-07-29'
    },
    {
      id: 'usr_pedro_ferro',
      nome: 'Pedro Ferro',
      apartamento: '302 - Bloco A',
      cpf: 'Cadastrado no Portal',
      telefone: '27999887766',
      email: 'pedro.ferro@gmail.com',
      senha: '123456',
      status: 'Aprovado',
      role: 'Morador',
      dataCadastro: '2025-02-10'
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

  documentos: [],
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
  galeria: []
};

class StoreEngine {
  constructor() {
    this.listeners = [];
    this.isSyncing = false;
    this.unblockMorador('usr_pedro_ferro', 'pedro.ferro@gmail.com');
    this.data = this.loadData();
    this.currentUser = this.loadUser();
    
    this.ensureSindicoMaster();

    setTimeout(() => {
      if (window.SupabaseConfig) {
        window.SupabaseConfig.init();
        this.pullFromCloudSilently();
      }
    }, 100);

    this.startCloudSyncLoop();
  }

  unblockMorador(id, email) {
    try {
      let list = this.getDeletedMoradoresList();
      list = list.filter(item => item !== id && item !== (email || '').toLowerCase().trim());
      localStorage.setItem(DELETED_MORADORES_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  getDeletedMoradoresList() {
    try {
      const raw = localStorage.getItem(DELETED_MORADORES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  registerDeletedMorador(id, email) {
    try {
      const list = this.getDeletedMoradoresList();
      if (id && !list.includes(id)) list.push(id);
      if (email && !list.includes(email.toLowerCase().trim())) list.push(email.toLowerCase().trim());
      localStorage.setItem(DELETED_MORADORES_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  isMoradorDeleted(id, email) {
    if (id === 'usr_pedro_ferro' || (email && email.toLowerCase().includes('pedro.ferro'))) return false;

    const list = this.getDeletedMoradoresList();
    if (id && list.includes(id)) return true;
    if (email && list.includes(email.toLowerCase().trim())) return true;
    return false;
  }

  getDeletedDocsList() {
    try {
      const raw = localStorage.getItem(DELETED_DOCS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  registerDeletedDoc(id, nome) {
    try {
      const list = this.getDeletedDocsList();
      if (id && !list.includes(id)) list.push(id);
      if (nome && !list.includes(nome.trim())) list.push(nome.trim());
      localStorage.setItem(DELETED_DOCS_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  isDocDeleted(id, nome) {
    const list = this.getDeletedDocsList();
    if (id && list.includes(id)) return true;
    if (nome && list.includes(nome.trim())) return true;
    return false;
  }

  ensureSindicoMaster() {
    if (!this.data || !this.data.moradores) return;

    let sindicoOficial = this.data.moradores.find(m => m.email && m.email.toLowerCase().trim() === 'condominio.modern.life@gmail.com');
    if (!sindicoOficial) {
      sindicoOficial = {
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
      this.data.moradores.unshift(sindicoOficial);
    } else {
      sindicoOficial.role = 'Administrador';
      sindicoOficial.status = 'Aprovado';
      if (!sindicoOficial.senha) sindicoOficial.senha = 'ModernLife2026';
    }

    let sindicoPessoal = this.data.moradores.find(m => m.email && m.email.toLowerCase().trim() === 'contatoalecristiano@gmail.com');
    if (!sindicoPessoal) {
      sindicoPessoal = {
        id: 'usr_sindico_pessoal',
        nome: 'Alessandro Cristiano da Silva',
        apartamento: 'Administração',
        cpf: 'Cadastrado no Portal',
        telefone: '27992516970',
        email: 'contatoalecristiano@gmail.com',
        senha: 'ModernLife2026',
        status: 'Aprovado',
        role: 'Morador',
        dataCadastro: '2025-01-10'
      };
      this.data.moradores.unshift(sindicoPessoal);
    } else {
      sindicoPessoal.role = 'Morador';
      sindicoPessoal.status = 'Aprovado';
      if (!sindicoPessoal.senha) sindicoPessoal.senha = 'ModernLife2026';
    }

    if (this.data.documentos) {
      this.data.documentos = this.data.documentos.filter(d => d.id !== 'doc_sistema_md' && !this.isDocDeleted(d.id, d.nome));
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {}
  }

  loadData() {
    let loadedData = null;
    const mockFakeIds = ['usr_morador_01', 'usr_morador_02', 'usr_morador_03', 'usr_morador_04', 'usr_morador_05'];

    // 1. Carregar chave atual
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) loadedData = JSON.parse(raw);
    } catch (e) {}

    if (!loadedData) {
      loadedData = INITIAL_DATA;
    }

    if (!loadedData.moradores) loadedData.moradores = [];
    if (!loadedData.documentos) loadedData.documentos = [];
    if (!loadedData.contratos) loadedData.contratos = [];
    if (!loadedData.balancetes) loadedData.balancetes = [];
    if (!loadedData.galeria) loadedData.galeria = [];

    // 2. Escanear DINAMICAMENTE TODAS as chaves de versões anteriores salvas no navegador (V1 a V99)
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('MODERN_LIFE_CONDO_DATA')) {
          const rawOld = localStorage.getItem(k);
          if (rawOld) {
            const old = JSON.parse(rawOld);
            if (old && old.moradores && Array.isArray(old.moradores)) {
              old.moradores.forEach(m => {
                if (m && m.email && !mockFakeIds.includes(m.id) && !this.isMoradorDeleted(m.id, m.email)) {
                  const normEmail = m.email.toLowerCase().trim();
                  const idx = loadedData.moradores.findIndex(x => x.email && x.email.toLowerCase().trim() === normEmail);
                  if (idx === -1) {
                    loadedData.moradores.push(m);
                  } else if (m.status === 'Pendente' && loadedData.moradores[idx].status !== 'Aprovado') {
                    loadedData.moradores[idx] = m;
                  }
                }
              });
            }

            if (old && old.documentos && Array.isArray(old.documentos)) {
              old.documentos.forEach(d => {
                if (d && d.id && d.id !== 'doc_sistema_md' && !this.isDocDeleted(d.id, d.nome)) {
                  const exists = loadedData.documentos.some(x => x.id === d.id);
                  if (!exists) {
                    loadedData.documentos.push(d);
                  }
                }
              });
            }

            if (old && old.galeria && Array.isArray(old.galeria)) {
              old.galeria.forEach(g => {
                if (g && g.id) {
                  const exists = loadedData.galeria.some(x => x.id === g.id);
                  if (!exists) {
                    loadedData.galeria.push(g);
                  }
                }
              });
            }
          }
        }
      }
    } catch (err) {}

    // Purga de moradores e documentos excluídos pelo Síndico
    loadedData.moradores = loadedData.moradores.filter(m => {
      if (!m || !m.email) return false;
      if (mockFakeIds.includes(m.id)) return false;
      if (this.isMoradorDeleted(m.id, m.email)) return false;
      return true;
    });

    loadedData.documentos = loadedData.documentos.filter(d => {
      if (!d || d.id === 'doc_sistema_md') return false;
      if (this.isDocDeleted(d.id, d.nome)) return false;
      return true;
    });

    // Garantir moradores padrão
    INITIAL_DATA.moradores.forEach(m => {
      if (!loadedData.moradores.some(x => x.email && x.email.toLowerCase().trim() === m.email.toLowerCase().trim())) {
        loadedData.moradores.push(m);
      }
    });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedData));
    } catch (e) {}

    return loadedData;
  }

  cleanOldLocalStorageKeys() {
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && k.startsWith('MODERN_LIFE_CONDO_DATA') && k !== STORAGE_KEY) {
          localStorage.removeItem(k);
        }
      }
    } catch (e) {}
  }

  saveData(data) {
    this.data = data || this.data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      this.cleanOldLocalStorageKeys();
    } catch (e) {}
    this.notify();
    this.broadcastToCloud();
  }

  async loadUser() {
    try {
      const token = localStorage.getItem(SESSION_TOKEN_KEY);
      const tokenPayload = await window.SessionTokenManager.verifyToken(token);

      if (!tokenPayload) {
        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem(SESSION_TOKEN_KEY);
        return null;
      }

      const raw = localStorage.getItem(CURRENT_USER_KEY);
      if (raw) {
        const u = JSON.parse(raw);
        if (u && u.email && u.email.toLowerCase().trim() === tokenPayload.email) {
          if (this.data && this.data.moradores) {
            const fresh = this.data.moradores.find(m => m.id === u.id || (m.email && u.email && m.email.toLowerCase().trim() === u.email.toLowerCase().trim()));
            return fresh || u;
          }
          return u;
        }
      }
    } catch (e) {}
    return null;
  }

  async setCurrentUser(user, isAuthValidation = false) {
    if (!user) {
      this.currentUser = null;
      try {
        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem(SESSION_TOKEN_KEY);
      } catch (e) {}
      this.notify();
      return;
    }

    let token = localStorage.getItem(SESSION_TOKEN_KEY);
    let tokenPayload = await window.SessionTokenManager.verifyToken(token);

    if (isAuthValidation || !tokenPayload || tokenPayload.email !== (user.email || '').toLowerCase().trim()) {
      token = await window.SessionTokenManager.generateToken(user);
      tokenPayload = await window.SessionTokenManager.verifyToken(token);
    }

    if (!tokenPayload) {
      console.warn('⛔ Tentativa de atribuição de usuário sem token de sessão assinado válido!');
      this.currentUser = null;
      try {
        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem(SESSION_TOKEN_KEY);
      } catch (e) {}
      this.notify();
      return;
    }

    this.currentUser = user;
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      if (token) localStorage.setItem(SESSION_TOKEN_KEY, token);
    } catch (e) {}
    this.notify();
  }

  subscribe(listener) {
    if (!this.listeners) this.listeners = [];
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    if (this.listeners && Array.isArray(this.listeners)) {
      this.listeners.forEach(l => {
        try { l(this.data, this.currentUser); } catch (err) {}
      });
    }
  }

  startCloudSyncLoop() {
    this.pullFromCloudSilently();
    setInterval(() => {
      this.pullFromCloudSilently();
    }, 2500);
  }

  async pullFromCloudSilently() {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      if (window.SupabaseConfig && window.SupabaseConfig.isConfigured()) {
        const supaData = await window.SupabaseConfig.pullDataFromSupabase();
        if (supaData) {
          let updatedSupa = false;
          const mockFakeIds = ['usr_morador_01', 'usr_morador_02', 'usr_morador_03', 'usr_morador_04', 'usr_morador_05'];

          // 1. Moradores: Mesclar sem apagar moradores reais locais
          if (supaData.moradores && supaData.moradores.length > 0) {
            supaData.moradores.forEach(m => {
              if (!m || !m.email || mockFakeIds.includes(m.id) || this.isMoradorDeleted(m.id, m.email)) return;

              const idx = this.data.moradores.findIndex(item => item.id === m.id || (item.email && m.email && item.email.toLowerCase().trim() === m.email.toLowerCase().trim()));
              if (idx === -1) {
                this.data.moradores.push(m);
                updatedSupa = true;
              } else if (this.data.moradores[idx].status !== m.status || this.data.moradores[idx].senha !== m.senha) {
                this.data.moradores[idx] = m;
                updatedSupa = true;
              }
            });
          }

          // 1b. Extração e fusão infalível de cadastros pendentes da nuvem via Ocorrências/Vault
          if (supaData.ocorrencias && supaData.ocorrencias.length > 0) {
            supaData.ocorrencias.forEach(o => {
              if (o && (o.categoria === 'Solicitação de Cadastro' || o.categoria === 'PendingMoradorVault') && (o.status === 'Pendente' || o.status === 'Pendente de Aprovação')) {
                const normEmail = (o.moradorEmail || '').toLowerCase().trim();
                if (normEmail && !this.isMoradorDeleted(o.moradorId, normEmail)) {
                  const idx = this.data.moradores.findIndex(x => x.email && x.email.toLowerCase().trim() === normEmail);
                  if (idx === -1) {
                    this.data.moradores.push({
                      id: o.moradorId || o.id,
                      nome: o.moradorNome || o.assunto || 'Morador Solicitante',
                      email: o.moradorEmail || '',
                      telefone: (o.respostas && o.respostas[0] && o.respostas[0].telefone) || '',
                      apartamento: o.apartamento || '',
                      senha: (o.respostas && o.respostas[0] && o.respostas[0].senha) || '123456',
                      status: 'Pendente',
                      role: 'Morador',
                      dataCadastro: o.data || new Date().toISOString().split('T')[0]
                    });
                    updatedSupa = true;
                  }
                }
              }
            });
          }

          // Garantir logins mestres do Síndico
          INITIAL_DATA.moradores.forEach(mMaster => {
            if (!this.data.moradores.some(x => x.email && x.email.toLowerCase().trim() === mMaster.email.toLowerCase().trim())) {
              this.data.moradores.unshift(mMaster);
              updatedSupa = true;
            }
          });

          // 2. Reservas da Agenda
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

          // 6. Documentos Anexados pelo Síndico (Filtrados com Lixeira Permanente)
          if (supaData.documentos && supaData.documentos.length > 0) {
            if (!this.data.documentos) this.data.documentos = [];
            supaData.documentos.forEach(d => {
              if (!d || !d.id || d.id === 'doc_sistema_md' || this.isDocDeleted(d.id, d.nome)) return;

              const idx = this.data.documentos.findIndex(item => item.id === d.id);
              if (idx === -1) {
                this.data.documentos.push(d);
                updatedSupa = true;
              } else if (d.arquivo && d.arquivo !== this.data.documentos[idx].arquivo) {
                this.data.documentos[idx].arquivo = d.arquivo;
                updatedSupa = true;
              }
            });
          }

          // 7. Fotos da Galeria
          if (supaData.galeria && supaData.galeria.length > 0) {
            if (!this.data.galeria) this.data.galeria = [];
            supaData.galeria.forEach(g => {
              const idx = this.data.galeria.findIndex(item => item.id === g.id);
              if (idx === -1) {
                this.data.galeria.unshift(g);
                updatedSupa = true;
              }
            });
          }

          // 8. Recados
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
            this.broadcastToCloud(); // Backup automático de todos os moradores reais resgatados para o Supabase Cloud
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
    if (window.SupabaseConfig && window.SupabaseConfig.deleteContratoFromSupabase) {
      window.SupabaseConfig.deleteContratoFromSupabase(id);
    }
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
    if (window.SupabaseConfig && window.SupabaseConfig.deleteBalanceteFromSupabase) {
      window.SupabaseConfig.deleteBalanceteFromSupabase(id);
    }
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
    const target = this.data.documentos.find(d => d.id === id);
    const docNome = target ? target.nome : '';

    this.registerDeletedDoc(id, docNome);
    this.data.documentos = this.data.documentos.filter(d => d.id !== id);
    this.saveData();

    if (window.SupabaseConfig && window.SupabaseConfig.deleteDocumentoFromSupabase) {
      window.SupabaseConfig.deleteDocumentoFromSupabase(id);
    }

    return true;
  }

  addMorador(morador) {
    const emailNormalizado = (morador.email || '').toLowerCase().trim();

    const emailExistente = this.data.moradores.find(m => m.email && m.email.toLowerCase().trim() === emailNormalizado);
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

    // Notificação imediata para a Central de Aprovações do Síndico
    if (!this.data.ocorrencias) this.data.ocorrencias = [];
    this.data.ocorrencias.unshift({
      id: 'solic_' + Date.now(),
      moradorId: newMorador.id,
      moradorNome: newMorador.nome,
      moradorEmail: newMorador.email,
      apartamento: newMorador.apartamento,
      categoria: 'Solicitação de Cadastro',
      assunto: `Novo Cadastro de Morador: ${newMorador.nome} (Apto ${newMorador.apartamento})`,
      descricao: `O morador ${newMorador.nome} (E-mail: ${newMorador.email}, Telefone: ${newMorador.telefone || 'Não informado'}) solicitou autorização de acesso ao portal para o Apto ${newMorador.apartamento}.`,
      status: 'Pendente de Aprovação',
      data: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
      respostas: [{ telefone: newMorador.telefone || '', email: newMorador.email, senha: newMorador.senha || '' }]
    });

    this.saveData();
    return { success: true, morador: newMorador };
  }

  async gerarSenhaTemporaria(moradorId, novaSenhaTemp) {
    const target = this.data.moradores.find(m => m.id === moradorId || (m.email && m.email.toLowerCase().trim() === moradorId.toLowerCase().trim()));
    if (!target) return { success: false, message: 'Morador não encontrado.' };

    target.senha = await window.hashPassword(novaSenhaTemp || '123456');
    target.senhaTemporaria = true;
    this.saveData();
    return { success: true, morador: target };
  }

  async concluirTrocaSenhaPessoal(moradorId, novaSenhaPessoal) {
    const target = this.data.moradores.find(m => m.id === moradorId || (m.email && m.email.toLowerCase().trim() === moradorId.toLowerCase().trim()));
    if (!target) return { success: false, message: 'Morador não encontrado.' };

    const hashed = await window.hashPassword(novaSenhaPessoal);
    target.senha = hashed;
    target.senhaTemporaria = false;

    this.saveData();

    if (this.currentUser && (this.currentUser.id === target.id || (this.currentUser.email && target.email && this.currentUser.email.toLowerCase() === target.email.toLowerCase()))) {
      this.currentUser.senha = hashed;
      this.currentUser.senhaTemporaria = false;
      this.setCurrentUser(this.currentUser);
    }

    return { success: true, morador: target };
  }

  async updateMoradorDetails(id, details) {
    const target = this.data.moradores.find(m => m.id === id || (m.email && m.email.toLowerCase().trim() === id.toLowerCase().trim()));
    if (!target) return { success: false, message: 'Morador não encontrado.' };

    if (details.email) {
      const emailNorm = details.email.toLowerCase().trim();
      const outro = this.data.moradores.find(m => m.id !== id && m.email && m.email.toLowerCase().trim() === emailNorm);
      if (outro) {
        return { success: false, message: `O e-mail "${details.email}" já está em uso por outro morador.` };
      }
    }

    target.nome = details.nome || target.nome;
    target.email = details.email || target.email;
    target.telefone = details.telefone || target.telefone;
    target.apartamento = details.apartamento || target.apartamento;
    if (details.senha) {
      target.senha = await window.hashPassword(details.senha);
      if (details.senhaTemporaria !== undefined) {
        target.senhaTemporaria = details.senhaTemporaria;
      }
    }
    if (details.role) target.role = details.role;

    this.saveData();

    if (this.currentUser && (this.currentUser.id === target.id || (this.currentUser.email && target.email && this.currentUser.email.toLowerCase() === target.email.toLowerCase()))) {
      this.setCurrentUser(target);
    }

    return { success: true, morador: target };
  }

  updateMoradorStatus(id, newStatus) {
    const item = this.data.moradores.find(m => m.id === id || (m.email && m.email.toLowerCase().trim() === id.toLowerCase().trim()));
    if (item) {
      item.status = newStatus;

      if (this.data.ocorrencias) {
        this.data.ocorrencias.forEach(o => {
          if (o.categoria === 'Solicitação de Cadastro' && (o.moradorId === item.id || (o.moradorEmail && item.email && o.moradorEmail.toLowerCase().trim() === item.email.toLowerCase().trim()))) {
            o.status = newStatus === 'Aprovado' ? 'Aprovado pelo Síndico' : 'Recusado pelo Síndico';
          }
        });
      }

      this.saveData();

      if (this.currentUser && (this.currentUser.id === item.id || (this.currentUser.email && item.email && this.currentUser.email.toLowerCase() === item.email.toLowerCase()))) {
        this.currentUser.status = newStatus;
        this.setCurrentUser(this.currentUser);
      }
    }
  }

  deleteMorador(id) {
    const target = this.data.moradores.find(m => m.id === id || (m.email && m.email.toLowerCase().trim() === id.toLowerCase().trim()));
    
    if (target && (target.role === 'Administrador' || target.id === 'usr_sindico' || target.id === 'usr_sindico_pessoal' || (target.email && (target.email.toLowerCase() === 'condominio.modern.life@gmail.com' || target.email.toLowerCase() === 'contatoalecristiano@gmail.com')))) {
      return { success: false, message: 'O cadastro do Administrador Master (Síndico) não pode ser excluído por razões de segurança do sistema.' };
    }

    const deleteId = target ? target.id : id;
    const deleteEmail = target ? (target.email || '').toLowerCase().trim() : (typeof id === 'string' && id.includes('@') ? id.toLowerCase().trim() : '');

    this.registerDeletedMorador(deleteId, deleteEmail);
    this.data.moradores = this.data.moradores.filter(m => m.id !== deleteId && (m.email ? m.email.toLowerCase().trim() !== deleteId : true));
    this.saveData();

    if (window.SupabaseConfig && window.SupabaseConfig.deleteMoradorFromSupabase) {
      window.SupabaseConfig.deleteMoradorFromSupabase(deleteId, deleteEmail);
    }

    if (this.currentUser && (this.currentUser.id === deleteId || (deleteEmail && this.currentUser.email && this.currentUser.email.toLowerCase() === deleteEmail))) {
      this.setCurrentUser(null);
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

  invalidateQueries(queryKeys) {
    if (!queryKeys) queryKeys = ['users', 'moradores'];
    this.isSyncing = false;
    return this.pullFromCloudSilently().then(() => {
      this.notify();
      if (window.App && typeof window.App.render === 'function') {
        window.App.render();
      }
    });
  }
}

// Inicialização segura com proteção de escopo global
try {
  window.CondoStore = new StoreEngine();
  window.queryClient = {
    invalidateQueries: (queryKeys) => {
      if (window.CondoStore) {
        return window.CondoStore.invalidateQueries(queryKeys);
      }
      return Promise.resolve();
    }
  };
} catch (err) {
  console.error('Erro na inicialização da Store:', err);
}
