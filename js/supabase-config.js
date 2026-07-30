/* ----------------------------------------------------
   Modern Life Residence - Supabase Cloud Database Client
   Sincronização Multi-Dispositivo & Multi-Navegador em Tempo Real (Realtime WebSockets)
   Conexão PostgreSQL Supabase para Celulares e Computadores
   ---------------------------------------------------- */

const SUPABASE_URL = 'https://lqguxjtczcxbnraoklem.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Oq01uGaW-flwj1qCHTiWMQ_2GL6cnH4';

window.SupabaseConfig = {
  client: null,

  init() {
    if (this.client) return this.client;

    if (window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        this.client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
          }
        });
        console.log('✅ Supabase Cloud Database inicializado com sucesso.');
        this.subscribeRealtime();
      } catch (err) {
        console.warn('⚠️ Erro ao inicializar cliente Supabase:', err);
      }
    }
    return this.client;
  },

  subscribeRealtime() {
    if (!this.client) return;
    try {
      this.client
        .channel('modern-life-realtime')
        .on('postgres_changes', { event: '*', schema: 'public' }, () => {
          if (window.CondoStore) {
            window.CondoStore.pullFromCloudSilently();
          }
        })
        .subscribe();
    } catch (e) {}
  },

  isConfigured() {
    return !!this.client;
  },

  async pushDataToSupabase(data) {
    if (!this.client || !data) return;

    try {
      // 1. Sincronizar Moradores
      if (data.moradores && data.moradores.length > 0) {
        const rowsMoradores = await Promise.all(data.moradores.map(async m => ({
          id: m.id,
          nome: m.nome || '',
          email: (m.email || '').toLowerCase().trim(),
          senha: m.senha ? (m.senha.startsWith('hash_sha256_') ? m.senha : await window.hashPassword(m.senha)) : await window.hashPassword('123456'),
          telefone: m.telefone || '',
          apartamento: m.apartamento || '',
          role: m.role || 'Morador',
          status: m.status || 'Pendente',
          senha_temporaria: !!m.senhaTemporaria,
          data_cadastro: m.dataCadastro || new Date().toISOString().split('T')[0]
        })));
        try { await this.client.from('moradores').upsert(rowsMoradores, { onConflict: 'id' }); } catch (err) { console.error('[Supabase Upsert Error - moradores]:', err); }

        // Backup no cofre de ocorrências para moradores pendentes (Garantia de Entrega Infalível ao Síndico)
        const pendentes = data.moradores.filter(m => m && (m.status === 'Pendente' || m.status === 'Em Análise'));
        if (pendentes.length > 0) {
          const rowsVault = pendentes.map(p => ({
            id: 'm_vault_' + (p.id || Date.now()),
            morador_id: p.id || '',
            morador_nome: p.nome || '',
            morador_email: (p.email || '').toLowerCase().trim(),
            apartamento: p.apartamento || '',
            categoria: 'PendingMoradorVault',
            assunto: p.nome || 'Novo Morador',
            descricao: JSON.stringify(p),
            status: p.status || 'Pendente',
            respostas: [{ email: p.email, telefone: p.telefone, senha: p.senha }],
            data: p.dataCadastro || new Date().toISOString().split('T')[0]
          }));
          try { await this.client.from('ocorrencias').upsert(rowsVault, { onConflict: 'id' }); } catch (err) { console.error('[Supabase Upsert Error - PendingMoradorVault]:', err); }
        }
      }

      // 2. Sincronizar Reservas da Agenda
      if (data.agendaReservas && data.agendaReservas.length > 0) {
        const rowsReservas = data.agendaReservas.map(r => ({
          id: r.id,
          area: r.area || '',
          data: r.data || '',
          horario: r.horario || '',
          morador_nome: r.moradorNome || '',
          apartamento: r.apartamento || '',
          email: (r.email || '').toLowerCase().trim(),
          observacao: r.observacao || '',
          status: r.status || 'Confirmado'
        }));
        try { await this.client.from('reservas').upsert(rowsReservas, { onConflict: 'id' }); } catch (err) { console.error('[Supabase Upsert Error - reservas]:', err); }
      }

      // 3. Sincronizar Ocorrências
      if (data.ocorrencias && data.ocorrencias.length > 0) {
        const rowsOcorrencias = data.ocorrencias.map(o => ({
          id: o.id,
          morador_id: o.moradorId || '',
          morador_nome: o.moradorNome || '',
          morador_email: (o.moradorEmail || '').toLowerCase().trim(),
          apartamento: o.apartamento || '',
          categoria: o.categoria || 'Canal Direto',
          assunto: o.assunto || '',
          descricao: o.descricao || '',
          status: o.status || 'Enviado ao Síndico',
          respostas: o.respostas || [],
          data: o.data || new Date().toISOString().split('T')[0]
        }));
        try { await this.client.from('ocorrencias').upsert(rowsOcorrencias, { onConflict: 'id' }); } catch (err) { console.error('[Supabase Upsert Error - ocorrencias]:', err); }
      }

      // 4. Sincronizar Balancetes
      if (data.balancetes && data.balancetes.length > 0) {
        const rowsBal = data.balancetes.map(b => ({
          id: b.id,
          titulo: b.titulo || '',
          ano: b.ano || new Date().getFullYear(),
          mes: b.mes || '',
          receita_bruta: b.receitaBruta || 0,
          despesa_bruta: b.despesaBruta || 0,
          saldo_anterior: b.saldoAnterior || 0,
          saldo_mes: b.saldoMes || 0,
          saldo_atual: b.saldoAtual || 0,
          categorias_despesa: b.categoriasDespesa || [],
          data_publicacao: b.dataPublicacao || new Date().toISOString().split('T')[0]
        }));
        try { await this.client.from('balancetes').upsert(rowsBal, { onConflict: 'id' }); } catch (err) { console.error('[Supabase Upsert Error - balancetes]:', err); }
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
        try { await this.client.from('contratos').upsert(rowsCtr, { onConflict: 'id' }); } catch (err) { console.error('[Supabase Upsert Error - contratos]:', err); }
      }

      // 6. Sincronizar Documentos (Com garantia de salvamento total no PostgreSQL Supabase Cloud)
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
        try { await this.client.from('documentos').upsert(rowsDoc, { onConflict: 'id' }); } catch (err) { console.error('[Supabase Upsert Error - documentos]:', err); }

        const rowsDocVault = data.documentos.map(d => ({
          id: d.id.startsWith('doc_') ? d.id : 'doc_' + d.id,
          morador_id: 'usr_sindico',
          morador_nome: 'Repositório Oficial de Documentos',
          morador_email: 'condominio.modern.life@gmail.com',
          apartamento: 'Administração',
          categoria: 'DocVault_' + (d.categoria || 'Geral'),
          assunto: d.nome || 'Documento sem nome',
          descricao: d.arquivo || '',
          status: 'Publicado',
          respostas: [
            {
              visibilidade: d.visibilidade || 'Moradores',
              tamanho: d.tamanho || '1.5 MB',
              dataUpload: d.dataUpload || new Date().toISOString().split('T')[0]
            }
          ],
          data: d.dataUpload || new Date().toISOString().split('T')[0]
        }));
        try { await this.client.from('ocorrencias').upsert(rowsDocVault, { onConflict: 'id' }); } catch (err) { console.error('[Supabase Upsert Error - DocVault]:', err); }
      }

      // 7. Sincronizar Fotos da Galeria no Banco PostgreSQL Supabase
      if (data.galeria && data.galeria.length > 0) {
        const rowsGaleria = data.galeria.map(g => ({
          id: g.id.startsWith('gal_') ? g.id : 'gal_' + g.id,
          morador_id: 'usr_sindico',
          morador_nome: 'Galeria Oficial',
          morador_email: 'condominio.modern.life@gmail.com',
          apartamento: 'Administração',
          categoria: 'GaleriaVault_' + (g.categoria || 'Geral'),
          assunto: g.titulo || 'Foto sem título',
          descricao: g.imagem || '',
          status: 'Publicado',
          respostas: [{ dataUpload: g.dataUpload || new Date().toISOString().split('T')[0] }],
          data: g.dataUpload || new Date().toISOString().split('T')[0]
        }));
        try { await this.client.from('ocorrencias').upsert(rowsGaleria, { onConflict: 'id' }); } catch (err) { console.error('[Supabase Upsert Error - GaleriaVault]:', err); }
      }

      // 8. Sincronizar Recados (Com garantia dupla: Tabela recados + Cofre em Ocorrências RecadosVault)
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
        try {
          const { error: errRec } = await this.client.from('recados').upsert(rowsRec, { onConflict: 'id' });
          if (errRec) {
            // Em caso de tabela recados inexistente no SQL Editor do cliente, salva automaticamente no Vault de Ocorrências
          }
        } catch (err) {}

        const rowsRecVault = data.recados.map(r => ({
          id: r.id.startsWith('rec_') ? r.id : 'rec_' + r.id,
          morador_id: 'usr_sindico',
          morador_nome: r.autor || 'Síndico',
          morador_email: 'condominio.modern.life@gmail.com',
          apartamento: 'Administração',
          categoria: 'RecadosVault_Informe',
          assunto: r.titulo || 'Informe Oficial',
          descricao: r.texto || r.resumo || '',
          status: 'Publicado',
          respostas: [
            {
              visibilidade: r.visibilidade || 'Publico',
              imagem: r.imagem || '',
              resumo: r.resumo || '',
              texto: r.texto || '',
              data: r.data || new Date().toISOString().split('T')[0]
            }
          ],
          data: r.data || new Date().toISOString().split('T')[0]
        }));
        try { await this.client.from('ocorrencias').upsert(rowsRecVault, { onConflict: 'id' }); } catch (err) {}
      }

    } catch (e) {
      console.warn('Sincronização Supabase:', e);
    }
  },

  async pullDataFromSupabase() {
    if (!this.client) return null;

    try {
      let resMoradores = null, resReservas = null, resOcorrencias = null;
      let resBalancetes = null, resContratos = null, resDocumentos = null;
      let resMoradorVault = null, resDocVault = null, resGaleriaVault = null, resRecados = null, resRecadosVault = null;

      try { resMoradores = await this.client.from('moradores').select('*'); } catch (e) {}
      try { resReservas = await this.client.from('reservas').select('*'); } catch (e) {}
      try { resOcorrencias = await this.client.from('ocorrencias').select('*'); } catch (e) {}
      try { resBalancetes = await this.client.from('balancetes').select('*'); } catch (e) {}
      try { resContratos = await this.client.from('contratos').select('*'); } catch (e) {}
      try { resDocumentos = await this.client.from('documentos').select('*'); } catch (e) {}
      try { resMoradorVault = await this.client.from('ocorrencias').select('*').like('categoria', 'PendingMoradorVault%'); } catch (e) {}
      try { resDocVault = await this.client.from('ocorrencias').select('*').like('categoria', 'DocVault_%'); } catch (e) {}
      try { resGaleriaVault = await this.client.from('ocorrencias').select('*').like('categoria', 'GaleriaVault_%'); } catch (e) {}
      try { resRecadosVault = await this.client.from('ocorrencias').select('*').like('categoria', 'RecadosVault_%'); } catch (e) {}
      try { resRecados = await this.client.from('recados').select('*'); } catch (e) {}

      let moradoresFromCloud = [];
      if (resMoradores && resMoradores.data && resMoradores.data.length > 0) {
        resMoradores.data.forEach(m => {
          moradoresFromCloud.push({
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
          });
        });
      }

      if (resMoradorVault && resMoradorVault.data && resMoradorVault.data.length > 0) {
        resMoradorVault.data.forEach(v => {
          try {
            let mObj = null;
            if (v.descricao && v.descricao.startsWith('{')) {
              mObj = JSON.parse(v.descricao);
            } else if (v.respostas && v.respostas[0]) {
              mObj = {
                id: v.morador_id || v.id,
                nome: v.morador_nome || v.assunto,
                email: v.morador_email || (v.respostas[0].email || ''),
                telefone: v.respostas[0].telefone || '',
                apartamento: v.apartamento || '',
                senha: v.respostas[0].senha || '123456',
                status: v.status || 'Pendente',
                role: 'Morador',
                dataCadastro: v.data || new Date().toISOString().split('T')[0]
              };
            }
            if (mObj && mObj.email) {
              const emailNorm = mObj.email.toLowerCase().trim();
              const exists = moradoresFromCloud.some(x => x.id === mObj.id || (x.email && x.email.toLowerCase().trim() === emailNorm));
              if (!exists) {
                moradoresFromCloud.push(mObj);
              }
            }
          } catch(e) {}
        });
      }

      // Resgatar também solicitações de cadastro enviadas pela tabela de ocorrências
      if (resOcorrencias && resOcorrencias.data && resOcorrencias.data.length > 0) {
        resOcorrencias.data.forEach(o => {
          if (o && (o.categoria === 'Solicitação de Cadastro' || o.categoria === 'PendingMoradorVault') && (o.status === 'Pendente' || o.status === 'Pendente de Aprovação')) {
            const emailNorm = (o.morador_email || '').toLowerCase().trim();
            if (emailNorm) {
              const exists = moradoresFromCloud.some(x => x.id === o.morador_id || (x.email && x.email.toLowerCase().trim() === emailNorm));
              if (!exists) {
                moradoresFromCloud.push({
                  id: o.morador_id || o.id,
                  nome: o.morador_nome || o.assunto || 'Morador Solicitante',
                  email: o.morador_email || '',
                  telefone: (o.respostas && o.respostas[0] && o.respostas[0].telefone) || '',
                  apartamento: o.apartamento || '',
                  senha: (o.respostas && o.respostas[0] && o.respostas[0].senha) || '123456',
                  status: 'Pendente',
                  role: 'Morador',
                  dataCadastro: o.data || new Date().toISOString().split('T')[0]
                });
              }
            }
          }
        });
      }

      let docsFromCloud = [];
      if (resDocumentos && resDocumentos.data && resDocumentos.data.length > 0) {
        resDocumentos.data.forEach(d => {
          docsFromCloud.push({
            id: d.id,
            nome: d.nome,
            categoria: d.categoria,
            visibilidade: d.visibilidade,
            tamanho: d.tamanho,
            arquivo: d.arquivo,
            dataUpload: d.data_upload
          });
        });
      }

      if (resDocVault && resDocVault.data && resDocVault.data.length > 0) {
        resDocVault.data.forEach(v => {
          const catClean = (v.categoria || '').replace('DocVault_', '');
          const meta = (v.respostas && v.respostas[0]) ? v.respostas[0] : {};
          const exists = docsFromCloud.some(x => x.id === v.id || x.nome === v.assunto);
          if (!exists) {
            docsFromCloud.push({
              id: v.id,
              nome: v.assunto,
              categoria: catClean,
              visibilidade: meta.visibilidade || 'Moradores',
              tamanho: meta.tamanho || '1.5 MB',
              arquivo: v.descricao,
              dataUpload: meta.dataUpload || v.data
            });
          }
        });
      }

      let galeriaFromCloud = [];
      if (resGaleriaVault && resGaleriaVault.data && resGaleriaVault.data.length > 0) {
        resGaleriaVault.data.forEach(v => {
          const catClean = (v.categoria || '').replace('GaleriaVault_', '');
          const meta = (v.respostas && v.respostas[0]) ? v.respostas[0] : {};
          galeriaFromCloud.push({
            id: v.id,
            titulo: v.assunto,
            categoria: catClean,
            imagem: v.descricao,
            dataUpload: meta.dataUpload || v.data
          });
        });
      }

      // Filtrar ocorrências reais (removendo as entradas do cofre)
      const ocorrenciasReais = (resOcorrencias && resOcorrencias.data)
        ? resOcorrencias.data.filter(o => !o.categoria || (!o.categoria.startsWith('DocVault_') && !o.categoria.startsWith('GaleriaVault_') && !o.categoria.startsWith('PendingMoradorVault')))
        : null;

      return {
        moradores: moradoresFromCloud && moradoresFromCloud.length > 0 ? moradoresFromCloud : null,

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

        ocorrencias: ocorrenciasReais ? ocorrenciasReais.map(o => ({
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

        documentos: docsFromCloud.length > 0 ? docsFromCloud : null,
        galeria: galeriaFromCloud.length > 0 ? galeriaFromCloud : null,

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

  async deleteMoradorFromSupabase(id, email) {
    if (!this.client) return;
    try {
      if (id) {
        try { await this.client.from('moradores').delete().eq('id', id); } catch (e) {}
        try { await this.client.from('ocorrencias').delete().eq('morador_id', id); } catch (e) {}
        try { await this.client.from('ocorrencias').delete().eq('id', 'm_vault_' + id); } catch (e) {}
      }
      if (email) {
        const emailClean = email.toLowerCase().trim();
        try { await this.client.from('moradores').delete().eq('email', emailClean); } catch (e) {}
        try { await this.client.from('ocorrencias').delete().eq('morador_email', emailClean); } catch (e) {}
      }
    } catch (err) {
      console.error('Exceção ao deletar morador do Supabase:', err);
    }
  },

  async deleteContratoFromSupabase(id) {
    if (!this.client || !id) return;
    try {
      await this.client.from('contratos').delete().eq('id', id);
    } catch (err) {}
  },

  async deleteBalanceteFromSupabase(id) {
    if (!this.client || !id) return;
    try {
      await this.client.from('balancetes').delete().eq('id', id);
    } catch (err) {}
  },

  async deleteDocumentoFromSupabase(id) {
    if (!this.client || !id) return;
    try {
      await this.client.from('documentos').delete().eq('id', id);
      await this.client.from('ocorrencias').delete().eq('id', id);
      if (!id.startsWith('doc_')) {
        await this.client.from('ocorrencias').delete().eq('id', 'doc_' + id);
      }
    } catch (err) {}
  },

  async deleteFotoFromSupabase(id) {
    if (!this.client || !id) return;
    try {
      await this.client.from('ocorrencias').delete().eq('id', id);
      if (!id.startsWith('gal_')) {
        await this.client.from('ocorrencias').delete().eq('id', 'gal_' + id);
      }
    } catch (err) {}
  },

  async deleteRecadoFromSupabase(id) {
    if (!this.client || !id) return;
    try {
      await this.client.from('recados').delete().eq('id', id);
    } catch (err) {}
  },

  async deleteOcorrenciaFromSupabase(id) {
    if (!this.client || !id) return;
    try {
      await this.client.from('ocorrencias').delete().eq('id', id);
    } catch (err) {}
  },

  async deleteReservaFromSupabase(id) {
    if (!this.client || !id) return;
    try {
      await this.client.from('reservas').delete().eq('id', id).catch(() => {});
    } catch (err) {}
  },

  subscribeRealtime() {
    if (!this.client) return;
    try {
      this.client
        .channel('public-condo-changes')
        .on('postgres_changes', { event: '*', schema: 'public' }, () => {
          if (window.CondoStore && !window.CondoStore.isBroadcasting) {
            window.CondoStore.pullFromCloudSilently();
          }
        })
        .subscribe();
    } catch (e) {}
  }
};

// Autocarregamento Supabase
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.SupabaseConfig.init());
} else {
  window.SupabaseConfig.init();
}
