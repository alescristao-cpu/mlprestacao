/* ----------------------------------------------------
   Modern Life Residence - Dashboard View Component
   ---------------------------------------------------- */

window.DashboardComponent = {
  render(container, data) {
    const latestPC = data.prestacaoContas[0] || {};
    const latestBal = data.balancetes[0] || {};
    const nextEvent = data.agenda.find(a => a.tipo === 'Assembleia') || data.agenda[0] || {};
    const recentDocs = data.documentos.slice(0, 3);
    const recentRecados = data.recados.slice(0, 2);

    container.innerHTML = `
      <!-- Metric Cards Grid -->
      <div class="grid-cards">
        <div class="card-widget metric-card">
          <div class="metric-icon green">
            <span class="material-symbols-outlined">payments</span>
          </div>
          <div class="metric-data">
            <div class="metric-label">Última Prestação (${latestPC.mesAno || 'Jul/2026'})</div>
            <div class="metric-value">R$ ${(latestPC.receitas || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
            <div class="metric-sub" onclick="App.navigateTo('prestacao')" style="cursor: pointer;">
              <span class="material-symbols-outlined" style="font-size: 1rem;">trending_up</span> Receita Bruta Arrecadada
            </div>
          </div>
        </div>

        <div class="card-widget metric-card">
          <div class="metric-icon blue">
            <span class="material-symbols-outlined">account_balance_wallet</span>
          </div>
          <div class="metric-data">
            <div class="metric-label">Saldo em Caixa</div>
            <div class="metric-value">R$ ${(latestPC.saldo || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
            <div class="metric-sub" onclick="App.navigateTo('transparencia')" style="cursor: pointer;">
              <span class="material-symbols-outlined" style="font-size: 1rem;">verified</span> Balanço Superavitário
            </div>
          </div>
        </div>

        <div class="card-widget metric-card">
          <div class="metric-icon gold">
            <span class="material-symbols-outlined">description</span>
          </div>
          <div class="metric-data">
            <div class="metric-label">Último Balancete</div>
            <div class="metric-value" style="font-size: 1.25rem;">${latestBal.mes || 'Julho'} / ${latestBal.ano || '2026'}</div>
            <div class="metric-sub" style="cursor: pointer;" onclick="PDFExporter.exportPrestacaoContasPDF(CondoStore.data.prestacaoContas[0])">
              <span class="material-symbols-outlined" style="font-size: 1rem;">download</span> Baixar Balancete PDF
            </div>
          </div>
        </div>

        <div class="card-widget metric-card">
          <div class="metric-icon green">
            <span class="material-symbols-outlined">groups</span>
          </div>
          <div class="metric-data">
            <div class="metric-label">Próxima Assembleia</div>
            <div class="metric-value" style="font-size: 1.15rem;">${nextEvent.data ? new Date(nextEvent.data + 'T00:00:00').toLocaleDateString('pt-BR') : '10/08/2026'}</div>
            <div class="metric-sub" onclick="App.navigateTo('agenda')" style="cursor: pointer;">
              <span class="material-symbols-outlined" style="font-size: 1rem;">schedule</span> ${nextEvent.hora || '19:30'} h
            </div>
          </div>
        </div>
      </div>

      <!-- Main Section: 2 Column Layout -->
      <div class="grid-2col">
        <!-- Left Column: Announcements & Mural de Recados -->
        <div>
          <!-- Avisos Importantes Banner Card -->
          <div class="card-widget" style="background: linear-gradient(135deg, #1F4D30 0%, #2E6B42 100%); color: white; margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap;">
              <div style="flex: 1;">
                <span class="badge" style="background: rgba(255,255,255,0.2); color: white; margin-bottom: 0.5rem;">
                  <span class="material-symbols-outlined" style="font-size: 0.9rem;">campaign</span> COMUNICADO OFICIAL DO SÍNDICO
                </span>
                <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; margin-bottom: 0.35rem;">
                  Assembleia Geral Ordinária de Aprovação de Contas
                </h3>
                <p style="font-size: 0.9rem; opacity: 0.9;">
                  A convocação oficial feita pelo Síndico <strong>Alessandro Cristiano da Silva</strong> já está disponível para consulta na Biblioteca de Documentos.
                </p>
              </div>
              <button class="btn-primary" onclick="App.navigateTo('documentos')" style="background: white; color: var(--primary-dark); font-weight: 700; flex-shrink: 0;">
                Ver Convocação
              </button>
            </div>
          </div>

          <!-- Feed do Mural de Recados -->
          <div class="card-widget" style="margin-bottom: 1.5rem;">
            <div class="card-header">
              <div class="card-title">
                <span class="material-symbols-outlined">campaign</span> Mural de Recados
              </div>
              <button class="btn-outline-primary btn-sm" onclick="App.navigateTo('recados')">Ver Todos</button>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1.25rem;">
              ${recentRecados.map(item => `
                <div style="display: flex; gap: 1.25rem; align-items: center; padding-bottom: 1rem; border-bottom: 1px solid var(--border-light);">
                  <img src="${item.imagem}" style="width: 110px; height: 80px; object-fit: cover; border-radius: var(--radius-sm);" alt="${item.titulo}">
                  <div style="flex: 1;">
                    <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 2px;">
                      ${item.data} &bull; Por ${item.autor}
                    </div>
                    <h4 style="font-family: var(--font-heading); font-size: 1rem; color: var(--primary-dark); font-weight: 700; cursor: pointer;" onclick="App.navigateTo('recados')">
                      ${item.titulo}
                    </h4>
                    <p style="font-size: 0.85rem; color: var(--text-muted); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-top: 2px;">
                      ${item.resumo}
                    </p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right Column: Recent Documents & Quick Links -->
        <div>
          <!-- Documentos Recentes -->
          <div class="card-widget" style="margin-bottom: 1.5rem;">
            <div class="card-header">
              <div class="card-title">
                <span class="material-symbols-outlined">folder_open</span> Documentos Recentes
              </div>
              <button class="btn-outline-primary btn-sm" onclick="App.navigateTo('documentos')">Biblioteca</button>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              ${recentDocs.map(doc => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; background: var(--bg-app); border-radius: var(--radius-sm);">
                  <div style="display: flex; align-items: center; gap: 0.6rem;">
                    <span class="material-symbols-outlined" style="color: var(--primary);">picture_as_pdf</span>
                    <div>
                      <div style="font-weight: 600; font-size: 0.85rem; color: var(--text-main); display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">
                        ${doc.nome}
                      </div>
                      <div style="font-size: 0.72rem; color: var(--text-muted);">${doc.categoria} &bull; ${doc.tamanho}</div>
                    </div>
                  </div>
                  <button class="icon-btn" title="Baixar PDF" onclick="alert('Download iniciado para: ${doc.nome}')" style="width: 32px; height: 32px;">
                    <span class="material-symbols-outlined" style="font-size: 1.1rem;">download</span>
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Utilidades Rápidas -->
          <div class="card-widget">
            <div class="card-header">
              <div class="card-title">
                <span class="material-symbols-outlined">widgets</span> Atalhos de Utilidades
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <button class="btn-secondary" onclick="App.navigateTo('utilidades')" style="justify-content: flex-start; padding: 0.75rem; font-size: 0.82rem;">
                <span class="material-symbols-outlined" style="color: var(--primary);">receipt_long</span> 2ª Via Boleto
              </button>
              <button class="btn-secondary" onclick="App.navigateTo('utilidades')" style="justify-content: flex-start; padding: 0.75rem; font-size: 0.82rem;">
                <span class="material-symbols-outlined" style="color: var(--primary);">event_seat</span> Reserva Salão
              </button>
              <button class="btn-secondary" onclick="App.navigateTo('ocorrencias')" style="justify-content: flex-start; padding: 0.75rem; font-size: 0.82rem;">
                <span class="material-symbols-outlined" style="color: var(--primary);">report_problem</span> Ocorrência
              </button>
              <button class="btn-secondary" onclick="App.navigateTo('canal')" style="justify-content: flex-start; padding: 0.75rem; font-size: 0.82rem;">
                <span class="material-symbols-outlined" style="color: var(--primary);">mail</span> Falar C/ Síndico
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
