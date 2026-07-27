/* ----------------------------------------------------
   Modern Life Residence - Supabase Integration Engine
   Conexão Oficial com Projeto Supabase: lqguxjtczcxbnraoklem
   ---------------------------------------------------- */

window.SupabaseConfig = {
  url: localStorage.getItem('MODERN_LIFE_SUPABASE_URL') || 'https://lqguxjtczcxbnraoklem.supabase.co',
  anonKey: localStorage.getItem('MODERN_LIFE_SUPABASE_KEY') || '',
  client: null,

  init() {
    if (this.url && this.anonKey && window.supabase) {
      try {
        this.client = window.supabase.createClient(this.url, this.anonKey);
        console.log('⚡ Conexão Supabase inicializada com sucesso!');
        this.subscribeRealtime();
      } catch (err) {
        console.error('Erro ao inicializar Supabase:', err);
      }
    }
  },

  saveCredentials(url, key) {
    this.url = url.trim() || 'https://lqguxjtczcxbnraoklem.supabase.co';
    this.anonKey = key.trim();
    localStorage.setItem('MODERN_LIFE_SUPABASE_URL', this.url);
    localStorage.setItem('MODERN_LIFE_SUPABASE_KEY', this.anonKey);
    this.init();
  },

  isConfigured() {
    return !!(this.client);
  },

  async pushDataToSupabase(data) {
    if (!this.client) return;

    try {
      // 1. Sincronizar Moradores
      if (data.moradores && data.moradores.length > 0) {
        const rows = data.moradores.map(m => ({
          id: m.id,
          nome: m.nome,
          email: m.email,
          senha: m.senha,
          telefone: m.telefone,
          apartamento: m.apartamento,
          role: m.role || 'Morador',
          status: m.status || 'Pendente',
          senha_temporaria: !!m.senhaTemporaria,
          data_cadastro: m.dataCadastro || new Date().toISOString().split('T')[0]
        }));
        await this.client.from('moradores').upsert(rows, { onConflict: 'id' });
      }

      // 2. Sincronizar Reservas
      if (data.agendaReservas && data.agendaReservas.length > 0) {
        const rowsRes = data.agendaReservas.map(r => ({
          id: r.id,
          area: r.area,
          data: r.data,
          horario: r.horario,
          morador_nome: r.moradorNome,
          apartamento: r.apartamento,
          email: r.email,
          observacao: r.observacao || '',
          status: r.status || 'Confirmado'
        }));
        await this.client.from('reservas').upsert(rowsRes, { onConflict: 'id' });
      }

      // 3. Sincronizar Ocorrências / Mensagens
      if (data.ocorrencias && data.ocorrencias.length > 0) {
        const rowsOco = data.ocorrencias.map(o => ({
          id: o.id,
          morador_id: o.moradorId || '',
          morador_nome: o.moradorNome || '',
          morador_email: o.moradorEmail || '',
          apartamento: o.apartamento || '',
          categoria: o.categoria || 'Canal Direto',
          assunto: o.assunto || '',
          descricao: o.descricao || '',
          status: o.status || 'Enviado ao Síndico',
          respostas: o.respostas || [],
          data: o.data || new Date().toLocaleString('pt-BR')
        }));
        await this.client.from('ocorrencias').upsert(rowsOco, { onConflict: 'id' });
      }
    } catch (e) {
      console.warn('Sincronização Supabase:', e);
    }
  },

  async pullDataFromSupabase() {
    if (!this.client) return null;

    try {
      const resMoradores = await this.client.from('moradores').select('*');
      const resReservas = await this.client.from('reservas').select('*');
      const resOcorrencias = await this.client.from('ocorrencias').select('*');

      return {
        moradores: resMoradores.data ? resMoradores.data.map(m => ({
          id: m.id,
          nome: m.nome,
          email: m.email,
          senha: m.senha,
          telefone: m.telefone,
          apartamento: m.apartamento,
          role: m.role,
          status: m.status,
          senhaTemporaria: m.senha_temporaria,
          dataCadastro: m.data_cadastro
        })) : [],

        reservas: resReservas.data ? resReservas.data.map(r => ({
          id: r.id,
          area: r.area,
          data: r.data,
          horario: r.horario,
          moradorNome: r.morador_nome,
          apartamento: r.apartamento,
          email: r.email,
          observacao: r.observacao,
          status: r.status
        })) : [],

        ocorrencias: resOcorrencias.data ? resOcorrencias.data.map(o => ({
          id: o.id,
          moradorId: o.morador_id,
          moradorNome: o.morador_nome,
          moradorEmail: o.morador_email,
          apartamento: o.apartamento,
          categoria: o.categoria,
          assunto: o.assunto,
          descricao: o.descricao,
          status: o.status,
          respostas: o.respostas || [],
          data: o.data
        })) : []
      };
    } catch (e) {
      console.warn('Erro ao puxar dados do Supabase:', e);
      return null;
    }
  },

  subscribeRealtime() {
    if (!this.client) return;

    try {
      this.client.channel('public:moradores')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'moradores' }, () => {
          if (window.CondoStore) window.CondoStore.pullFromCloudSilently();
        })
        .subscribe();

      this.client.channel('public:reservas')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'reservas' }, () => {
          if (window.CondoStore) window.CondoStore.pullFromCloudSilently();
        })
        .subscribe();

      this.client.channel('public:ocorrencias')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'ocorrencias' }, () => {
          if (window.CondoStore) window.CondoStore.pullFromCloudSilently();
        })
        .subscribe();
    } catch (e) {}
  }
};
