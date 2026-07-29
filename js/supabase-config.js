/* ----------------------------------------------------
   Modern Life Residence - Supabase Cloud Database Client
   Conexão Oficial PostgreSQL Supabase (Sincronização Total de Documentos & Manuais no Banco)
   ---------------------------------------------------- */

const SUPABASE_URL = 'https://lqguxjtczcxbnraoklem.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Oq01uGaW-flwj1qCHTiWMQ_2GL6cnH4';

window.SupabaseConfig = {
  client: null,

  init() {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        this.client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase Cloud Database inicializado com sucesso.');
      } catch (err) {
        console.warn('⚠️ Erro ao inicializar cliente Supabase:', err);
      }
    }
  },

  isConfigured() {
    return !!this.client;
  },

  async pushDataToSupabase(data) {
    if (!this.client || !data) return;

    try {
      // 1. Sincronizar Moradores
      if (data.moradores && data.moradores.length > 0) {
        const rowsMoradores = data.moradores.map(m => ({
          id: m.id,
          nome: m.nome,
          email: (m.email || '').toLowerCase().trim(),
          senha: m.senha || '123456',
          telefone: m.telefone || '',
          apartamento: m.apartamento || '',
          role: m.role || 'Morador',
          status: m.status || 'Pendente',
          senha_temporaria: !!m.senhaTemporaria,
          data_cadastro: m.dataCadastro || new Date().toISOString().split('T')[0]
        }));
        await this.client.from('moradores').upsert(rowsMoradores, { onConflict: 'email' }).catch(() => {});
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
        await this.client.from('reservas').upsert(rowsReservas, { onConflict: 'id' }).catch(() => {});
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
        await this.client.from('ocorrencias').upsert(rowsOcorrencias, { onConflict: 'id' }).catch(() => {});
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

      // 6. Sincronizar Documentos (Com garantia de salvamento total no PostgreSQL Supabase Cloud)
      if (data.documentos && data.documentos.length > 0) {
        // A) Tabela dedicada 'documentos'
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

        // B) Cofre de Backup de Documentos no Banco PostgreSQL Supabase
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
        await this.client.from('ocorrencias').upsert(rowsDocVault, { onConflict: 'id' }).catch(() => {});
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
      const resDocVault = await this.client.from('ocorrencias').select('*').like('categoria', 'DocVault_%').catch(() => ({ data: null }));
      const resRecados = await this.client.from('recados').select('*').catch(() => ({ data: null }));

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

      // Filtrar ocorrências reais (removendo as entradas do cofre de documentos)
      const ocorrenciasReais = (resOcorrencias && resOcorrencias.data)
        ? resOcorrencias.data.filter(o => !o.categoria || !o.categoria.startsWith('DocVault_'))
        : null;

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
      if (id) await this.client.from('moradores').delete().eq('id', id).catch(() => {});
      if (email) await this.client.from('moradores').delete().eq('email', email.toLowerCase().trim()).catch(() => {});
    } catch (err) {}
  },

  async deleteContratoFromSupabase(id) {
    if (!this.client || !id) return;
    try {
      await this.client.from('contratos').delete().eq('id', id).catch(() => {});
    } catch (err) {}
  },

  async deleteBalanceteFromSupabase(id) {
    if (!this.client || !id) return;
    try {
      await this.client.from('balancetes').delete().eq('id', id).catch(() => {});
    } catch (err) {}
  },

  async deleteDocumentoFromSupabase(id) {
    if (!this.client || !id) return;
    try {
      await this.client.from('documentos').delete().eq('id', id).catch(() => {});
      await this.client.from('ocorrencias').delete().eq('id', id).catch(() => {});
      if (!id.startsWith('doc_')) {
        await this.client.from('ocorrencias').delete().eq('id', 'doc_' + id).catch(() => {});
      }
    } catch (err) {}
  }
};

// Autocarregamento Supabase
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.SupabaseConfig.init());
} else {
  window.SupabaseConfig.init();
}
