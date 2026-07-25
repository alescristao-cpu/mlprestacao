/* ----------------------------------------------------
   Modern Life Residence - Prestação de Contas Component
   ---------------------------------------------------- */

window.PrestacaoComponent = {
  render(container, data) {
    const list = data.prestacaoContas || [];

    container.innerHTML = `
      <div class="card-widget" style="margin-bottom: 1.5rem;">
        <div class="card-header">
          <div>
            <div class="card-title">
              <span class="material-symbols-outlined">account_balance</span> Demonstrativo Mensal de Prestação de Contas
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
              Acompanhamento mensal detalhado de receitas, despesas operacionais e saldos do condomínio.
            </p>
          </div>
          <button class="btn-primary" onclick="PDFExporter.exportToExcel('Prestacao_Contas_ModernLife_2026', ['Mes/Ano', 'Receita Bruta (R$)', 'Despesas (R$)', 'Saldo (R$)'], CondoStore.data.prestacaoContas.map(p => [p.mesAno, p.receitas, p.despesas, p.saldo]))">
            <span class="material-symbols-outlined">grid_on</span> Exportar Excel
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          ${list.map((item, index) => `
            <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem; transition: var(--transition);">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
                <div>
                  <span class="badge badge-success" style="margin-bottom: 4px;">
                    <span class="material-symbols-outlined" style="font-size: 0.85rem;">verified</span> ${item.status || 'Publicado'}
                  </span>
                  <h3 style="font-family: var(--font-heading); font-size: 1.3rem; color: var(--primary-dark); font-weight: 700;">
                    ${item.mesAno}
                  </h3>
                </div>

                <div style="display: flex; gap: 0.75rem;">
                  <button class="btn-outline-primary btn-sm" onclick="PrestacaoComponent.openDetailsModal('${item.id}')">
                    <span class="material-symbols-outlined">visibility</span> Ver Detalhes
                  </button>
                  <button class="btn-primary btn-sm" onclick="PDFExporter.exportPrestacaoContasPDF(CondoStore.data.prestacaoContas[${index}])">
                    <span class="material-symbols-outlined">picture_as_pdf</span> Baixar PDF
                  </button>
                </div>
              </div>

              <!-- Metrics bar for this month -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; background: var(--bg-app); padding: 1rem; border-radius: var(--radius-sm);">
                <div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Receita Total</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: #2E6B42;">
                    R$ ${item.receitas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </div>
                </div>
                <div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Despesas Totais</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: #C62828;">
                    R$ ${item.despesas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </div>
                </div>
                <div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Saldo Líquido</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: #1976D2;">
                    R$ ${item.saldo.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  openDetailsModal(id) {
    const item = window.CondoStore.data.prestacaoContas.find(p => p.id === id);
    if (!item) return;

    const modalHtml = `
      <div class="modal-overlay active" id="modalPrestacaoDetail">
        <div class="modal-card" style="max-width: 650px;">
          <div class="modal-header">
            <div class="modal-title">Prestação de Contas - ${item.mesAno}</div>
            <button class="modal-close" onclick="document.getElementById('modalPrestacaoDetail').remove()">✕</button>
          </div>
          <div class="modal-body">
            <div style="display: flex; justify-content: space-between; padding: 1rem; background: var(--primary-light); border-radius: var(--radius-sm); margin-bottom: 1.5rem;">
              <div>
                <span style="font-size: 0.8rem; color: var(--text-muted);">Saldo Final do Mês</span>
                <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary-dark);">
                  R$ ${item.saldo.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                </div>
              </div>
              <button class="btn-primary" onclick="PDFExporter.exportPrestacaoContasPDF(CondoStore.data.prestacaoContas.find(p => p.id === '${item.id}'))">
                <span class="material-symbols-outlined">print</span> Gerar PDF Relatório
              </button>
            </div>

            <h4 style="font-family: var(--font-heading); color: var(--primary-dark); margin-bottom: 0.75rem;">
              Despesas Realizadas por Categoria
            </h4>
            <div class="table-responsive">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>Categoria</th>
                    <th style="text-align: right;">Valor (R$)</th>
                    <th style="text-align: right;">% do Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${(item.categoriasDespesa || []).map(cat => {
                    const pct = item.despesas > 0 ? ((cat.valor / item.despesas) * 100).toFixed(1) : 0;
                    return `
                      <tr>
                        <td><strong>${cat.nome}</strong></td>
                        <td style="text-align: right; font-weight: 700;">R$ ${cat.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                        <td style="text-align: right; color: var(--text-muted);">${pct}%</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }
};
