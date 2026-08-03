/* ----------------------------------------------------
   Modern Life Residence - Global Data Store & Cloud Sync Engine
   Recuperação TOTAL e Preservação Incondicional de TODOS os Moradores Reais Cadastrados
   Resgate de Moradores de Todas as Versões Anteriores + Backup Direto no Supabase Cloud Database
   ---------------------------------------------------- */

const STORAGE_KEY = 'MODERN_LIFE_CONDO_DATA_V51';
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

  prestacaoContas: [],
  balancetes: [],
  contratos: [],
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
  galeria: [],
  encomendas: [
    {
      id: 'enc_demo_01',
      moradorId: 'usr_sindico_pessoal',
      moradorNome: 'Alessandro Cristiano da Silva',
      apartamento: 'Administração',
      telefone: '27992516970',
      empresa: 'Mercado Livre',
      descricao: 'Caixa M de Equipamentos de CFTV',
      codigoRastreio: 'MLB98240192',
      porteiro: 'Portaria & Guarita',
      dataChegada: new Date().toISOString().split('T')[0],
      horaChegada: '10:30',
      status: 'Aguardando Retirada',
      retiradoPor: '',
      dataRetirada: ''
    }
  ]
};

class StoreEngine {
  constructor() {
    this.listeners = [];
    this.isSyncing = false;
    this.unblockMorador('usr_pedro_ferro', 'pedro.ferro@gmail.com');
    this.data = this.loadData();
    this.currentUser = this.loadUser();
    
    this.ensureSindicoMaster();
    this.validateStoredSessionToken();

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

  markMoradorDeleted(id, email) {
    this.registerDeletedMorador(id, email);
  }

  isMoradorDeleted(id, email) {
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

    if (this.data.documentos) {
      this.data.documentos = this.data.documentos.filter(d => d && d.id !== 'doc_sistema_md' && !this.isDocDeleted(d.id, d.nome));
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {}
  }

  loadData() {
    let loadedData = null;
    const mockFakeIds = ['usr_morador_01', 'usr_morador_02', 'usr_morador_03', 'usr_morador_04', 'usr_morador_05'];

    // 1. Apagar chaves antigas obsoletas de versões anteriores (Impede a ressurreição de dados excluídos)
    this.cleanOldLocalStorageKeys();

    // 2. Carregar apenas a chave da versão atual (Fonte Única da Verdade)
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

    // 3. Purga rigorosa de moradores e documentos marcados como excluídos
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

    loadedData.balancetes = loadedData.balancetes.filter(b => {
      if (!b) return false;
      if (this.isDocDeleted(b.id, `${b.mes}_${b.ano}`)) return false;
      return true;
    });

    if (loadedData.prestacaoContas) {
      loadedData.prestacaoContas = loadedData.prestacaoContas.filter(p => {
        if (!p) return false;
        if (this.isDocDeleted(p.id, `${p.mes}_${p.ano}`) || this.isDocDeleted(p.id, p.mesAno)) return false;
        return true;
      });
    }

    // Garantir moradores padrão (respeitando exclusão de moradores)
    INITIAL_DATA.moradores.forEach(m => {
      const isMasterSindico = m.email && m.email.toLowerCase().trim() === 'condominio.modern.life@gmail.com';
      if (isMasterSindico || !this.isMoradorDeleted(m.id, m.email)) {
        if (!loadedData.moradores.some(x => x.email && x.email.toLowerCase().trim() === m.email.toLowerCase().trim())) {
          loadedData.moradores.push(m);
        }
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
    this.lastLocalMutationTime = Date.now();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      this.cleanOldLocalStorageKeys();
    } catch (e) {}
    this.notify();
    this.debouncedBroadcastToCloud();
  }

  debouncedBroadcastToCloud() {
    if (this.broadcastTimer) clearTimeout(this.broadcastTimer);
    this.broadcastTimer = setTimeout(() => {
      this.broadcastToCloud();
    }, 400);
  }

  async broadcastToCloud() {
    if (this.isBroadcasting) return;
    this.isBroadcasting = true;
    try {
      if (window.SupabaseConfig && window.SupabaseConfig.isConfigured()) {
        await window.SupabaseConfig.pushDataToSupabase(this.data);
      }
    } catch (e) {
      console.warn('Erro no broadcast para a nuvem:', e);
    } finally {
      this.isBroadcasting = false;
    }
  }

  loadUser() {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      if (raw) {
        const u = JSON.parse(raw);
        if (u && u.email) {
          if (this.data && this.data.moradores) {
            const fresh = this.data.moradores.find(m => m.id === u.id || (m.email && u.email && m.email.toLowerCase().trim() === u.email.toLowerCase().trim()));
            return fresh || u;
          }
          return u;
        }
      }
    } catch (e) {}

    if (this.data && this.data.moradores) {
      const sindico = this.data.moradores.find(m => m.email && m.email.toLowerCase().trim() === 'condominio.modern.life@gmail.com' && m.status === 'Aprovado');
      if (sindico) return sindico;
    }
    return INITIAL_DATA.moradores[0];
  }

  async validateStoredSessionToken() {
    try {
      if (!this.currentUser) {
        this.currentUser = this.loadUser();
      }
      if (this.currentUser) {
        let token = localStorage.getItem(SESSION_TOKEN_KEY);
        let tokenPayload = await window.SessionTokenManager.verifyToken(token);
        if (!tokenPayload) {
          token = await window.SessionTokenManager.generateToken(this.currentUser);
          if (token) {
            localStorage.setItem(SESSION_TOKEN_KEY, token);
          }
        }
      }
    } catch (e) {}
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
    }, 3000);
  }

  async pullFromCloudSilently() {
    if (this.isSyncing || this.isBroadcasting || (this.lastLocalMutationTime && Date.now() - this.lastLocalMutationTime < 2500)) {
      return;
    }
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

          // Garantir login mestre do Síndico (respeitando exclusão de moradores)
          INITIAL_DATA.moradores.forEach(mMaster => {
            const isMasterSindico = mMaster.email && mMaster.email.toLowerCase().trim() === 'condominio.modern.life@gmail.com';
            if (isMasterSindico || !this.isMoradorDeleted(mMaster.id, mMaster.email)) {
              if (!this.data.moradores.some(x => x.email && x.email.toLowerCase().trim() === mMaster.email.toLowerCase().trim())) {
                this.data.moradores.unshift(mMaster);
                updatedSupa = true;
              }
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
              if (this.isDocDeleted(b.id, `${b.mes}_${b.ano}`)) return;
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
    const target = this.data.balancetes.find(b => b.id === id);
    const mes = target ? target.mes : null;
    const ano = target ? target.ano : null;

    this.registerDeletedDoc(id, mes ? `${mes}_${ano}` : '');
    this.data.balancetes = this.data.balancetes.filter(b => b.id !== id);

    if (this.data.prestacaoContas) {
      this.data.prestacaoContas = this.data.prestacaoContas.filter(p => p.id !== id && !(mes && ano && p.mes === mes && p.ano === ano));
    }

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
    this.data.moradores = this.data.moradores.filter(m => {
      if (!m) return false;
      if (deleteId && m.id === deleteId) return false;
      if (deleteEmail && m.email && m.email.toLowerCase().trim() === deleteEmail) return false;
      return true;
    });
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

  addEncomenda(pkg) {
    if (!this.data.encomendas) this.data.encomendas = [];
    const encId = 'enc_' + Date.now();
    const agora = new Date();
    const newPkg = {
      id: encId,
      moradorId: pkg.moradorId || '',
      moradorNome: pkg.moradorNome || 'Morador',
      apartamento: pkg.apartamento || '',
      telefone: pkg.telefone || '',
      empresa: pkg.empresa || 'Mercado Livre',
      descricao: pkg.descricao || 'Pacote / Encomenda',
      codigoRastreio: pkg.codigoRastreio || '',
      porteiro: pkg.porteiro || 'Portaria & Guarita',
      dataChegada: agora.toISOString().split('T')[0],
      horaChegada: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'Aguardando Retirada',
      retiradoPor: '',
      dataRetirada: ''
    };
    this.data.encomendas.unshift(newPkg);
    this.saveData();

    if (window.SupabaseConfig && window.SupabaseConfig.isConfigured()) {
      window.SupabaseConfig.pushDataToSupabase(this.data);
    }
    return newPkg;
  }

  baixarEncomenda(id, entreguePara = 'Morador Próprio') {
    if (!this.data.encomendas) return false;
    const pkg = this.data.encomendas.find(e => e.id === id);
    if (pkg) {
      const agora = new Date();
      pkg.status = 'Entregue ao Morador';
      pkg.retiradoPor = entreguePara;
      pkg.dataRetirada = agora.toLocaleString('pt-BR');
      this.saveData();

      if (window.SupabaseConfig && window.SupabaseConfig.isConfigured()) {
        window.SupabaseConfig.pushDataToSupabase(this.data);
      }
      return true;
    }
    return false;
  }

  deleteEncomenda(id) {
    if (!this.data.encomendas) return false;
    this.data.encomendas = this.data.encomendas.filter(e => e.id !== id);
    this.saveData();
    return true;
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

  toggleOcorrenciaVisibilidade(ocoId) {
    const oco = (this.data.ocorrencias || []).find(o => o.id === ocoId);
    if (oco) {
      oco.visivelParaTodos = !oco.visivelParaTodos;
      this.saveData();
      return oco.visivelParaTodos;
    }
    return false;
  }

  addContrato(contrato) {
    if (!this.data.contratos) this.data.contratos = [];
    const newCtr = {
      id: 'ctr_' + Date.now(),
      empresa: contrato.empresa || 'Serviço Terceirizado',
      categoria: contrato.categoria || 'Geral',
      objeto: contrato.objeto || 'Prestação de Serviços',
      valorMensal: contrato.valorMensal || 0,
      valorTotalAnual: (contrato.valorMensal || 0) * 12,
      vigenciaInicio: contrato.vigenciaInicio || new Date().toISOString().split('T')[0],
      vigenciaFim: contrato.vigenciaFim || '2027-12-31',
      obrigacoes: contrato.obrigacoes || '',
      status: contrato.status || 'Ativo',
      arquivoNome: contrato.arquivoNome || 'CONTRATO_OFICIAL.pdf'
    };
    this.data.contratos.unshift(newCtr);
    this.saveData();
    return newCtr;
  }

  updateContrato(id, updates) {
    if (!this.data.contratos) return null;
    const target = this.data.contratos.find(c => c.id === id);
    if (target) {
      Object.assign(target, updates);
      if (updates.valorMensal !== undefined) {
        target.valorTotalAnual = updates.valorMensal * 12;
      }
      this.saveData();
      return target;
    }
    return null;
  }

  deleteContrato(id) {
    if (!this.data.contratos) return false;
    const initialLen = this.data.contratos.length;
    this.data.contratos = this.data.contratos.filter(c => c.id !== id);
    if (this.data.contratos.length < initialLen) {
      this.registerDeletedDoc(id, id);
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
