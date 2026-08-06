/* ====================================================
   Modern Life Residence - Neon PostgreSQL Serverless Database Client
   Conexão PostgreSQL Direta com o Neon.tech (500 MB Grátis, Respostas Instantâneas, Zero Limites de Cota)
   String de Conexão: postgresql://neondb_owner:npg_ktVps89YxydU@ep-wispy-cherry-ax6aost3-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require
   ==================================================== */

const NEON_SQL_URL = 'https://ep-wispy-cherry-ax6aost3-pooler.c-4.us-east-2.aws.neon.tech/sql';
const NEON_CONN_STRING = 'postgresql://neondb_owner:npg_ktVps89YxydU@ep-wispy-cherry-ax6aost3-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

window.SupabaseConfig = {
  client: true,

  init() {
    console.log('✅ Neon PostgreSQL Cloud Database inicializado com sucesso.');
    this.createTablesIfNotExist();
    return this;
  },

  isConfigured() {
    return true;
  },

  async query(sql) {
    try {
      const res = await fetch(NEON_SQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Neon-Connection-String': NEON_CONN_STRING
        },
        body: JSON.stringify({ query: sql })
      });
      const json = await res.json();
      return json.rows || [];
    } catch (err) {
      console.warn('⚠️ Erro na consulta ao Neon PostgreSQL:', err);
      return [];
    }
  },

  async createTablesIfNotExist() {
    const ddl = `
      CREATE TABLE IF NOT EXISTS ocorrencias (
          id VARCHAR(100) PRIMARY KEY,
          morador_id VARCHAR(100),
          morador_nome VARCHAR(150),
          morador_email VARCHAR(150),
          apartamento VARCHAR(50),
          categoria VARCHAR(100),
          assunto VARCHAR(250),
          descricao TEXT,
          status VARCHAR(100),
          respostas JSONB DEFAULT '[]'::jsonb,
          data VARCHAR(30)
      );
      CREATE TABLE IF NOT EXISTS moradores (
          id VARCHAR(100) PRIMARY KEY,
          nome VARCHAR(150),
          email VARCHAR(150) UNIQUE,
          senha VARCHAR(250),
          telefone VARCHAR(50),
          apartamento VARCHAR(50),
          role VARCHAR(50),
          status VARCHAR(50),
          senha_temporaria BOOLEAN DEFAULT FALSE,
          data_cadastro VARCHAR(30)
      );
      CREATE TABLE IF NOT EXISTS reservas (
          id VARCHAR(100) PRIMARY KEY,
          morador_id VARCHAR(100),
          morador_nome VARCHAR(150),
          apartamento VARCHAR(50),
          espaco VARCHAR(100),
          data VARCHAR(30),
          hora_inicio VARCHAR(10),
          hora_fim VARCHAR(10),
          status VARCHAR(50)
      );
    `;
    const statements = ddl.split(';').map(s => s.trim()).filter(Boolean);
    for (const stmt of statements) {
      await this.query(stmt);
    }
  },

  async pullDataFromSupabase() {
    try {
      const rowsMoradores = await this.query("SELECT id, nome, email, senha, telefone, apartamento, role, status, senha_temporaria, data_cadastro FROM moradores;");
      const moradoresFormatted = rowsMoradores.map(m => ({
        id: m.id,
        nome: m.nome,
        email: (m.email || '').toLowerCase().trim(),
        senha: m.senha,
        telefone: m.telefone,
        apartamento: m.apartamento,
        role: m.role || 'Morador',
        status: m.status || 'Pendente',
        senhaTemporaria: !!m.senha_temporaria,
        dataCadastro: m.data_cadastro
      }));

      const rowsReservas = await this.query("SELECT id, morador_id, morador_nome, apartamento, espaco, data, hora_inicio, hora_fim, status FROM reservas;");
      const reservasFormatted = rowsReservas.map(r => ({
        id: r.id,
        moradorId: r.morador_id,
        moradorNome: r.morador_nome,
        apartamento: r.apartamento,
        espaco: r.espaco,
        data: r.data,
        horaInicio: r.hora_inicio,
        horaFim: r.hora_fim,
        status: r.status
      }));

      const rowsOcorrencias = await this.query("SELECT id, morador_id, morador_nome, morador_email, apartamento, categoria, assunto, descricao, status, respostas, data FROM ocorrencias;");
      const ocorrenciasFormatted = rowsOcorrencias.map(o => ({
        id: o.id,
        moradorId: o.morador_id,
        moradorNome: o.morador_nome,
        moradorEmail: o.morador_email,
        apartamento: o.apartamento,
        categoria: o.categoria,
        assunto: o.assunto,
        descricao: o.descricao,
        status: o.status,
        respostas: typeof o.respostas === 'string' ? JSON.parse(o.respostas) : (o.respostas || []),
        data: o.data
      }));

      return {
        moradores: moradoresFormatted,
        reservas: reservasFormatted,
        ocorrencias: ocorrenciasFormatted
      };
    } catch (e) {
      console.warn('Erro ao puxar dados do Neon PostgreSQL:', e);
      return null;
    }
  },

  async pushDataToSupabase(data) {
    if (!data) return;
    try {
      // 1. Moradores
      if (data.moradores && data.moradores.length > 0) {
        for (const m of data.moradores) {
          if (!m || !m.email) continue;
          const emailNorm = m.email.toLowerCase().trim().replace(/'/g, "''");
          const nomeClean = (m.nome || '').replace(/'/g, "''");
          const senhaClean = (m.senha || '').replace(/'/g, "''");
          const telClean = (m.telefone || '').replace(/'/g, "''");
          const aptoClean = (m.apartamento || '').replace(/'/g, "''");
          const roleClean = (m.role || 'Morador').replace(/'/g, "''");
          const statusClean = (m.status || 'Pendente').replace(/'/g, "''");
          const dataClean = (m.dataCadastro || new Date().toISOString().split('T')[0]).replace(/'/g, "''");
          const tempFlag = m.senhaTemporaria ? 'TRUE' : 'FALSE';

          const sql = `
            INSERT INTO moradores (id, nome, email, senha, telefone, apartamento, role, status, senha_temporaria, data_cadastro)
            VALUES ('${m.id}', '${nomeClean}', '${emailNorm}', '${senhaClean}', '${telClean}', '${aptoClean}', '${roleClean}', '${statusClean}', ${tempFlag}, '${dataClean}')
            ON CONFLICT (email) DO UPDATE SET 
              nome = EXCLUDED.nome,
              senha = EXCLUDED.senha,
              telefone = EXCLUDED.telefone,
              apartamento = EXCLUDED.apartamento,
              role = EXCLUDED.role,
              status = EXCLUDED.status,
              senha_temporaria = EXCLUDED.senha_temporaria;
          `;
          await this.query(sql);
        }
      }

      // 2. Reservas
      if (data.agendaReservas && data.agendaReservas.length > 0) {
        for (const r of data.agendaReservas) {
          if (!r || !r.id) continue;
          const nomeClean = (r.moradorNome || '').replace(/'/g, "''");
          const aptoClean = (r.apartamento || '').replace(/'/g, "''");
          const espacoClean = (r.espaco || '').replace(/'/g, "''");
          const dataClean = (r.data || '').replace(/'/g, "''");
          const hIni = (r.horaInicio || '').replace(/'/g, "''");
          const hFim = (r.horaFim || '').replace(/'/g, "''");
          const stClean = (r.status || 'Confirmada').replace(/'/g, "''");

          const sql = `
            INSERT INTO reservas (id, morador_id, morador_nome, apartamento, espaco, data, hora_inicio, hora_fim, status)
            VALUES ('${r.id}', '${r.moradorId}', '${nomeClean}', '${aptoClean}', '${espacoClean}', '${dataClean}', '${hIni}', '${hFim}', '${stClean}')
            ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;
          `;
          await this.query(sql);
        }
      }

      // 3. Ocorrências
      if (data.ocorrencias && data.ocorrencias.length > 0) {
        const rows = data.ocorrencias.map(o => ({
          id: o.id,
          morador_id: o.moradorId || o.id,
          morador_nome: o.moradorNome || '',
          morador_email: (o.moradorEmail || '').toLowerCase().trim(),
          apartamento: o.apartamento || '',
          categoria: o.categoria || 'Geral',
          assunto: o.assunto || '',
          descricao: o.descricao || '',
          status: o.status || 'Pendente',
          respostas: o.respostas || [],
          data: o.data || new Date().toISOString().split('T')[0]
        }));
        await this.safeUpsertOcorrencias(rows);
      }
    } catch (e) {
      console.warn('Erro ao salvar dados no Neon PostgreSQL:', e);
    }
  },

  async safeUpsertOcorrencias(rows) {
    if (!rows || !Array.isArray(rows)) return;
    for (const r of rows) {
      if (!r || !r.id) continue;
      const mId = (r.morador_id || r.id).replace(/'/g, "''");
      const mNome = (r.morador_nome || '').replace(/'/g, "''");
      const mEmail = (r.morador_email || '').toLowerCase().trim().replace(/'/g, "''");
      const apto = (r.apartamento || '').replace(/'/g, "''");
      const cat = (r.categoria || 'Geral').replace(/'/g, "''");
      const ass = (r.assunto || '').replace(/'/g, "''");
      const desc = (r.descricao || '').replace(/'/g, "''").substring(0, 30000);
      const st = (r.status || 'Pendente').replace(/'/g, "''");
      const respJson = JSON.stringify(r.respostas || []).replace(/'/g, "''");
      const dt = (r.data || new Date().toISOString().split('T')[0]).replace(/'/g, "''");

      const sql = `
        INSERT INTO ocorrencias (id, morador_id, morador_nome, morador_email, apartamento, categoria, assunto, descricao, status, respostas, data)
        VALUES ('${r.id}', '${mId}', '${mNome}', '${mEmail}', '${apto}', '${cat}', '${ass}', '${desc}', '${st}', '${respJson}'::jsonb, '${dt}')
        ON CONFLICT (id) DO UPDATE SET 
          status = EXCLUDED.status,
          respostas = EXCLUDED.respostas,
          descricao = EXCLUDED.descricao;
      `;
      await this.query(sql);
    }
  },

  async deleteArquivoFinanceiroFromSupabase(id, competencia) {
    if (!id) return;
    await this.query(`DELETE FROM ocorrencias WHERE id = '${id.replace(/'/g, "''")}';`);
  },

  async deleteBalancetePorMesFromSupabase(competencia) {
    if (!competencia) return;
    const compClean = competencia.replace(/'/g, "''");
    await this.query(`DELETE FROM ocorrencias WHERE categoria = 'ArqFinVault_${compClean}' OR categoria = 'LancFinVault_${compClean}';`);
  },

  async deleteAllFinancialDataFromSupabase() {
    await this.query("DELETE FROM ocorrencias WHERE categoria LIKE 'ArqFinVault_%' OR categoria LIKE 'LancFinVault_%';");
  },

  async deleteReservaFromSupabase(id) {
    if (!id) return;
    await this.query(`DELETE FROM reservas WHERE id = '${id.replace(/'/g, "''")}';`);
  }
};
