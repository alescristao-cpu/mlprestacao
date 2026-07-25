/* ----------------------------------------------------
   Modern Life Residence - Balancetes Component
   ---------------------------------------------------- */

window.BalancetesComponent = {
  render(container, data) {
    const list = data.balancetes || [];

    container.innerHTML = `
      <div class="card-widget">
        <div class="card-header">
          <div>
            <div class="card-title">
              <span class="material-symbols-outlined">analytics</span> Balancetes Consolidados
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
              Documentação de balanços financeiros aprovados pelo conselho fiscal.
            </p>
          </div>

          <!-- Filtros de Busca -->
          <div style="display: flex; gap: 0.5rem;">
            <select id="filterAnoBal" class="form-control" style="width: auto;" onchange="BalancetesComponent.applyFilter()">
              <option value="todos">Todos os Anos</option>
              <option value="2026" selected>2026</option>
              <option value="2025">2025</option>
            </select>
          </div>
        </div>

        <div class="table-responsive">
          <table class="custom-table" id="tableBalancetes">
            <thead>
              <tr>
                <th>Mês / Ano</th>
                <th>Publicado em</th>
                <th style="text-align: right;">Receita (R$)</th>
                <th style="text-align: right;">Despesa (R$)</th>
                <th style="text-align: right;">Saldo (R$)</th>
                <th style="text-align: center;">Ações</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(bal => `
                <tr data-ano="${bal.ano}">
                  <td>
                    <strong>${bal.mes} ${bal.ano}</strong>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${bal.titulo}</div>
                  </td>
                  <td>${bal.dataPublicacao}</td>
                  <td style="text-align: right; color: #2E6B42; font-weight: 700;">
                    R$ ${bal.receitaBruta.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </td>
                  <td style="text-align: right; color: #C62828; font-weight: 700;">
                    R$ ${bal.despesaBruta.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </td>
                  <td style="text-align: right; color: #1976D2; font-weight: 700;">
                    R$ ${bal.saldoMes.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </td>
                  <td style="text-align: center;">
                    <button class="btn-outline-primary btn-sm" onclick="BalancetesComponent.viewBalancete('${bal.id}')" title="Visualizar Balancete">
                      <span class="material-symbols-outlined">visibility</span> Visualizar
                    </button>
                    <button class="btn-primary btn-sm" onclick="PDFExporter.exportPrestacaoContasPDF({mesAno: '${bal.mes} ${bal.ano}', receitas: ${bal.receitaBruta}, despesas: ${bal.despesaBruta}, saldo: ${bal.saldoMes}})" title="Baixar PDF">
                      <span class="material-symbols-outlined">download</span> Baixar PDF
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  applyFilter() {
    const selectedAno = document.getElementById('filterAnoBal').value;
    const rows = document.querySelectorAll('#tableBalancetes tbody tr');

    rows.forEach(row => {
      const ano = row.getAttribute('data-ano');
      if (selectedAno === 'todos' || ano === selectedAno) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  },

  viewBalancete(id) {
    const bal = window.CondoStore.data.balancetes.find(b => b.id === id);
    if (!bal) return;

    alert(`Balancete oficial de ${bal.mes}/${bal.ano}\n\n• Receita Bruta: R$ ${bal.receitaBruta.toLocaleString('pt-BR')}\n• Despesa Total: R$ ${bal.despesaBruta.toLocaleString('pt-BR')}\n• Saldo Líquido: R$ ${bal.saldoMes.toLocaleString('pt-BR')}\n\nStatus: Aprovado sem ressalvas pelo Conselho Fiscal.`);
  }
};
