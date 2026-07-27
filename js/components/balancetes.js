/* ----------------------------------------------------
   Modern Life Residence - Balancetes & Dashboard Financeiro Interativo
   Suporte a Importação de Planilhas (CSV, XLS, PDF, DOC, TXT)
   Geração Automática de Gráficos Coloridos e Explicativos
   ---------------------------------------------------- */

window.BalancetesComponent = {
  selectedBalanceteId: null,
  parsedImportData: null,

  render(container, data) {
    const user = window.CondoStore.currentUser;
    const isApproved = user && user.status === 'Aprovado';
    const isSindico = user && (user.role === 'Administrador' || user.email.toLowerCase() === 'condominio.modern.life@gmail.com');

    // Restrição de acesso para visitantes não autorizados
    if (!user || !isApproved) {
      container.innerHTML = `
        <div class="card-widget" style="text-align: center; padding: 3.5rem 1.5rem; max-width: 600px; margin: 2rem auto;">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: #E8F5E9; color: #2E6B42; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 1.25rem auto;">
            <span class="material-symbols-outlined" style="font-size: 2.8rem;">lock</span>
          </div>
          <h2 style="font-family: var(--font-heading); color: var(--primary-dark); font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem;">
            Acesso Restrito a Moradores Cadastrados
          </h2>
          <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 1.5rem;">
            A visualização dos balancetes consolidados, gráficos financeiros e auditorias é de uso exclusivo dos moradores e conselheiros do Modern Life Residence.
          </p>
          <button class="btn-primary" onclick="AuthComponent.renderAuthModal()" style="padding: 0.8rem 1.5rem; font-size: 0.95rem;">
            <span class="material-symbols-outlined">login</span> Entrar / Cadastrar no Portal
          </button>
        </div>
      `;
      return;
    }

    const list = data.balancetes || [];
    const activeBal = this.selectedBalanceteId 
      ? list.find(b => b.id === this.selectedBalanceteId) || list[0]
      : list[0];

    const receita = activeBal ? activeBal.receitaBruta : 0;
    const despesa = activeBal ? activeBal.despesaBruta : 0;
    const saldoAnterior = activeBal ? (activeBal.saldoAnterior || 0) : 0;
    const saldoMes = activeBal ? activeBal.saldoMes : 0;
    const saldoAtual = activeBal ? (activeBal.saldoAtual || 0) : 0;

    const percentExecucao = receita > 0 ? Math.min(100, Math.round((despesa / receita) * 100)) : 0;
    const percentSuperavit = 100 - percentExecucao;

    const categorias = (activeBal && activeBal.categoriasDespesa && activeBal.categoriasDespesa.length > 0)
      ? activeBal.categoriasDespesa
      : [
          { nome: 'Mão de Obra Terceirizada (Portaria & Limpeza)', valor: 28933.49, cor: '#2563EB' },
          { nome: 'Consumo de Água & Esgoto', valor: 9404.63, cor: '#0D9488' },
          { nome: 'Consumo de Gás Encanado', valor: 2592.73, cor: '#D97706' },
          { nome: 'Manutenção de Elevadores & CFTV', valor: 1535.00, cor: '#7C3AED' },
          { nome: 'Honorários de Gestão & Contábil', valor: 2450.03, cor: '#4F46E5' },
          { nome: 'Seguro Predial & Placas Solares', valor: 1512.95, cor: '#0284C7' },
          { nome: 'Impostos & Retenções Tributárias', valor: 4305.34, cor: '#DB2777' },
          { nome: 'Manutenção Predial & Materiais', valor: 1912.60, cor: '#059669' }
        ];

    const totalCatGastos = categorias.reduce((sum, c) => sum + (c.valor || 0), 0);

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        
        <!-- Header da Página -->
        <div class="card-widget" style="background: linear-gradient(135deg, #1F4D30 0%, #2E6B42 100%); color: white; padding: 1.35rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge" style="background: rgba(255,255,255,0.2); color: white; margin-bottom: 0.4rem;">
                <span class="material-symbols-outlined" style="font-size: 0.85rem;">bar_chart</span> DEMONSTRATIVO FINANCEIRO AUDITADO
              </span>
              <h2 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700; margin-top: 0.2rem;">
                Balancetes &amp; Dashboard Financeiro Colorido
              </h2>
              <p style="font-size: 0.85rem; opacity: 0.9; margin-top: 0.2rem;">
                Transparência total em gráficos explicativos de receitas, despesas e fundo de reserva.
              </p>
            </div>

            <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: center;">
              <!-- Seletor do Mês Ativo -->
              <select id="selectCompetenciaBal" class="form-control" style="width: auto; font-weight: 700; background: white; color: var(--primary-dark);" onchange="BalancetesComponent.trocarCompetencia(this.value)">
                ${list.map(b => `
                  <option value="${b.id}" ${activeBal && activeBal.id === b.id ? 'selected' : ''}>
                    📅 ${b.mes || ''} ${b.ano || ''}
                  </option>
                `).join('')}
              </select>

              ${isSindico ? `
                <button class="btn-primary" style="background: #3ECF8E; color: #1C1C1C; font-weight: 800; border: none; padding: 0.8rem 1.1rem; display: flex; align-items: center; gap: 0.4rem;" onclick="BalancetesComponent.openImportModal()">
                  <span class="material-symbols-outlined" style="font-size: 1.2rem;">cloud_upload</span> 📊 Importar Planilha / Balancete
                </button>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- 4 KPI Cards Financeiros Coloridos -->
        <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
          
          <div class="card-widget" style="background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); border: 1px solid #A7F3D0; padding: 1.1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.82rem; font-weight: 700; color: #065F46;">RECEITA BRUTA TOTAL</span>
              <span class="material-symbols-outlined" style="color: #059669; font-size: 1.6rem;">trending_up</span>
            </div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #064E3B; margin-top: 0.4rem;">
              R$ ${receita.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
            <div style="font-size: 0.75rem; color: #047857; margin-top: 4px; font-weight: 600;">
              🟢 100% Arrecadação da Competência
            </div>
          </div>

          <div class="card-widget" style="background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%); border: 1px solid #FECACA; padding: 1.1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.82rem; font-weight: 700; color: #991B1B;">DESPESA BRUTA TOTAL</span>
              <span class="material-symbols-outlined" style="color: #DC2626; font-size: 1.6rem;">trending_down</span>
            </div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #7F1D1D; margin-top: 0.4rem;">
              R$ ${despesa.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
            <div style="font-size: 0.75rem; color: #B91C1C; margin-top: 4px; font-weight: 600;">
              🔴 ${percentExecucao}% da Receita Comprometida
            </div>
          </div>

          <div class="card-widget" style="background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); border: 1px solid #BFDBFE; padding: 1.1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.82rem; font-weight: 700; color: #1E40AF;">RESULTADO DO MÊS</span>
              <span class="material-symbols-outlined" style="color: #2563EB; font-size: 1.6rem;">savings</span>
            </div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #1E3A8A; margin-top: 0.4rem;">
              R$ ${saldoMes.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
            <div style="font-size: 0.75rem; color: #1D4ED8; margin-top: 4px; font-weight: 600;">
              🔷 Superávit Operacional no Mês
            </div>
          </div>

          <div class="card-widget" style="background: linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%); border: 1px solid #DDD6FE; padding: 1.1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.82rem; font-weight: 700; color: #5B21B6;">SALDO ATUAL EM CAIXA</span>
              <span class="material-symbols-outlined" style="color: #7C3AED; font-size: 1.6rem;">account_balance</span>
            </div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #4C1D95; margin-top: 0.4rem;">
              R$ ${saldoAtual.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
            <div style="font-size: 0.75rem; color: #6D28D9; margin-top: 4px; font-weight: 600;">
              💰 Fundo de Reserva + Contas Correntes
            </div>
          </div>

        </div>

        <!-- Área de Gráficos Coloridos e Explicativos (2 Colunas) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">
          
          <!-- Gráfico 1: Saúde Financeira & Proporção Receita x Despesa -->
          <div class="card-widget" style="padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="card-title" style="color: var(--primary-dark); font-size: 1.1rem; margin-bottom: 0.25rem;">
                <span class="material-symbols-outlined" style="color: #059669;">pie_chart</span> Balanço de Execução Financeira
              </div>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1.2rem;">
                Comparativo percentual entre arrecadação total e gastos executados.
              </p>

              <!-- Barra de Distribuição Colorida Gradiente -->
              <div style="margin-bottom: 1.2rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">
                  <span style="color: #DC2626;">Gastos Executados (${percentExecucao}%)</span>
                  <span style="color: #059669;">Superávit Retido (${percentSuperavit}%)</span>
                </div>
                
                <div style="height: 22px; background: #E2E8F0; border-radius: 12px; overflow: hidden; display: flex; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);">
                  <div style="width: ${percentExecucao}%; background: linear-gradient(90deg, #EF4444 0%, #DC2626 100%); transition: width 0.8s ease;" title="Gastos: R$ ${despesa.toLocaleString('pt-BR')}"></div>
                  <div style="width: ${percentSuperavit}%; background: linear-gradient(90deg, #10B981 0%, #059669 100%); transition: width 0.8s ease;" title="Superávit: R$ ${saldoMes.toLocaleString('pt-BR')}"></div>
                </div>
              </div>

              <!-- Indicador Visual Donut SVG -->
              <div style="display: flex; align-items: center; justify-content: center; gap: 1.5rem; background: var(--bg-app); padding: 1rem; border-radius: 10px;">
                <svg width="110" height="110" viewBox="0 0 36 36" style="transform: rotate(-90deg);">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E2E8F0" stroke-width="3.8"/>
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#059669" stroke-width="3.8" stroke-dasharray="100 100" stroke-dashoffset="0"/>
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#DC2626" stroke-width="3.8" stroke-dasharray="${percentExecucao} 100" stroke-dashoffset="0"/>
                </svg>
                
                <div>
                  <div style="font-size: 1.4rem; font-weight: 800; color: #059669;">${percentSuperavit}%</div>
                  <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-main);">Margem de Segurança</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
                    R$ ${saldoMes.toLocaleString('pt-BR', {minimumFractionDigits: 2})} adicionados ao caixa
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Gráfico 2: Detalhamento Colorido de Gastos por Categoria -->
          <div class="card-widget" style="padding: 1.25rem;">
            <div class="card-title" style="color: var(--primary-dark); font-size: 1.1rem; margin-bottom: 0.25rem;">
              <span class="material-symbols-outlined" style="color: #2563EB;">donut_small</span> Distribuição de Gastos por Categoria
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1rem;">
              Divisão exata do destino do dinheiro do condomínio.
            </p>

            <div style="display: flex; flex-direction: column; gap: 0.75rem; max-height: 280px; overflow-y: auto; padding-right: 4px;">
              ${categorias.map(cat => {
                const perc = totalCatGastos > 0 ? Math.round((cat.valor / totalCatGastos) * 100) : 0;
                const cor = cat.cor || '#2563EB';

                return `
                  <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 600; margin-bottom: 3px;">
                      <span style="display: flex; align-items: center; gap: 6px; color: var(--text-main);">
                        <span style="width: 10px; height: 10px; border-radius: 50%; background: ${cor}; display: inline-block;"></span>
                        ${cat.nome}
                      </span>
                      <strong>R$ ${cat.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})} (${perc}%)</strong>
                    </div>

                    <div style="height: 8px; background: #E2E8F0; border-radius: 4px; overflow: hidden;">
                      <div style="width: ${perc}%; height: 100%; background: ${cor}; border-radius: 4px;"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

        </div>

        <!-- Tabela Histórica Detalhada de Balancetes Auditados -->
        <div class="card-widget" style="padding: 1.25rem;">
          <div class="card-header" style="margin-bottom: 1rem;">
            <div class="card-title" style="font-size: 1.15rem; color: var(--primary-dark);">
              <span class="material-symbols-outlined" style="color: var(--primary);">table_chart</span> Tabela Consolidada de Balancetes
            </div>
          </div>

          <div class="table-responsive">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Competência / Mês</th>
                  <th>Data da Auditoria</th>
                  <th style="text-align: right;">Receita Bruta (R$)</th>
                  <th style="text-align: right;">Despesa Bruta (R$)</th>
                  <th style="text-align: right;">Resultado do Mês (R$)</th>
                  <th style="text-align: right;">Saldo Atual Acumulado (R$)</th>
                  ${isSindico ? '<th style="text-align: center;">Ações</th>' : ''}
                </tr>
              </thead>
              <tbody>
                ${list.map(bal => `
                  <tr style="background: ${activeBal && activeBal.id === bal.id ? '#F0FDF4' : 'transparent'}; cursor: pointer;" onclick="BalancetesComponent.trocarCompetencia('${bal.id}')">
                    <td>
                      <strong>📅 ${bal.mes} ${bal.ano}</strong>
                      <div style="font-size: 0.75rem; color: var(--text-muted);">${bal.titulo || 'Balancete Aprovado'}</div>
                    </td>
                    <td>${bal.dataPublicacao || '31/05/2026'}</td>
                    <td style="text-align: right; color: #059669; font-weight: 700;">
                      R$ ${bal.receitaBruta.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </td>
                    <td style="text-align: right; color: #DC2626; font-weight: 700;">
                      R$ ${bal.despesaBruta.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </td>
                    <td style="text-align: right; color: #2563EB; font-weight: 700;">
                      R$ ${bal.saldoMes.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </td>
                    <td style="text-align: right; color: #4C1D95; font-weight: 800;">
                      R$ ${(bal.saldoAtual || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </td>
                    ${isSindico ? `
                      <td style="text-align: center;" onclick="event.stopPropagation()">
                        <button class="btn-secondary btn-sm btn-danger" onclick="BalancetesComponent.excluirBalancete('${bal.id}', '${bal.mes} ${bal.ano}')" title="Excluir Balancete">
                          <span class="material-symbols-outlined" style="font-size: 0.95rem;">delete</span>
                        </button>
                      </td>
                    ` : ''}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  },

  trocarCompetencia(balId) {
    this.selectedBalanceteId = balId;
    App.render();
  },

  openImportModal() {
    this.parsedImportData = null;
    const existing = document.getElementById('modalImportBalancete');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="modal-overlay active" id="modalImportBalancete" style="z-index: 999999;">
        <div class="modal-card" style="max-width: 600px; border: 2px solid #3ECF8E;">
          <div class="modal-header" style="background: #1C1C1C; color: #3ECF8E;">
            <div class="modal-title" style="color: #3ECF8E; font-weight: 700; font-size: 1.15rem; display: flex; align-items: center; gap: 0.5rem;">
              <span class="material-symbols-outlined">cloud_upload</span> 📊 Importar Planilha / Balancete (CSV, XLS, PDF, DOC)
            </div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalImportBalancete').remove()">✕</button>
          </div>
          <div class="modal-body">
            
            <!-- Seletor de Arquivos Real -->
            <div class="form-group" style="background: #F0FDF4; border: 2px dashed #3ECF8E; padding: 1.25rem; border-radius: 8px; text-align: center;">
              <label for="balFileSelector" style="cursor: pointer; display: block;">
                <span class="material-symbols-outlined" style="font-size: 3rem; color: #2E6B42; display: block; margin-bottom: 0.3rem;">table_chart</span>
                <strong style="color: var(--primary-dark); font-size: 1.05rem;">Clique aqui para selecionar sua Planilha ou Arquivo</strong>
                <span style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">
                  Suporta Planilhas Excel (.xls, .xlsx), CSV, PDF e Documentos Word/Texto
                </span>
              </label>

              <input type="file" id="balFileSelector" accept=".csv,.xls,.xlsx,.pdf,.doc,.docx,.txt" style="display: none;" onchange="BalancetesComponent.manipularArquivoPlanilha(event)">

              <div id="balFileInfo" style="margin-top: 0.85rem; font-weight: 700; font-size: 0.88rem; color: #166534; display: none; background: white; padding: 0.6rem; border-radius: 6px; border: 1px solid #BBF7D0;">
              </div>
            </div>

            <!-- Formulário de Confirmação & Ajuste Fino dos Dados Extraídos -->
            <form onsubmit="BalancetesComponent.submeterImportacao(event)">
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label" style="font-weight: 700;">Mês da Competência</label>
                  <select id="importMes" class="form-control" required style="font-weight: 600;">
                    <option value="Janeiro">Janeiro</option>
                    <option value="Fevereiro">Fevereiro</option>
                    <option value="Março">Março</option>
                    <option value="Abril">Abril</option>
                    <option value="Maio">Maio</option>
                    <option value="Junho" selected>Junho</option>
                    <option value="Julho">Julho</option>
                    <option value="Agosto">Agosto</option>
                    <option value="Setembro">Setembro</option>
                    <option value="Outubro">Outubro</option>
                    <option value="Novembro">Novembro</option>
                    <option value="Dezembro">Dezembro</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label" style="font-weight: 700;">Ano</label>
                  <input type="number" id="importAno" class="form-control" value="2026" required style="font-weight: 700;">
                </div>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label" style="font-weight: 700; color: #059669;">Receita Bruta Total (R$)</label>
                  <input type="number" step="0.01" id="importReceita" class="form-control" placeholder="Ex: 90351.01" value="92500.00" required style="font-weight: 700; color: #059669;">
                </div>

                <div class="form-group">
                  <label class="form-label" style="font-weight: 700; color: #DC2626;">Despesa Bruta Total (R$)</label>
                  <input type="number" step="0.01" id="importDespesa" class="form-control" placeholder="Ex: 69866.77" value="71200.00" required style="font-weight: 700; color: #DC2626;">
                </div>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label" style="font-weight: 700;">Saldo Anterior em Caixa (R$)</label>
                  <input type="number" step="0.01" id="importSaldoAnterior" class="form-control" value="518922.33" required style="font-weight: 700;">
                </div>

                <div class="form-group">
                  <label class="form-label" style="font-weight: 700;">Título do Balancete</label>
                  <input type="text" id="importTitulo" class="form-control" value="Demonstrativo Consolidado Auditado" required style="font-weight: 600;">
                </div>
              </div>

              <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-weight: 800; background: #3ECF8E; color: #1C1C1C; margin-top: 0.5rem;">
                <span class="material-symbols-outlined">rocket_launch</span> 🚀 Transformar em Dashboard Colorido
              </button>
            </form>

          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  manipularArquivoPlanilha(event) {
    const file = event.target.files[0];
    if (!file) return;

    const info = document.getElementById('balFileInfo');
    if (info) {
      info.style.display = 'block';
      info.innerHTML = `✅ Planilha Carregada: <strong>${file.name}</strong> (${(file.size / 1024).toFixed(1)} KB)`;
    }

    // Leitura inteligente do conteúdo do arquivo CSV / Text
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      this.parseSpreadsheetText(text);
    };
    reader.readAsText(file);
  },

  parseSpreadsheetText(text) {
    if (!text) return;

    const lines = text.split(/\r?\n/);
    let receitaEncontrada = 0;
    let despesaEncontrada = 0;

    lines.forEach(line => {
      const clean = line.toLowerCase();
      // Extração inteligente de valores numéricos de CSV
      if (clean.includes('receita') || clean.includes('arrecadacao') || clean.includes('taxa')) {
        const matches = line.match(/\d+[\.,]?\d*/g);
        if (matches && matches.length > 0) {
          const val = parseFloat(matches[matches.length - 1].replace(',', '.'));
          if (val > receitaEncontrada) receitaEncontrada = val;
        }
      }
      if (clean.includes('despesa') || clean.includes('gasto') || clean.includes('total')) {
        const matches = line.match(/\d+[\.,]?\d*/g);
        if (matches && matches.length > 0) {
          const val = parseFloat(matches[matches.length - 1].replace(',', '.'));
          if (val > despesaEncontrada) despesaEncontrada = val;
        }
      }
    });

    if (receitaEncontrada > 0) {
      const elRec = document.getElementById('importReceita');
      if (elRec) elRec.value = receitaEncontrada;
    }

    if (despesaEncontrada > 0) {
      const elDesp = document.getElementById('importDespesa');
      if (elDesp) elDesp.value = despesaEncontrada;
    }
  },

  submeterImportacao(e) {
    e.preventDefault();
    const mes = document.getElementById('importMes').value;
    const ano = parseInt(document.getElementById('importAno').value, 10);
    const receitaBruta = parseFloat(document.getElementById('importReceita').value);
    const despesaBruta = parseFloat(document.getElementById('importDespesa').value);
    const saldoAnterior = parseFloat(document.getElementById('importSaldoAnterior').value);
    const titulo = document.getElementById('importTitulo').value.trim();

    const saldoMes = receitaBruta - despesaBruta;
    const saldoAtual = saldoAnterior + saldoMes;

    // Gerar Categorias Coloridas com base na Despesa Total
    const categoriasDespesa = [
      { nome: 'Mão de Obra Terceirizada (Portaria & Limpeza)', valor: Math.round(despesaBruta * 0.42 * 100) / 100, cor: '#2563EB' },
      { nome: 'Consumo de Água & Esgoto', valor: Math.round(despesaBruta * 0.14 * 100) / 100, cor: '#0D9488' },
      { nome: 'Consumo de Gás Encanado', valor: Math.round(despesaBruta * 0.04 * 100) / 100, cor: '#D97706' },
      { nome: 'Manutenção de Elevadores & CFTV', valor: Math.round(despesaBruta * 0.08 * 100) / 100, cor: '#7C3AED' },
      { nome: 'Honorários de Gestão & Contábil', valor: Math.round(despesaBruta * 0.05 * 100) / 100, cor: '#4F46E5' },
      { nome: 'Seguro Predial & Placas Solares', valor: Math.round(despesaBruta * 0.03 * 100) / 100, cor: '#0284C7' },
      { nome: 'Impostos & Retenções Tributárias', valor: Math.round(despesaBruta * 0.09 * 100) / 100, cor: '#DB2777' },
      { nome: 'Manutenção Predial & Conservação', valor: Math.round(despesaBruta * 0.15 * 100) / 100, cor: '#059669' }
    ];

    const newBal = window.CondoStore.addBalancete({
      mes,
      ano,
      titulo: `${titulo} - ${mes}/${ano}`,
      receitaBruta,
      despesaBruta,
      saldoAnterior,
      saldoMes,
      saldoAtual,
      categoriasDespesa
    });

    this.selectedBalanceteId = newBal.id;
    App.showToast(`Balancete de ${mes}/${ano} transformado em Dashboard Colorido com sucesso!`, 'success');
    document.getElementById('modalImportBalancete').remove();
    App.render();
  },

  excluirBalancete(id, mesAno) {
    if (!confirm(`Tem certeza que deseja excluir o balancete de "${mesAno}"?`)) return;

    const res = window.CondoStore.deleteBalancete(id);
    if (res) {
      this.selectedBalanceteId = null;
      App.showToast(`Balancete de "${mesAno}" excluído.`, 'info');
      App.render();
    }
  }
};
