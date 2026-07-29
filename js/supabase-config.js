/* ----------------------------------------------------
   Modern Life Residence - Supabase Integration Engine
   Conexão Oficial com Projeto Supabase: lqguxjtczcxbnraoklem
   Sincronização 100% Completa Cloud de Todos os Materiais e Arquivos do Site
   ---------------------------------------------------- */

window.SupabaseConfig = {
  url: localStorage.getItem('MODERN_LIFE_SUPABASE_URL') || 'https://lqguxjtczcxbnraoklem.supabase.co',
  anonKey: localStorage.getItem('MODERN_LIFE_SUPABASE_KEY') || 'sb_publishable_Oq01uGaW-flwj1qCHTiWMQ_2GL6cnH4',
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
    this.anonKey = key.trim() || 'sb_publishable_Oq01uGaW-flwj1qCHTiWMQ_2GL6cnH4';
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
        await this.client.from('moradores').upsert(rows, { onConflict: 'id' }).catch(() => {});
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
        await this.client.from('reservas').upsert(rowsRes, { onConflict: 'id' }).catch(() => {});
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
        await this.client.from('ocorrencias').upsert(rowsOco, { onConflict: 'id' }).catch(() => {});
      }

      // 4. Sincronizar Balancetes
      if (data.balancetes && data.balancetes.length > 0) {
        const rowsBal = data.balancetes.map(b => ({
          id: b.id,
          titulo: b.titulo || '',
          mes: b.mes || '',
          ano: b.ano || 2026,
          receita_bruta: b.receitaBruta || 0,
          despesa_bruta: b.despesaBruta || 0,
          saldo_anterior: b.saldoAnterior || 0,
          saldo_mes: b.saldoMes || 0,
          saldo_atual: b.saldoAtual || 0,
          categorias_despesa: b.categoriasDespesa || [],
          data_publicacao: b.dataPublicacao || new Date().toISOString().split('T')[0]
        }));
        await this.client.from('balancetes').upsert(rowsBal, { onConflict: 'id' }).catch(() => {});
      }

      // 5. Sincronizar Contratos
      if (data.contratos && data.contratos.length > 0) {
        const rowsCtr = data.contratos.map(c => ({
          id: c.id,
          empresa: c.empresa || '',
          categoria: c.categoria || '',
          objeto: c.objeto || '',
          valor_mensal: c.valorMensal || 0,
          valor_total_anual: c.valorTotalAnual || 0,
          vigencia_inicio: c.vigenciaInicio || '',
          vigencia_fim: c.vigenciaFim || '',
          obrigacoes: c.obrigacoes || '',
          status: c.status || 'Ativo',
          arquivo_nome: c.arquivoNome || ''
        }));
        await this.client.from('contratos').upsert(rowsCtr, { onConflict: 'id' }).catch(() => {});
      }

      // 6. Sincronizar Documentos
      if (data.documentos && data.documentos.length > 0) {
        const rowsDoc = data.documentos.map(d => ({
          id: d.id,
          nome: d.nome || '',
          categoria: d.categoria || '',
          visibilidade: d.visibilidade || 'Moradores',
          tamanho: d.tamanho || '',
          arquivo: d.arquivo || '',
          data_upload: d.dataUpload || new Date().toISOString().split('T')[0]
        }));
        await this.client.from('documentos').upsert(rowsDoc, { onConflict: 'id' }).catch(() => {});
      }

      // 7. Sincronizar Recados
      if (data.recados && data.recados.length > 0) {
        const rowsRec = data.recados.map(r => ({
          id: r.id,
          titulo: r.titulo || '',
          data: r.data || new Date().toISOString().split('T')[0],
          autor: r.autor || 'Síndico',
          visibilidade: r.visibilidade || 'Publico',
          imagem: r.imagem || '',
          resumo: r.resumo || '',
          texto: r.texto || ''
        }));
        await this.client.from('recados').upsert(rowsRec, { onConflict: 'id' }).catch(() => {});
      }

    } catch (e) {
      console.warn('Sincronização Supabase:', e);
    }
  },

  async pullDataFromSupabase() {
    if (!this.client) return null;

    try {
      const resMoradores = await this.client.from('moradores').select('*').catch(() => ({ data: null }));
      const resReservas = await this.client.from('reservas').select('*').catch(() => ({ data: null }));
      const resOcorrencias = await this.client.from('ocorrencias').select('*').catch(() => ({ data: null }));
      const resBalancetes = await this.client.from('balancetes').select('*').catch(() => ({ data: null }));
      const resContratos = await this.client.from('contratos').select('*').catch(() => ({ data: null }));
      const resDocumentos = await this.client.from('documentos').select('*').catch(() => ({ data: null }));
      const resRecados = await this.client.from('recados').select('*').catch(() => ({ data: null }));

      return {
        moradores: resMoradores && resMoradores.data ? resMoradores.data.map(m => ({
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
        })) : null,

        reservas: resReservas && resReservas.data ? resReservas.data.map(r => ({
          id: r.id,
          area: r.area,
          data: r.data,
          horario: r.horario,
          moradorNome: r.morador_nome,
          apartamento: r.apartamento,
          email: r.email,
          observacao: r.observacao,
          status: r.status
        })) : null,

        ocorrencias: resOcorrencias && resOcorrencias.data ? resOcorrencias.data.map(o => ({
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
        })) : null,

        balancetes: resBalancetes && resBalancetes.data ? resBalancetes.data.map(b => ({
          id: b.id,
          titulo: b.titulo,
          mes: b.mes,
          ano: b.ano,
          receitaBruta: b.receita_bruta,
          despesaBruta: b.despesa_bruta,
          saldoAnterior: b.saldo_anterior,
          saldoMes: b.saldo_mes,
          saldoAtual: b.saldo_atual,
          categoriasDespesa: b.categorias_despesa || [],
          dataPublicacao: b.data_publicacao
        })) : null,

        contratos: resContratos && resContratos.data ? resContratos.data.map(c => ({
          id: c.id,
          empresa: c.empresa,
          categoria: c.categoria,
          objeto: c.objeto,
          valorMensal: c.valor_mensal,
          valorTotalAnual: c.valor_total_anual,
          vigenciaInicio: c.vigencia_inicio,
          vigenciaFim: c.vigencia_fim,
          obrigacoes: c.obrigacoes,
          status: c.status,
          arquivoNome: c.arquivo_nome
        })) : null,

        documentos: resDocumentos && resDocumentos.data ? resDocumentos.data.map(d => ({
          id: d.id,
          nome: d.nome,
          categoria: d.categoria,
          visibilidade: d.visibilidade,
          tamanho: d.tamanho,
          arquivo: d.arquivo,
          dataUpload: d.data_upload
        })) : null,

        recados: resRecados && resRecados.data ? resRecados.data.map(r => ({
          id: r.id,
          titulo: r.titulo,
          data: r.data,
          autor: r.autor,
          visibilidade: r.visibilidade,
          imagem: r.imagem,
          resumo: r.resumo,
          texto: r.texto
        })) : null
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

      this.client.channel('public:balancetes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'balancetes' }, () => {
          if (window.CondoStore) window.CondoStore.pullFromCloudSilently();
        })
        .subscribe();

      this.client.channel('public:contratos')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'contratos' }, () => {
          if (window.CondoStore) window.CondoStore.pullFromCloudSilently();
        })
        .subscribe();

      this.client.channel('public:documentos')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'documentos' }, () => {
          if (window.CondoStore) window.CondoStore.pullFromCloudSilently();
        })
        .subscribe();

      this.client.channel('public:recados')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'recados' }, () => {
          if (window.CondoStore) window.CondoStore.pullFromCloudSilently();
        })
        .subscribe();
    } catch (e) {}
  },

  async deleteMoradorFromSupabase(id, email) {
    if (!this.client) return;
    try {
      if (id) await this.client.from('moradores').delete().eq('id', id).catch(() => {});
      if (email) await this.client.from('moradores').delete().eq('email', email.toLowerCase().trim()).catch(() => {});
    } catch (err) {}
  }
};
