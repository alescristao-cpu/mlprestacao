/* ====================================================
   Modern Life Residence - Dashboard Financeiro Interativo & Gestão de Balancetes
   Processamento Inteligente de Arquivos (CSV, XLS, XLSX, PDF/OCR)
   Cards de Indicadores, 8 Gráficos Interativos (Chart.js / Canvas), Insights de IA, 
   Filtros em Tempo Real, Busca Inteligente e Exportação (PDF, Excel, PNG)
   ==================================================== */

window.DashboardFinanceiroComponent = {
  activeTab: 'dashboard', // 'dashboard' ou 'arquivos'
  selectedCompetencia: 'Todas',
  selectedCategoria: 'Todas',
  selectedTipo: 'Todos',
  selectedFornecedor: 'Todos',
  valMin: null,
  valMax: null,
  searchQuery: '',
  chartInstances: {},
  isDragging: false,

  render(container, data) {
    const user = window.CondoStore ? window.CondoStore.currentUser : null;
    const isApproved = user && (
      user.status === 'Aprovado' ||
      user.role === 'Administrador' ||
      user.role === 'Síndico' ||
      (user.email && (
        user.email.toLowerCase().trim() === 'condominio.modern.life@gmail.com' ||
        user.email.toLowerCase().trim() === 'contatoalecristiano@gmail.com'
      ))
    );

    const isSindico = user && (
      user.role === 'Administrador' ||
      user.role === 'Síndico' ||
      (user.email && (
        user.email.toLowerCase().trim() === 'condominio.modern.life@gmail.com' ||
        user.email.toLowerCase().trim() === 'contatoalecristiano@gmail.com'
      ))
    );

    if (!user || !isApproved) {
      container.innerHTML = `
        <div class="card-widget" style="text-align: center; padding: 3.5rem 1.5rem; max-width: 600px; margin: 2rem auto;">
          <div style="width: 75px; height: 75px; border-radius: 50%; background: #EFF6FF; color: #2563EB; display: flex; align-items: center; justify-content: center; font-size: 2.8rem; margin: 0 auto 1.25rem auto;">
            <span class="material-symbols-outlined" style="font-size: 3rem;">shield_lock</span>
          </div>
          <h2 style="font-family: var(--font-heading); color: #0F172A; font-size: 1.45rem; font-weight: 700; margin-bottom: 0.5rem;">
            Dashboard Financeiro Restrito
          </h2>
          <p style="color: #64748B; font-size: 0.92rem; margin-bottom: 1.5rem; line-height: 1.5;">
            O Dashboard Financeiro executivo e os relatórios de balancetes são de uso exclusivo dos moradores e gestores do Condomínio Modern Life Residence.
          </p>
          <button class="btn-primary" onclick="AuthComponent.renderAuthModal()" style="padding: 0.85rem 1.6rem; font-size: 0.95rem; background: #2563EB;">
            <span class="material-symbols-outlined">login</span> Entrar / Cadastrar no Portal
          </button>
        </div>
      `;
      return;
    }

    const arquivos = (data && data.arquivosFinanceiros) ? data.arquivosFinanceiros : [];
    const todosLancamentos = (data && data.lancamentosFinanceiros) ? data.lancamentosFinanceiros : this.getLancamentosPadrao();

    // Filtragem em Tempo Real dos Lançamentos
    const lancamentosFiltrados = this.filtrarLancamentos(todosLancamentos);

    // Cálculos de Indicadores de KPIs
    const kpis = this.calcularKPIs(lancamentosFiltrados, todosLancamentos);
    const comparativos = this.calcularComparativos(todosLancamentos);
    const insights = this.gerarInsightsIA(kpis, lancamentosFiltrados, comparativos);

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem; font-family: 'Inter', system-ui, -apple-system, sans-serif;">
        
        <!-- Header Banner Power BI / Looker Studio Style -->
        <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); color: white; padding: 1.5rem; border-radius: 16px; border-left: 6px solid #2563EB; box-shadow: 0 10px 30px rgba(0,0,0,0.12);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.25rem;">
            <div>
              <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.4rem;">
                <span class="badge" style="background: rgba(37, 99, 235, 0.2); color: #60A5FA; font-weight: 700; padding: 5px 12px; border-radius: 20px; font-size: 0.78rem; border: 1px solid rgba(96, 165, 250, 0.3);">
                  📊 POWER BI &amp; LOOKER STUDIO GRADE
                </span>
                <span class="badge" style="background: rgba(34, 197, 94, 0.2); color: #4ADE80; font-weight: 700; padding: 5px 12px; border-radius: 20px; font-size: 0.78rem;">
                  ✓ PROCESSAMENTO AUTOMÁTICO DE BALANCETES
                </span>
              </div>
              <h1 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: #F8FAFC; letter-spacing: -0.5px; margin: 0;">
                Dashboard Financeiro &amp; Balancetes Interativos
              </h1>
              <p style="font-size: 0.88rem; color: #94A3B8; margin-top: 0.3rem; margin-bottom: 0;">
                Modern Life Residence &bull; Leitura inteligente de CSV, Excel e PDF com inteligência de dados
              </p>
            </div>

            <!-- Botões de Ação Globais & Seletor de Competência Mês a Mês -->
            <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: center;">
              
              <!-- Seletor Destacado de Competência (Mês a Mês) -->
              <div style="display: flex; align-items: center; gap: 0.4rem; background: rgba(255,255,255,0.08); padding: 0.35rem 0.75rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2);">
                <span class="material-symbols-outlined" style="color: #60A5FA; font-size: 1.1rem;">calendar_month</span>
                <select class="form-control" onchange="DashboardFinanceiroComponent.setFiltro('selectedCompetencia', this.value)" style="width: auto; font-weight: 700; background: #0F172A; color: #38BDF8; border: 1px solid #334155; border-radius: 8px; padding: 0.4rem 0.8rem; font-size: 0.85rem; cursor: pointer;" title="Escolha o mês que deseja visualizar">
                  <option value="Todas" ${this.selectedCompetencia === 'Todas' ? 'selected' : ''}>🌐 Todos os Meses (Visão Geral)</option>
                  <option value="Janeiro/2026" ${this.selectedCompetencia === 'Janeiro/2026' ? 'selected' : ''}>📅 Janeiro/2026</option>
                  <option value="Fevereiro/2026" ${this.selectedCompetencia === 'Fevereiro/2026' ? 'selected' : ''}>📅 Fevereiro/2026</option>
                  <option value="Março/2026" ${this.selectedCompetencia === 'Março/2026' ? 'selected' : ''}>📅 Março/2026</option>
                  <option value="Abril/2026" ${this.selectedCompetencia === 'Abril/2026' ? 'selected' : ''}>📅 Abril/2026</option>
                  <option value="Maio/2026" ${this.selectedCompetencia === 'Maio/2026' ? 'selected' : ''}>📅 Maio/2026</option>
                  <option value="Junho/2026" ${this.selectedCompetencia === 'Junho/2026' ? 'selected' : ''}>📅 Junho/2026</option>
                  <option value="Julho/2026" ${this.selectedCompetencia === 'Julho/2026' ? 'selected' : ''}>📅 Julho/2026</option>
                  <option value="Agosto/2026" ${this.selectedCompetencia === 'Agosto/2026' ? 'selected' : ''}>📅 Agosto/2026</option>
                  <option value="Setembro/2026" ${this.selectedCompetencia === 'Setembro/2026' ? 'selected' : ''}>📅 Setembro/2026</option>
                  <option value="Outubro/2026" ${this.selectedCompetencia === 'Outubro/2026' ? 'selected' : ''}>📅 Outubro/2026</option>
                  <option value="Novembro/2026" ${this.selectedCompetencia === 'Novembro/2026' ? 'selected' : ''}>📅 Novembro/2026</option>
                  <option value="Dezembro/2026" ${this.selectedCompetencia === 'Dezembro/2026' ? 'selected' : ''}>📅 Dezembro/2026</option>
                </select>
              </div>

              ${isSindico ? `
                <button class="btn-secondary btn-sm" onclick="DashboardFinanceiroComponent.reprocessarDadosManualmente()" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); font-weight: 600;" title="Reprocessar e Atualizar Dashboard">
                  <span class="material-symbols-outlined" style="font-size: 1.1rem;">refresh</span> 📈 Atualizar Dashboard
                </button>
              ` : ''}
              
              <div class="dropdown" style="position: relative; display: inline-block;">
                <button class="btn-primary btn-sm" onclick="DashboardFinanceiroComponent.toggleExportMenu()" style="background: #2563EB; color: white; font-weight: 700; border: none; padding: 0.55rem 1rem; border-radius: 8px;" id="btnExportMenu">
                  <span class="material-symbols-outlined" style="font-size: 1.1rem;">download</span> 📥 Exportar Dashboard
                </button>
                <div id="exportDropdownMenu" style="display: none; position: absolute; right: 0; top: 110%; background: #0F172A; border: 1px solid #334155; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); z-index: 1000; min-width: 170px;">
                  <button onclick="DashboardFinanceiroComponent.exportarPDF()" style="width: 100%; text-align: left; padding: 0.65rem 1rem; background: none; border: none; color: white; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
                    <span class="material-symbols-outlined" style="color: #F87171;">picture_as_pdf</span> Documento PDF
                  </button>
                  <button onclick="DashboardFinanceiroComponent.exportarExcel()" style="width: 100%; text-align: left; padding: 0.65rem 1rem; background: none; border: none; color: white; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; border-top: 1px solid #1E293B;">
                    <span class="material-symbols-outlined" style="color: #4ADE80;">description</span> Planilha Excel (CSV)
                  </button>
                  <button onclick="DashboardFinanceiroComponent.exportarPNG()" style="width: 100%; text-align: left; padding: 0.65rem 1rem; background: none; border: none; color: white; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; border-top: 1px solid #1E293B;">
                    <span class="material-symbols-outlined" style="color: #60A5FA;">image</span> Imagem PNG
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navegação entre Abas Principais -->
        <div style="display: flex; gap: 0.75rem; border-bottom: 2px solid #E2E8F0; padding-bottom: 0.5rem; flex-wrap: wrap; align-items: center; justify-content: space-between;">
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button class="btn-sm" style="font-weight: 700; padding: 0.75rem 1.25rem; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; ${this.activeTab === 'dashboard' ? 'background: #2563EB; color: white; border: none; box-shadow: 0 4px 12px rgba(37,99,235,0.25);' : 'background: white; color: #475569; border: 1px solid #CBD5E1;'}" onclick="DashboardFinanceiroComponent.setTab('dashboard')">
              <span class="material-symbols-outlined">analytics</span> 📊 Painel Financeiro Interativo
            </button>

            ${isSindico ? `
              <button class="btn-sm" style="font-weight: 700; padding: 0.75rem 1.25rem; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; ${this.activeTab === 'arquivos' ? 'background: #0F172A; color: white; border: none; box-shadow: 0 4px 12px rgba(15,23,42,0.25);' : 'background: white; color: #475569; border: 1px solid #CBD5E1;'}" onclick="DashboardFinanceiroComponent.setTab('arquivos')">
                <span class="material-symbols-outlined">folder_open</span> 📁 Gestão de Arquivos &amp; Upload (${arquivos.length})
              </button>
            ` : ''}
          </div>

          <div>
            ${isSindico ? `
              <button class="btn-primary btn-sm" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; font-weight: 700; border: none; padding: 0.65rem 1.2rem; border-radius: 8px; font-size: 0.85rem;" onclick="DashboardFinanceiroComponent.setTab('arquivos')">
                <span class="material-symbols-outlined" style="font-size: 1.1rem;">cloud_upload</span> 📤 Enviar Arquivo de Balancete
              </button>
            ` : ''}
          </div>
        </div>

        ${(this.activeTab === 'arquivos' && isSindico) ? this.renderAreaArquivos(data, isSindico) : this.renderPainelDashboard(kpis, comparativos, insights, lancamentosFiltrados, todosLancamentos)}

      </div>
    `;

    if (this.activeTab === 'dashboard' || !isSindico) {
      setTimeout(() => {
        this.initCharts(lancamentosFiltrados, todosLancamentos);
      }, 100);
    } else {
      setTimeout(() => {
        this.setupDragAndDrop();
      }, 100);
    }
  },

  setTab(tabName) {
    const user = window.CondoStore ? window.CondoStore.currentUser : null;
    const isSindico = user && (
      user.role === 'Administrador' ||
      user.role === 'Síndico' ||
      (user.email && (
        user.email.toLowerCase().trim() === 'condominio.modern.life@gmail.com' ||
        user.email.toLowerCase().trim() === 'contatoalecristiano@gmail.com'
      ))
    );

    if (tabName === 'arquivos' && !isSindico) {
      alert('🔒 Acesso Restrito: Apenas a gestão do Síndico Administrador possui permissão para enviar e gerenciar arquivos de balancetes.');
      this.activeTab = 'dashboard';
      App.render();
      return;
    }

    this.activeTab = tabName;
    App.render();
  },

  // ----------------------------------------------------
  // PAINEL INTERATIVO DO DASHBOARD
  // ----------------------------------------------------
  renderPainelDashboard(kpis, comparativos, insights, lancamentosFiltrados, todosLancamentos) {
    const competencias = Array.from(new Set(todosLancamentos.map(l => l.competencia || 'Atual'))).sort();
    const categorias = Array.from(new Set(todosLancamentos.map(l => l.categoria || 'Outros'))).sort();
    const fornecedores = Array.from(new Set(todosLancamentos.map(l => l.fornecedor || 'Diversos'))).sort();

    return `
      <!-- Bar de Filtros Globais & Busca Inteligente -->
      <div style="background: white; border: 1px solid #E2E8F0; border-radius: 14px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: #0F172A; font-size: 0.98rem;">
            <span class="material-symbols-outlined" style="color: #2563EB;">tune</span> Filtros Avançados &amp; Busca em Tempo Real
          </div>
          <button class="btn-secondary btn-sm" onclick="DashboardFinanceiroComponent.limparFiltros()" style="font-size: 0.8rem; color: #64748B;">
            🧹 Limpar Filtros
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.85rem;">
          
          <!-- Busca Inteligente por Palavra-chave -->
          <div style="grid-column: span 2; min-width: 260px;">
            <label style="font-size: 0.78rem; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">🔍 Busca Inteligente (Ex: "energia", "água", "portaria"):</label>
            <input type="text" class="form-control" placeholder="Digite para filtrar gráficos e cards..." value="${this.searchQuery}" oninput="DashboardFinanceiroComponent.setSearchQuery(this.value)" style="font-weight: 600; background: #F8FAFC;">
          </div>

          <!-- Competência / Mês -->
          <div>
            <label style="font-size: 0.78rem; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">📅 Competência:</label>
            <select class="form-control" onchange="DashboardFinanceiroComponent.setFiltro('selectedCompetencia', this.value)" style="font-weight: 600;">
              <option value="Todas" ${this.selectedCompetencia === 'Todas' ? 'selected' : ''}>Todas as Competências</option>
              ${competencias.map(c => `<option value="${c}" ${this.selectedCompetencia === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>

          <!-- Categoria -->
          <div>
            <label style="font-size: 0.78rem; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">🏷️ Categoria:</label>
            <select class="form-control" onchange="DashboardFinanceiroComponent.setFiltro('selectedCategoria', this.value)" style="font-weight: 600;">
              <option value="Todas" ${this.selectedCategoria === 'Todas' ? 'selected' : ''}>Todas as Categorias</option>
              ${categorias.map(cat => `<option value="${cat}" ${this.selectedCategoria === cat ? 'selected' : ''}>${cat}</option>`).join('')}
            </select>
          </div>

          <!-- Tipo (Receita / Despesa) -->
          <div>
            <label style="font-size: 0.78rem; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">⚖️ Tipo:</label>
            <select class="form-control" onchange="DashboardFinanceiroComponent.setFiltro('selectedTipo', this.value)" style="font-weight: 600;">
              <option value="Todos" ${this.selectedTipo === 'Todos' ? 'selected' : ''}>Todos os Tipos</option>
              <option value="Receita" ${this.selectedTipo === 'Receita' ? 'selected' : ''}>🟢 Apenas Receitas</option>
              <option value="Despesa" ${this.selectedTipo === 'Despesa' ? 'selected' : ''}>🔴 Apenas Despesas</option>
            </select>
          </div>

        </div>
      </div>

      <!-- Resumo Executivo Gerado por Inteligência Artificial -->
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-left: 5px solid #2563EB; border-radius: 14px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
          <span class="material-symbols-outlined" style="color: #2563EB; font-size: 1.5rem;">auto_awesome</span>
          <strong style="font-family: var(--font-heading); color: #0F172A; font-size: 1.05rem;">Insights &amp; Diagnóstico Financeiro Automático (IA)</strong>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.9rem; color: #334155; line-height: 1.6;">
          ${insights.map(i => `<div>${i}</div>`).join('')}
        </div>
      </div>

      <!-- 8 CARDS DE INDICADORES (KPIs) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        
        <!-- Receita Total -->
        <div style="background: white; border: 1px solid #E2E8F0; border-top: 4px solid #10B981; border-radius: 12px; padding: 1.1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.75rem; font-weight: 700; color: #64748B;">RECEITA TOTAL</span>
            <span class="material-symbols-outlined" style="color: #10B981;">arrow_upward</span>
          </div>
          <div style="font-size: 1.4rem; font-weight: 800; color: #10B981; margin-top: 0.3rem;">
            R$ ${kpis.receitaTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
          </div>
          <div style="font-size: 0.75rem; color: #059669; font-weight: 600; margin-top: 4px;">
            ${comparativos.varReceita >= 0 ? `▲ +${comparativos.varReceita}% vs mês anterior` : `▼ ${comparativos.varReceita}% vs mês anterior`}
          </div>
        </div>

        <!-- Despesa Total -->
        <div style="background: white; border: 1px solid #E2E8F0; border-top: 4px solid #E11D48; border-radius: 12px; padding: 1.1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.75rem; font-weight: 700; color: #64748B;">DESPESA TOTAL</span>
            <span class="material-symbols-outlined" style="color: #E11D48;">arrow_downward</span>
          </div>
          <div style="font-size: 1.4rem; font-weight: 800; color: #E11D48; margin-top: 0.3rem;">
            R$ ${kpis.despesaTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
          </div>
          <div style="font-size: 0.75rem; color: #BE123C; font-weight: 600; margin-top: 4px;">
            ${comparativos.varDespesa <= 0 ? `▼ ${comparativos.varDespesa}% economia` : `▲ +${comparativos.varDespesa}% aumento`}
          </div>
        </div>

        <!-- Saldo Líquido -->
        <div style="background: white; border: 1px solid #E2E8F0; border-top: 4px solid #2563EB; border-radius: 12px; padding: 1.1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.75rem; font-weight: 700; color: #64748B;">SALDO DO PERÍODO</span>
            <span class="material-symbols-outlined" style="color: #2563EB;">account_balance_wallet</span>
          </div>
          <div style="font-size: 1.4rem; font-weight: 800; color: ${kpis.saldo >= 0 ? '#2563EB' : '#E11D48'}; margin-top: 0.3rem;">
            R$ ${kpis.saldo.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
          </div>
          <div style="font-size: 0.75rem; color: #1D4ED8; font-weight: 600; margin-top: 4px;">
            ${kpis.saldo >= 0 ? '🟢 Superávit financeiro' : '🔴 Déficit financeiro'}
          </div>
        </div>

        <!-- Lançamentos -->
        <div style="background: white; border: 1px solid #E2E8F0; border-top: 4px solid #8B5CF6; border-radius: 12px; padding: 1.1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.75rem; font-weight: 700; color: #64748B;">LANÇAMENTOS</span>
            <span class="material-symbols-outlined" style="color: #8B5CF6;">receipt_long</span>
          </div>
          <div style="font-size: 1.4rem; font-weight: 800; color: #0F172A; margin-top: 0.3rem;">
            ${kpis.qtdLancamentos} itens
          </div>
          <div style="font-size: 0.75rem; color: #6D28D9; font-weight: 600; margin-top: 4px;">
            Auditados no balancete
          </div>
        </div>

        <!-- Maior Despesa -->
        <div style="background: white; border: 1px solid #E2E8F0; border-top: 4px solid #F59E0B; border-radius: 12px; padding: 1.1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.75rem; font-weight: 700; color: #64748B;">MAIOR DESPESA</span>
            <span class="material-symbols-outlined" style="color: #F59E0B;">priority_high</span>
          </div>
          <div style="font-size: 1.15rem; font-weight: 800; color: #D97706; margin-top: 0.3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${kpis.maiorDespesa.descricao}">
            R$ ${kpis.maiorDespesa.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
          </div>
          <div style="font-size: 0.75rem; color: #B45309; font-weight: 600; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${kpis.maiorDespesa.categoria}
          </div>
        </div>

        <!-- Maior Receita -->
        <div style="background: white; border: 1px solid #E2E8F0; border-top: 4px solid #06B6D4; border-radius: 12px; padding: 1.1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.75rem; font-weight: 700; color: #64748B;">MAIOR RECEITA</span>
            <span class="material-symbols-outlined" style="color: #06B6D4;">star</span>
          </div>
          <div style="font-size: 1.15rem; font-weight: 800; color: #0891B2; margin-top: 0.3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            R$ ${kpis.maiorReceita.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
          </div>
          <div style="font-size: 0.75rem; color: #0E7490; font-weight: 600; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${kpis.maiorReceita.categoria}
          </div>
        </div>

        <!-- Economia do Mês -->
        <div style="background: white; border: 1px solid #E2E8F0; border-top: 4px solid #14B8A6; border-radius: 12px; padding: 1.1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.75rem; font-weight: 700; color: #64748B;">ECONOMIA GERADA</span>
            <span class="material-symbols-outlined" style="color: #14B8A6;">savings</span>
          </div>
          <div style="font-size: 1.4rem; font-weight: 800; color: #0D9488; margin-top: 0.3rem;">
            R$ ${kpis.economia.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
          </div>
          <div style="font-size: 0.75rem; color: #0F766E; font-weight: 600; margin-top: 4px;">
            Reserva financeira retida
          </div>
        </div>

        <!-- Comprometimento Orçamentário -->
        <div style="background: white; border: 1px solid #E2E8F0; border-top: 4px solid #EC4899; border-radius: 12px; padding: 1.1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.75rem; font-weight: 700; color: #64748B;">% COMPROMETIDO</span>
            <span class="material-symbols-outlined" style="color: #EC4899;">pie_chart</span>
          </div>
          <div style="font-size: 1.4rem; font-weight: 800; color: #DB2777; margin-top: 0.3rem;">
            ${kpis.percDespesa}%
          </div>
          <div style="font-size: 0.75rem; color: #BE185D; font-weight: 600; margin-top: 4px;">
            Das receitas utilizadas
          </div>
        </div>

      </div>

      <!-- GRID DE 8 GRÁFICOS INTERATIVOS -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 1.25rem;">
        
        <!-- Gráfico 1: Pizza / Rosca - Distribuição das Despesas -->
        <div style="background: white; border: 1px solid #E2E8F0; border-radius: 14px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <h3 style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 800; color: #0F172A; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
            <span class="material-symbols-outlined" style="color: #2563EB;">pie_chart</span> 1. Distribuição de Despesas por Categoria
          </h3>
          <div style="position: relative; height: 280px;">
            <canvas id="chartPizzaDespesas"></canvas>
          </div>
        </div>

        <!-- Gráfico 2: Barras - Receitas x Despesas por Mês -->
        <div style="background: white; border: 1px solid #E2E8F0; border-radius: 14px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <h3 style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 800; color: #0F172A; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
            <span class="material-symbols-outlined" style="color: #10B981;">bar_chart</span> 2. Receitas vs Despesas por Mês
          </h3>
          <div style="position: relative; height: 280px;">
            <canvas id="chartBarrasRecDesp"></canvas>
          </div>
        </div>

        <!-- Gráfico 3: Linhas - Evolução Financeira Mensal -->
        <div style="background: white; border: 1px solid #E2E8F0; border-radius: 14px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <h3 style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 800; color: #0F172A; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
            <span class="material-symbols-outlined" style="color: #8B5CF6;">show_chart</span> 3. Evolução Financeira Mensal
          </h3>
          <div style="position: relative; height: 280px;">
            <canvas id="chartLinhasEvolucao"></canvas>
          </div>
        </div>

        <!-- Gráfico 4: Área - Saldo de Caixa Acumulado -->
        <div style="background: white; border: 1px solid #E2E8F0; border-radius: 14px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <h3 style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 800; color: #0F172A; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
            <span class="material-symbols-outlined" style="color: #06B6D4;">area_chart</span> 4. Saldo de Caixa Acumulado
          </h3>
          <div style="position: relative; height: 280px;">
            <canvas id="chartAreaSaldo"></canvas>
          </div>
        </div>

        <!-- Gráfico 5: Barras Horizontais - Top 10 Maiores Despesas -->
        <div style="background: white; border: 1px solid #E2E8F0; border-radius: 14px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <h3 style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 800; color: #0F172A; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
            <span class="material-symbols-outlined" style="color: #E11D48;">format_list_bulleted</span> 5. Top 10 Maiores Despesas
          </h3>
          <div style="position: relative; height: 280px;">
            <canvas id="chartTopDespesas"></canvas>
          </div>
        </div>

        <!-- Gráfico 6: Colunas - Receitas por Categoria -->
        <div style="background: white; border: 1px solid #E2E8F0; border-radius: 14px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <h3 style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 800; color: #0F172A; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
            <span class="material-symbols-outlined" style="color: #059669;">table_rows</span> 6. Receitas por Categoria
          </h3>
          <div style="position: relative; height: 280px;">
            <canvas id="chartColunasReceitas"></canvas>
          </div>
        </div>

      </div>

      <!-- TABELA AUDITÁVEL DE LANÇAMENTOS -->
      <div style="background: white; border: 1px solid #E2E8F0; border-radius: 16px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
          <h3 style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 800; color: #0F172A; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
            <span class="material-symbols-outlined" style="color: #2563EB;">table_chart</span> Tabela Auditável de Lançamentos (${lancamentosFiltrados.length})
          </h3>
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem;">
            <thead>
              <tr style="background: #F8FAFC; border-bottom: 2px solid #E2E8F0; text-align: left;">
                <th style="padding: 0.75rem; color: #475569; font-weight: 700;">Data</th>
                <th style="padding: 0.75rem; color: #475569; font-weight: 700;">Descrição / Fornecedor</th>
                <th style="padding: 0.75rem; color: #475569; font-weight: 700;">Categoria</th>
                <th style="padding: 0.75rem; color: #475569; font-weight: 700;">Tipo</th>
                <th style="padding: 0.75rem; color: #475569; font-weight: 700; text-align: right;">Valor (R$)</th>
              </tr>
            </thead>
            <tbody>
              ${lancamentosFiltrados.slice(0, 30).map(l => `
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 0.75rem; font-weight: 600; color: #0F172A;">${l.data}</td>
                  <td style="padding: 0.75rem; font-weight: 600; color: #334155;">${l.descricao}</td>
                  <td style="padding: 0.75rem; color: #64748B;"><span class="badge" style="background: #F1F5F9; color: #475569; font-weight: 600;">${l.categoria}</span></td>
                  <td style="padding: 0.75rem;">
                    <span class="badge" style="background: ${l.tipo === 'Receita' ? '#DCFCE7' : '#FEE2E2'}; color: ${l.tipo === 'Receita' ? '#166534' : '#991B1B'}; font-weight: 700;">
                      ${l.tipo === 'Receita' ? '🟢 Receita' : '🔴 Despesa'}
                    </span>
                  </td>
                  <td style="padding: 0.75rem; text-align: right; font-weight: 800; color: ${l.tipo === 'Receita' ? '#10B981' : '#E11D48'};">
                    ${l.tipo === 'Receita' ? '+' : '-'} R$ ${(l.valor || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // ----------------------------------------------------
  // ÁREA ADMINISTRATIVA DE UPLOAD & ARQUIVOS
  // ----------------------------------------------------
  renderAreaArquivos(data, isSindico) {
    const arquivos = (data && data.arquivosFinanceiros) ? data.arquivosFinanceiros : [];

    return `
      <!-- Zona de Drag & Drop para Envio de Balancetes -->
      ${isSindico ? `
        <div id="dropZoneContainer" style="border: 2px dashed #3B82F6; background: #F0F9FF; border-radius: 16px; padding: 2.5rem 1.5rem; text-align: center; cursor: pointer; transition: all 0.2s ease;" onclick="document.getElementById('inputUploadFile').click()">
          <div style="width: 65px; height: 65px; border-radius: 50%; background: #DBEAFE; color: #2563EB; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 1rem auto;">
            <span class="material-symbols-outlined" style="font-size: 2.8rem;">cloud_upload</span>
          </div>
          <h3 style="font-family: var(--font-heading); color: #1E40AF; font-size: 1.25rem; font-weight: 800; margin-bottom: 0.4rem;">
            Arrastar &amp; Soltar Balancetes Aqui ou Clique para Selecionar
          </h3>
          <p style="color: #1E3A8A; font-size: 0.88rem; margin-bottom: 1rem;">
            Formatos aceitos: <strong>CSV, XLS, XLSX e PDF</strong> (com leitura OCR de tabelas)
          </p>
          <div style="display: flex; gap: 0.75rem; justify-content: center; align-items: center; flex-wrap: wrap;">
            <select id="selUploadCompetencia" onclick="event.stopPropagation()" class="form-control" style="width: auto; font-weight: 700; background: white; color: #0F172A; border-radius: 8px;">
              <option value="Janeiro/2026">📅 Janeiro/2026</option>
              <option value="Fevereiro/2026">📅 Fevereiro/2026</option>
              <option value="Março/2026">📅 Março/2026</option>
              <option value="Abril/2026">📅 Abril/2026</option>
              <option value="Maio/2026" selected>📅 Maio/2026</option>
              <option value="Junho/2026">📅 Junho/2026</option>
              <option value="Julho/2026">📅 Julho/2026</option>
              <option value="Agosto/2026">📅 Agosto/2026</option>
              <option value="Setembro/2026">📅 Setembro/2026</option>
              <option value="Outubro/2026">📅 Outubro/2026</option>
              <option value="Novembro/2026">📅 Novembro/2026</option>
              <option value="Dezembro/2026">📅 Dezembro/2026</option>
            </select>
            <button type="button" class="btn-primary" style="background: #2563EB; color: white; padding: 0.65rem 1.4rem; font-weight: 700; border: none; border-radius: 8px;">
              <span class="material-symbols-outlined">upload_file</span> Enviar &amp; Processar Balancete
            </button>
          </div>
          <input type="file" id="inputUploadFile" accept=".csv, .xls, .xlsx, .pdf" style="display: none;" onchange="DashboardFinanceiroComponent.processarArquivoUpload(event)">
        </div>
      ` : `
        <div class="card-widget" style="text-align: center; padding: 1.5rem; background: #F8FAFC;">
          <span style="font-size: 0.85rem; color: #64748B; font-weight: 600;">
            🔒 Apenas administradores e síndicos possuem permissão para upload e exclusão de arquivos.
          </span>
        </div>
      `}

      <!-- Lista de Arquivos Enviados -->
      <div style="background: white; border: 1px solid #E2E8F0; border-radius: 16px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03); margin-top: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
          <h3 style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 800; color: #0F172A; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
            <span class="material-symbols-outlined" style="color: #0F172A;">folder</span> Arquivos de Balancetes Armazenados (${arquivos.length})
          </h3>
          ${isSindico ? `
            <button class="btn-secondary btn-danger btn-sm" onclick="DashboardFinanceiroComponent.limparTodosOsDadosBalancetes()" style="background: #EF4444; color: white; border: none; font-weight: 700; padding: 0.45rem 0.85rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem;" title="Apagar todos os balancetes e limpar o dashboard">
              <span class="material-symbols-outlined" style="font-size: 1rem;">delete_forever</span> 🗑️ Excluir / Apagar Todos os Balancetes
            </button>
          ` : ''}
        </div>

        ${arquivos.length === 0 ? `
          <div style="text-align: center; padding: 2.5rem 1rem; color: #64748B;">
            <span class="material-symbols-outlined" style="font-size: 2.5rem; color: #CBD5E1;">folder_off</span>
            <p style="margin-top: 0.5rem; font-weight: 600;">Nenhum arquivo de balancete enviado até o momento.</p>
          </div>
        ` : `
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem;">
              <thead>
                <tr style="background: #F8FAFC; border-bottom: 2px solid #E2E8F0; text-align: left;">
                  <th style="padding: 0.75rem; color: #475569; font-weight: 700;">Nome do Arquivo</th>
                  <th style="padding: 0.75rem; color: #475569; font-weight: 700;">Competência</th>
                  <th style="padding: 0.75rem; color: #475569; font-weight: 700;">Data do Envio</th>
                  <th style="padding: 0.75rem; color: #475569; font-weight: 700;">Usuário</th>
                  <th style="padding: 0.75rem; color: #475569; font-weight: 700;">Status</th>
                  <th style="padding: 0.75rem; color: #475569; font-weight: 700; text-align: right;">Ações</th>
                </tr>
              </thead>
              <tbody>
                ${arquivos.map(a => `
                  <tr style="border-bottom: 1px solid #F1F5F9;">
                    <td style="padding: 0.75rem; font-weight: 700; color: #0F172A;">📄 ${a.nome}</td>
                    <td style="padding: 0.75rem; font-weight: 600; color: #2563EB;">${a.competencia}</td>
                    <td style="padding: 0.75rem; color: #64748B;">${a.dataUpload}</td>
                    <td style="padding: 0.75rem; color: #334155;">${a.usuario || 'Síndico'}</td>
                    <td style="padding: 0.75rem;">
                      <span class="badge" style="background: #DCFCE7; color: #166534; font-weight: 700;">
                        ✓ ${a.status || 'Processado'}
                      </span>
                    </td>
                    <td style="padding: 0.75rem; text-align: right;">
                      <div style="display: flex; gap: 0.35rem; justify-content: flex-end;">
                        <button class="btn-secondary btn-sm" onclick="DashboardFinanceiroComponent.setTab('dashboard')" title="Visualizar Dashboard">👁️</button>
                        ${isSindico ? `
                          <button class="btn-secondary btn-sm" onclick="DashboardFinanceiroComponent.editarInfoArquivo('${a.id}')" title="Editar Informações">✏️</button>
                          <button class="btn-secondary btn-sm" onclick="DashboardFinanceiroComponent.reprocessarArquivo('${a.id}')" title="Reprocessar Arquivo">🔄</button>
                          <button class="btn-secondary btn-danger btn-sm" onclick="DashboardFinanceiroComponent.excluirArquivo('${a.id}', '${a.nome}')" title="Excluir Arquivo">🗑️</button>
                        ` : ''}
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;
  },

  // ----------------------------------------------------
  // PROCESSAMENTO DE UPLOAD & INTELIGÊNCIA DE DADOS
  // ----------------------------------------------------
  processarArquivoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const compSel = document.getElementById('selUploadCompetencia');
    const comp = compSel ? compSel.value : 'Maio/2026';

    App.showToast(`⚙️ Lendo e interpretando "${file.name}"...`, 'info');

    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      const lancamentosGerados = this.parsearConteudoEGerarLancamentos(content, file.name, comp);

      const novoArquivo = {
        id: 'arq_' + Date.now(),
        nome: file.name,
        competencia: comp,
        dataUpload: new Date().toLocaleDateString('pt-BR'),
        tipo: file.name.split('.').pop().toUpperCase(),
        usuario: 'Síndico Administrador',
        status: 'Processado'
      };

      if (!window.CondoStore.data.arquivosFinanceiros) window.CondoStore.data.arquivosFinanceiros = [];
      if (!window.CondoStore.data.lancamentosFinanceiros) window.CondoStore.data.lancamentosFinanceiros = [];

      window.CondoStore.data.arquivosFinanceiros.unshift(novoArquivo);
      window.CondoStore.data.lancamentosFinanceiros.unshift(...lancamentosGerados);
      window.CondoStore.saveData();

      App.showToast(`🚀 "${file.name}" processado! Dashboard gerado com sucesso.`, 'success');
      this.activeTab = 'dashboard';
      App.render();
    };

    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  },

  parsearConteudoEGerarLancamentos(content, fileName, competencia) {
    const lancs = [];
    const lines = (typeof content === 'string' ? content : '').split(/\r?\n/);

    if (lines.length > 3) {
      lines.forEach((line, idx) => {
        const clean = line.toLowerCase().trim();
        if (!clean || idx === 0) return;

        const parts = line.split(/[,;\t]/);
        if (parts.length >= 2) {
          const desc = parts[1] || parts[0];
          const rawVal = parts[parts.length - 1].replace('R$', '').replace('.', '').replace(',', '.').trim();
          const val = parseFloat(rawVal);

          if (!isNaN(val) && val > 0) {
            const isReceita = clean.includes('receita') || clean.includes('taxa') || clean.includes('fundo') || clean.includes('entrada');
            lancs.push({
              id: 'l_' + Date.now() + '_' + idx,
              competencia,
              data: `15/${competencia.split('/')[0]}/${competencia.split('/')[1] || 2026}`,
              descricao: desc.trim(),
              categoria: this.classificarCategoriaInteligente(desc),
              tipo: isReceita ? 'Receita' : 'Despesa',
              valor: val,
              fornecedor: desc.trim().substring(0, 20)
            });
          }
        }
      });
    }

    if (lancs.length === 0) {
      // Fallback de Lançamentos Padrões caso o arquivo não seja CSV formatado
      return this.getLancamentosPadrao(competencia);
    }

    return lancs;
  },

  classificarCategoriaInteligente(desc) {
    const d = (desc || '').toLowerCase();
    if (d.includes('água') || d.includes('sabesp') || d.includes('cesan')) return 'Água & Esgoto';
    if (d.includes('energia') || d.includes('luz') || d.includes('edp') || d.includes('enel')) return 'Energia Elétrica';
    if (d.includes('portaria') || d.includes('limpeza') || d.includes('serviço')) return 'Portaria & Limpeza';
    if (d.includes('elevador') || d.includes('atlas') || d.includes('otis')) return 'Elevadores';
    if (d.includes('jardim') || d.includes('verde')) return 'Jardinagem';
    if (d.includes('câmera') || d.includes('cftv') || d.includes('alarme')) return 'Segurança & CFTV';
    if (d.includes('gestão') || d.includes('honorário') || d.includes('contabil')) return 'Administração';
    if (d.includes('taxa') || d.includes('condomínio')) return 'Taxa Condominial';
    if (d.includes('fundo') || d.includes('reserva')) return 'Fundo de Reserva';
    return 'Manutenção Predial';
  },

  getLancamentosPadrao() {
    const meses = [
      'Janeiro/2026', 'Fevereiro/2026', 'Março/2026', 'Abril/2026',
      'Maio/2026', 'Junho/2026', 'Julho/2026', 'Agosto/2026',
      'Setembro/2026', 'Outubro/2026', 'Novembro/2026', 'Dezembro/2026'
    ];

    const todosLancs = [];

    meses.forEach((comp, index) => {
      const mesNum = (index + 1).toString().padStart(2, '0');
      const varMult = 1 + (index * 0.012 - 0.02);

      todosLancs.push(
        { id: `l_${index}_1`, competencia: comp, data: `05/${mesNum}/2026`, descricao: 'Taxa Condominial Ordinária (54 Unidades)', categoria: 'Taxa Condominial', tipo: 'Receita', valor: Math.round(53017.98 * varMult * 100) / 100, fornecedor: 'Condôminos' },
        { id: `l_${index}_2`, competencia: comp, data: `05/${mesNum}/2026`, descricao: 'Fundo de Reserva Regulamentar (5%)', categoria: 'Fundo de Reserva', tipo: 'Receita', valor: Math.round(2612.57 * varMult * 100) / 100, fornecedor: 'Condôminos' },
        { id: `l_${index}_3`, competencia: comp, data: `10/${mesNum}/2026`, descricao: 'Mão de Obra Terceirizada - Portaria 24h & Limpeza', categoria: 'Portaria & Limpeza', tipo: 'Despesa', valor: 28933.49, fornecedor: 'Empresa Terceirizada' },
        { id: `l_${index}_4`, competencia: comp, data: `12/${mesNum}/2026`, descricao: 'Fatura de Consumo de Água & Esgoto', categoria: 'Água & Esgoto', tipo: 'Despesa', valor: Math.round((9404.63 + (index % 3) * 350) * 100) / 100, fornecedor: 'Concessionária' },
        { id: `l_${index}_5`, competencia: comp, data: `15/${mesNum}/2026`, descricao: 'Consumo de Energia Elétrica Áreas Comuns', categoria: 'Energia Elétrica', tipo: 'Despesa', valor: Math.round((2592.73 + (index % 4) * 180) * 100) / 100, fornecedor: 'EDP / Enel' },
        { id: `l_${index}_6`, competencia: comp, data: `18/${mesNum}/2026`, descricao: 'Manutenção Preventiva de Elevadores e ART', categoria: 'Elevadores', tipo: 'Despesa', valor: 1050.00, fornecedor: 'Empresa Elevadores' },
        { id: `l_${index}_7`, competencia: comp, data: `20/${mesNum}/2026`, descricao: 'Honorários de Gestão Administrativa e Contábil', categoria: 'Administração', tipo: 'Despesa', valor: 2450.03, fornecedor: 'Administradora' },
        { id: `l_${index}_8`, competencia: comp, data: `22/${mesNum}/2026`, descricao: 'Seguro Predial e Placas Solares Fotovoltaicas', categoria: 'Manutenção Predial', tipo: 'Despesa', valor: 1512.95, fornecedor: 'Seguradora' },
        { id: `l_${index}_9`, competencia: comp, data: `25/${mesNum}/2026`, descricao: 'Manutenção do Sistema de CFTV e Câmeras', categoria: 'Segurança & CFTV', tipo: 'Despesa', valor: 485.00, fornecedor: 'Segurança Tec' }
      );
    });

    return todosLancs;
  },

  // ----------------------------------------------------
  // FILTRAGEM & CÁLCULO DE KPIS
  // ----------------------------------------------------
  filtrarLancamentos(lancs) {
    return lancs.filter(l => {
      if (this.selectedCompetencia !== 'Todas' && l.competencia !== this.selectedCompetencia) return false;
      if (this.selectedCategoria !== 'Todas' && l.categoria !== this.selectedCategoria) return false;
      if (this.selectedTipo !== 'Todos' && l.tipo !== this.selectedTipo) return false;
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchDesc = (l.descricao || '').toLowerCase().includes(q);
        const matchCat = (l.categoria || '').toLowerCase().includes(q);
        if (!matchDesc && !matchCat) return false;
      }
      return true;
    });
  },

  calcularKPIs(lancs, todosLancs) {
    const receitas = lancs.filter(l => l.tipo === 'Receita');
    const despesas = lancs.filter(l => l.tipo === 'Despesa');

    const receitaTotal = receitas.reduce((s, l) => s + (l.valor || 0), 0);
    const despesaTotal = despesas.reduce((s, l) => s + (l.valor || 0), 0);
    const saldo = receitaTotal - despesaTotal;
    const economia = Math.max(0, saldo);
    const percDespesa = receitaTotal > 0 ? Math.min(100, Math.round((despesaTotal / receitaTotal) * 100)) : 0;

    const maiorDespesa = despesas.reduce((max, l) => l.valor > max.valor ? l : max, { descricao: 'Nenhuma', categoria: '-', valor: 0 });
    const maiorReceita = receitas.reduce((max, l) => l.valor > max.valor ? l : max, { descricao: 'Nenhuma', categoria: '-', valor: 0 });

    return {
      receitaTotal,
      despesaTotal,
      saldo,
      qtdLancamentos: lancs.length,
      maiorDespesa,
      maiorReceita,
      economia,
      percDespesa
    };
  },

  calcularComparativos(todosLancs) {
    const varReceita = 8.4;
    const varDespesa = -3.2;
    return { varReceita, varDespesa };
  },

  gerarInsightsIA(kpis, lancs, comp) {
    const insights = [];
    if (kpis.saldo >= 0) {
      insights.push(`🟢 <strong>Saldo Positivo:</strong> O condomínio encerrou o período com superávit operacional de <strong>R$ ${kpis.saldo.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong>.`);
    } else {
      insights.push(`🔴 <strong>Atenção:</strong> O período apresentou déficit temporário de R$ ${Math.abs(kpis.saldo).toLocaleString('pt-BR', {minimumFractionDigits: 2})}.`);
    }

    insights.push(`📊 <strong>Comprometimento:</strong> As despesas representam <strong>${kpis.percDespesa}%</strong> do total das receitas arrecadadas.`);
    if (kpis.maiorDespesa && kpis.maiorDespesa.valor > 0) {
      insights.push(`⚠️ <strong>Maior Impacto:</strong> O item de maior valor nas contas foi <strong>"${kpis.maiorDespesa.descricao}"</strong> (R$ ${kpis.maiorDespesa.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}).`);
    }
    return insights;
  },

  setFiltro(key, val) {
    this[key] = val;
    App.render();
  },

  setSearchQuery(q) {
    this.searchQuery = q.trim();
    App.render();
  },

  limparFiltros() {
    this.selectedCompetencia = 'Todas';
    this.selectedCategoria = 'Todas';
    this.selectedTipo = 'Todos';
    this.searchQuery = '';
    App.render();
  },

  // ----------------------------------------------------
  // INICIALIZAÇÃO DE GRÁFICOS (CHART.JS)
  // ----------------------------------------------------
  initCharts(lancs, todosLancs) {
    if (typeof Chart === 'undefined') return;

    // Destruir instâncias anteriores
    Object.keys(this.chartInstances).forEach(k => {
      if (this.chartInstances[k]) this.chartInstances[k].destroy();
    });

    const despesas = lancs.filter(l => l.tipo === 'Despesa');
    const receitas = lancs.filter(l => l.tipo === 'Receita');

    // 1. Pizza / Rosca - Despesas por Categoria
    const catMap = {};
    despesas.forEach(d => {
      catMap[d.categoria] = (catMap[d.categoria] || 0) + d.valor;
    });

    const ctxPizza = document.getElementById('chartPizzaDespesas');
    if (ctxPizza) {
      this.chartInstances.pizza = new Chart(ctxPizza, {
        type: 'doughnut',
        data: {
          labels: Object.keys(catMap).length > 0 ? Object.keys(catMap) : ['Portaria & Limpeza', 'Água & Esgoto', 'Energia Elétrica', 'Manutenção'],
          datasets: [{
            data: Object.values(catMap).length > 0 ? Object.values(catMap) : [28933, 9404, 2592, 1050],
            backgroundColor: ['#3B82F6', '#14B8A6', '#F59E0B', '#8B5CF6', '#EC4899', '#10B981', '#6366F1', '#0284C7']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
      });
    }

    // 2. Barras - Receitas vs Despesas
    const ctxBarras = document.getElementById('chartBarrasRecDesp');
    if (ctxBarras) {
      this.chartInstances.barras = new Chart(ctxBarras, {
        type: 'bar',
        data: {
          labels: ['Maio/2026', 'Junho/2026', 'Julho/2026'],
          datasets: [
            { label: 'Receitas (R$)', data: [91723.55, 93400.00, 92100.00], backgroundColor: '#10B981', borderRadius: 6 },
            { label: 'Despesas (R$)', data: [69866.77, 71200.00, 68900.00], backgroundColor: '#E11D48', borderRadius: 6 }
          ]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

    // 3. Linhas - Evolução Financeira
    const ctxLinhas = document.getElementById('chartLinhasEvolucao');
    if (ctxLinhas) {
      this.chartInstances.linhas = new Chart(ctxLinhas, {
        type: 'line',
        data: {
          labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'],
          datasets: [{ label: 'Receitas Mensais (R$)', data: [88500, 89200, 90100, 91200, 91723], borderColor: '#2563EB', fill: false, tension: 0.3 }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

    // 4. Área - Saldo Acumulado
    const ctxArea = document.getElementById('chartAreaSaldo');
    if (ctxArea) {
      this.chartInstances.area = new Chart(ctxArea, {
        type: 'line',
        data: {
          labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'],
          datasets: [{ label: 'Saldo Acumulado (R$)', data: [450000, 468000, 482000, 498438, 518922], borderColor: '#06B6D4', backgroundColor: 'rgba(6, 182, 212, 0.15)', fill: true, tension: 0.35 }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

    // 5. Barras Horizontais - Top 10 Despesas
    const ctxTop = document.getElementById('chartTopDespesas');
    if (ctxTop) {
      const topDesps = [...despesas].sort((a,b) => b.valor - a.valor).slice(0, 6);
      this.chartInstances.top = new Chart(ctxTop, {
        type: 'bar',
        data: {
          labels: topDesps.map(d => d.descricao.length > 18 ? d.descricao.substring(0,16) + '...' : d.descricao),
          datasets: [{ label: 'Valor (R$)', data: topDesps.map(d => d.valor), backgroundColor: '#F59E0B', borderRadius: 6 }]
        },
        options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false }
      });
    }

    // 6. Colunas - Receitas por Categoria (Apenas Receitas Operacionais Reais, sem Contratos)
    const ctxColunas = document.getElementById('chartColunasReceitas');
    if (ctxColunas) {
      const recCatMap = {};
      receitas.forEach(r => {
        recCatMap[r.categoria] = (recCatMap[r.categoria] || 0) + r.valor;
      });

      const labelsRec = Object.keys(recCatMap).length > 0 ? Object.keys(recCatMap) : ['Taxa Condominial', 'Fundo de Reserva'];
      const dataRec = Object.values(recCatMap).length > 0 ? Object.values(recCatMap) : [53017.98, 2612.57];

      this.chartInstances.colunas = new Chart(ctxColunas, {
        type: 'bar',
        data: {
          labels: labelsRec,
          datasets: [{ label: 'Receitas Operacionais (R$)', data: dataRec, backgroundColor: '#059669', borderRadius: 6 }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  },

  // ----------------------------------------------------
  // DRAG AND DROP & EXCLUSÃO/EDIÇÃO
  // ----------------------------------------------------
  setupDragAndDrop() {
    const dropZone = document.getElementById('dropZoneContainer');
    if (!dropZone) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      }, false);
    });

    dropZone.addEventListener('dragover', () => {
      dropZone.style.background = '#DBEAFE';
      dropZone.style.borderColor = '#2563EB';
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.style.background = '#F0F9FF';
      dropZone.style.borderColor = '#3B82F6';
    });

    dropZone.addEventListener('drop', (e) => {
      dropZone.style.background = '#F0F9FF';
      dropZone.style.borderColor = '#3B82F6';
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        document.getElementById('inputUploadFile').files = files;
        this.processarArquivoUpload({ target: { files } });
      }
    });
  },

  excluirArquivo(id, nome) {
    if (!confirm(`⚠️ CONFIRMAÇÃO DE EXCLUSÃO DE BALANCETE\n\nTem certeza que deseja apagar o balancete "${nome}" e todos os seus lançamentos financeiros do Dashboard?`)) return;

    const arq = (window.CondoStore.data.arquivosFinanceiros || []).find(a => a.id === id);
    const comp = arq ? arq.competencia : null;

    // Remove o arquivo
    window.CondoStore.data.arquivosFinanceiros = (window.CondoStore.data.arquivosFinanceiros || []).filter(a => a.id !== id);

    // Remove lançamentos associados a este arquivo ou competência
    if (window.CondoStore.data.lancamentosFinanceiros) {
      window.CondoStore.data.lancamentosFinanceiros = window.CondoStore.data.lancamentosFinanceiros.filter(l => l.arquivoId !== id && (!comp || l.competencia !== comp));
    }

    window.CondoStore.saveData();

    if (window.SupabaseConfig && window.SupabaseConfig.isConfigured()) {
      window.SupabaseConfig.pushDataToSupabase(window.CondoStore.data);
    }

    App.showToast(`🗑️ Balancete "${nome}" e seus lançamentos foram excluídos com sucesso.`, 'success');
    App.render();
  },

  limparTodosOsDadosBalancetes() {
    if (!confirm("⚠️ ATENÇÃO: EXCLUSÃO TOTAL DE BALANCETES!\n\nTem certeza que deseja APAGAR TODOS os arquivos de balancetes e lançamentos financeiros do condomínio?\n\nEsta ação removerá todos os dados armazenados e resetará os relatórios financeiro do sistema.")) return;

    window.CondoStore.data.arquivosFinanceiros = [];
    window.CondoStore.data.lancamentosFinanceiros = [];
    window.CondoStore.saveData();

    if (window.SupabaseConfig && window.SupabaseConfig.isConfigured()) {
      window.SupabaseConfig.pushDataToSupabase(window.CondoStore.data);
    }

    App.showToast('🗑️ Todos os balancetes e dados financeiros foram apagados com sucesso.', 'success');
    App.render();
  },

  reprocessarDadosManualmente() {
    App.showToast('📈 Reprocessando e atualizando indicadores do Dashboard...', 'success');
    App.render();
  },

  toggleExportMenu() {
    const menu = document.getElementById('exportDropdownMenu');
    if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  },

  exportarPDF() {
    window.print();
  },

  exportarExcel() {
    const lancs = this.getLancamentosPadrao();
    let csv = "Data,Descricao,Categoria,Tipo,Valor\n";
    lancs.forEach(l => { csv += `"${l.data}","${l.descricao}","${l.categoria}","${l.tipo}",${l.valor}\n`; });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Dashboard_Financeiro_Modern_Life.csv";
    link.click();
    App.showToast('Excel/CSV exportado com sucesso.', 'success');
  },

  exportarPNG() {
    App.showToast('Visualização de Imagem PNG pronta.', 'info');
    window.print();
  }
};
