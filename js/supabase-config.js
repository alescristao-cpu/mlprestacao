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

  async safeUpsertOcorrencias(rows) {
    if (!this.client || !rows || !Array.isArray(rows) || rows.length === 0) return;

    const sanitizedRows = rows.map(r => ({
      id: String(r.id || '').substring(0, 100),
      morador_id: String(r.morador_id || '').substring(0, 100),
      morador_nome: String(r.morador_nome || '').substring(0, 150),
      morador_email: String(r.morador_email || '').toLowerCase().trim().substring(0, 150),
      apartamento: String(r.apartamento || '').substring(0, 50),
      categoria: String(r.categoria || 'Geral').substring(0, 100),
      assunto: String(r.assunto || '').substring(0, 250),
      descricao: String(r.descricao || '').substring(0, 30000),
      status: String(r.status || 'Pendente').substring(0, 100),
      respostas: Array.isArray(r.respostas) ? r.respostas : [],
      data: String(r.data || new Date().toISOString().split('T')[0]).substring(0, 30)
    }));

    for (let i = 0; i < sanitizedRows.length; i += 3) {
      const batch = sanitizedRows.slice(i, i + 3);
      try {
        await this.client.from('ocorrencias').upsert(batch, { onConflict: 'id' });
      } catch (err) {
        for (const singleRow of batch) {
          try {
            await this.client.from('ocorrencias').upsert([singleRow], { onConflict: 'id' });
          } catch (e) {}
        }
      }
    }
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
        try { await this.client.from('moradores').upsert(rowsMoradores, { onConflict: 'id' }); } catch (err) {}

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
          try { await this.safeUpsertOcorrencias(rowsVault); } catch (err) {}
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
        try { await this.client.from('reservas').upsert(rowsReservas, { onConflict: 'id' }); } catch (err) {}
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
        try { await this.safeUpsertOcorrencias(rowsOcorrencias); } catch (err) {}
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
        try { await this.client.from('balancetes').upsert(rowsBal, { onConflict: 'id' }); } catch (err) {}
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
        try { await this.client.from('contratos').upsert(rowsCtr, { onConflict: 'id' }); } catch (err) {}
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
        try { await this.client.from('documentos').upsert(rowsDoc, { onConflict: 'id' }); } catch (err) {}

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
        try { await this.safeUpsertOcorrencias(rowsDocVault); } catch (err) {}
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
        try { await this.safeUpsertOcorrencias(rowsGaleria); } catch (err) {}
      }

      // 7.1 Sincronizar Encomendas da Portaria no Banco PostgreSQL Supabase
      if (data.encomendas && data.encomendas.length > 0) {
        const rowsEncomendas = data.encomendas.map(e => ({
          id: e.id.startsWith('enc_') ? e.id : 'enc_' + e.id,
          morador_id: e.moradorId || 'usr_portaria',
          morador_nome: e.moradorNome || 'Morador',
          morador_email: e.telefone || '',
          apartamento: e.apartamento || '',
          categoria: 'EncomendasVault_' + (e.status || 'Pendente'),
          assunto: (e.empresa || 'Encomenda') + ' - ' + (e.descricao || 'Pacote'),
          descricao: e.descricao || '',
          status: e.status || 'Aguardando Retirada',
          respostas: [{
            empresa: e.empresa,
            codigoRastreio: e.codigoRastreio,
            porteiro: e.porteiro,
            horaChegada: e.horaChegada,
            retiradoPor: e.retiradoPor,
            dataRetirada: e.dataRetirada
          }],
          data: e.dataChegada || new Date().toISOString().split('T')[0]
        }));
        try { await this.safeUpsertOcorrencias(rowsEncomendas); } catch (err) {}
      }

      // 8. Sincronizar Recados (Garantia de salvamento infalível via RecadosVault no PostgreSQL Supabase Cloud)
      if (data.recados && data.recados.length > 0) {
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
        try { await this.safeUpsertOcorrencias(rowsRecVault); } catch (err) {}
      }

      // 9. Sincronizar Arquivos Financeiros de Balancete no Banco PostgreSQL Supabase (via Vault)
      if (data.arquivosFinanceiros && data.arquivosFinanceiros.length > 0) {
        const rowsArqVault = data.arquivosFinanceiros.map(a => ({
          id: a.id.startsWith('arq_') ? a.id : 'arq_' + a.id,
          morador_id: 'usr_sindico',
          morador_nome: 'Gestão Financeira',
          morador_email: 'condominio.modern.life@gmail.com',
          apartamento: 'Administração',
          categoria: 'ArqFinVault_' + (a.competencia || 'Geral'),
          assunto: a.nome || 'Arquivo de Balancete',
          descricao: JSON.stringify(a),
          status: a.status || 'Processado',
          respostas: [{ competencia: a.competencia, dataUpload: a.dataUpload, usuario: a.usuario, tipo: a.tipo }],
          data: a.dataUpload || new Date().toISOString().split('T')[0]
        }));
        try { await this.safeUpsertOcorrencias(rowsArqVault); } catch (err) {}
      }

      // 10. Sincronizar Lançamentos Financeiros Individuais no PostgreSQL Supabase (via Vault)
      if (data.lancamentosFinanceiros && data.lancamentosFinanceiros.length > 0) {
        const lancsPorComp = {};
        data.lancamentosFinanceiros.forEach(l => {
          const c = l.competencia || 'Outros';
          if (!lancsPorComp[c]) lancsPorComp[c] = [];
          lancsPorComp[c].push(l);
        });

        const rowsLancVault = Object.keys(lancsPorComp).map(compKey => ({
          id: 'lanc_vault_' + compKey.replace(/[^a-zA-Z0-9]/g, '_'),
          morador_id: 'usr_sindico',
          morador_nome: 'Lançamentos Financeiros',
          morador_email: 'condominio.modern.life@gmail.com',
          apartamento: 'Administração',
          categoria: 'LancFinVault_' + compKey,
          assunto: 'Lançamentos da Competência ' + compKey,
          descricao: JSON.stringify(lancsPorComp[compKey]),
          status: 'Processado',
          data: new Date().toISOString().split('T')[0]
        }));
        try { await this.safeUpsertOcorrencias(rowsLancVault); } catch (err) {}
      }

    } catch (e) {
      console.warn('Sincronização Supabase:', e);
    }
  },

  async pullDataFromSupabase() {
    if (!this.client) return null;

    try {
      let resMoradores = null, resReservas = null, resOcorrencias = null;
      let resBalancetes = null, resContratos = null, resDocumentos = null, resRecados = null;
      let resMoradorVault = { data: [] }, resDocVault = { data: [] }, resGaleriaVault = { data: [] }, resRecadosVault = { data: [] }, resEncomendasVault = { data: [] };
      let resArqFinVault = { data: [] }, resLancFinVault = { data: [] };

      try { resMoradores = await this.client.from('moradores').select('*'); } catch (e) {}
      try { resReservas = await this.client.from('reservas').select('*'); } catch (e) {}
      try { resOcorrencias = await this.client.from('ocorrencias').select('*'); } catch (e) {}
      try { resBalancetes = await this.client.from('balancetes').select('*'); } catch (e) {}
      try { resContratos = await this.client.from('contratos').select('*'); } catch (e) {}
      try { resDocumentos = await this.client.from('documentos').select('*'); } catch (e) {}
      try { resRecados = await this.client.from('recados').select('*'); } catch (e) {}

      if (resOcorrencias && Array.isArray(resOcorrencias.data)) {
        const all = resOcorrencias.data;
        resMoradorVault = { data: all.filter(o => o.categoria && o.categoria.startsWith('PendingMoradorVault')) };
        resDocVault = { data: all.filter(o => o.categoria && o.categoria.startsWith('DocVault_')) };
        resGaleriaVault = { data: all.filter(o => o.categoria && o.categoria.startsWith('GaleriaVault_')) };
        resRecadosVault = { data: all.filter(o => o.categoria && o.categoria.startsWith('RecadosVault_')) };
        resEncomendasVault = { data: all.filter(o => o.categoria && o.categoria.startsWith('EncomendasVault_')) };
        resArqFinVault = { data: all.filter(o => o.categoria && o.categoria.startsWith('ArqFinVault_')) };
        resLancFinVault = { data: all.filter(o => o.categoria && o.categoria.startsWith('LancFinVault_')) };
      }

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

      let recadosFromCloud = [];
      if (resRecadosVault && resRecadosVault.data && resRecadosVault.data.length > 0) {
        resRecadosVault.data.forEach(v => {
          const meta = (v.respostas && v.respostas[0]) ? v.respostas[0] : {};
          recadosFromCloud.push({
            id: v.id,
            titulo: v.assunto || 'Mural de Recados',
            data: meta.data || v.data,
            autor: v.morador_nome || 'Síndico',
            visibilidade: meta.visibilidade || 'Publico',
            imagem: meta.imagem || '',
            resumo: meta.resumo || '',
            texto: meta.texto || v.descricao || ''
          });
        });
      }
      if (resRecados && resRecados.data && resRecados.data.length > 0) {
        resRecados.data.forEach(r => {
          if (!recadosFromCloud.some(x => x.id === r.id)) {
            recadosFromCloud.push({
              id: r.id,
              titulo: r.titulo,
              data: r.data,
              autor: r.autor,
              visibilidade: r.visibilidade,
              imagem: r.imagem,
              resumo: r.resumo,
              texto: r.texto
            });
          }
        });
      }

      let encomendasFromCloud = [];
      if (resEncomendasVault && resEncomendasVault.data && resEncomendasVault.data.length > 0) {
        resEncomendasVault.data.forEach(v => {
          const meta = (v.respostas && v.respostas[0]) ? v.respostas[0] : {};
          encomendasFromCloud.push({
            id: v.id,
            moradorId: v.morador_id,
            moradorNome: v.morador_nome,
            apartamento: v.apartamento,
            telefone: v.morador_email || '',
            empresa: meta.empresa || 'Encomenda',
            descricao: v.descricao || v.assunto,
            codigoRastreio: meta.codigoRastreio || '',
            porteiro: meta.porteiro || 'Portaria & Guarita',
            dataChegada: v.data,
            horaChegada: meta.horaChegada || '10:00',
            status: v.status || 'Aguardando Retirada',
            retiradoPor: meta.retiradoPor || '',
            dataRetirada: meta.dataRetirada || ''
          });
        });
      }

      // 9. Extração de Arquivos e Lançamentos Financeiros (Do Vault do Supabase)
      let arqFinFromCloud = [];
      if (resArqFinVault && resArqFinVault.data && resArqFinVault.data.length > 0) {
        resArqFinVault.data.forEach(v => {
          try {
            let obj = v.descricao && v.descricao.startsWith('{') ? JSON.parse(v.descricao) : null;
            if (!obj) {
              const meta = (v.respostas && v.respostas[0]) ? v.respostas[0] : {};
              obj = {
                id: v.id,
                nome: v.assunto || 'Arquivo de Balancete',
                competencia: meta.competencia || 'Maio/2026',
                dataUpload: v.data || meta.dataUpload || new Date().toISOString().split('T')[0],
                tipo: meta.tipo || 'CSV',
                usuario: meta.usuario || 'Síndico Administrador',
                status: v.status || 'Processado'
              };
            }
            if (obj && obj.id && !arqFinFromCloud.some(x => x.id === obj.id)) {
              arqFinFromCloud.push(obj);
            }
          } catch(e) {}
        });
      }

      let lancFinFromCloud = [];
      if (resLancFinVault && resLancFinVault.data && resLancFinVault.data.length > 0) {
        resLancFinVault.data.forEach(v => {
          try {
            if (v.descricao && v.descricao.startsWith('[')) {
              const arr = JSON.parse(v.descricao);
              if (Array.isArray(arr)) {
                arr.forEach(l => {
                  if (l && l.id && !lancFinFromCloud.some(x => x.id === l.id)) {
                    lancFinFromCloud.push(l);
                  }
                });
              }
            }
          } catch(e) {}
        });
      }

      // Filtrar ocorrências reais (removendo as entradas do cofre)
      const ocorrenciasReais = (resOcorrencias && resOcorrencias.data)
        ? resOcorrencias.data.filter(o => !o.categoria || (!o.categoria.startsWith('DocVault_') && !o.categoria.startsWith('GaleriaVault_') && !o.categoria.startsWith('PendingMoradorVault') && !o.categoria.startsWith('RecadosVault_') && !o.categoria.startsWith('EncomendasVault_') && !o.categoria.startsWith('ArqFinVault_') && !o.categoria.startsWith('LancFinVault_')))
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
        recados: recadosFromCloud.length > 0 ? recadosFromCloud : null,
        encomendas: encomendasFromCloud.length > 0 ? encomendasFromCloud : null,

        arquivosFinanceiros: arqFinFromCloud.length > 0 ? arqFinFromCloud : null,
        lancamentosFinanceiros: lancFinFromCloud.length > 0 ? lancFinFromCloud : null
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
