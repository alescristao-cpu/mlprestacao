/* ----------------------------------------------------
   Modern Life Residence - Balancetes Component
   ---------------------------------------------------- */

window.BalancetesComponent = {
  render(container, data) {
    const user = window.CondoStore.currentUser;

    // Access Gate for non-logged-in users
    if (!user || user.status !== 'Aprovado') {
      container.innerHTML = `
        <div class="card-widget" style="text-align: center; padding: 3.5rem 1.5rem; max-width: 600px; margin: 2rem auto;">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 1.25rem auto;">
            <span class="material-symbols-outlined" style="font-size: 2.8rem;">lock</span>
          </div>
          <h2 style="font-family: var(--font-heading); color: var(--primary-dark); font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem;">
            Acesso Restrito a Moradores Cadastrados
          </h2>
          <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 1.5rem;">
            A visualização dos balancetes consolidados e auditorias financeiras é de uso exclusivo dos moradores e conselheiros do Modern Life Residence.
          </p>
          <button class="btn-primary" onclick="AuthComponent.renderAuthModal()" style="padding: 0.8rem 1.5rem; font-size: 0.95rem;">
            <span class="material-symbols-outlined">login</span> Entrar / Cadastrar com Google
          </button>
        </div>
      `;
      return;
    }

    const list = data.balancetes || [];

    container.innerHTML = `
      <div class="card-widget">
        <div class="card-header">
          <div>
            <div class="card-title">
              <span class="material-symbols-outlined">analytics</span> Balancetes Consolidados (Dados Fiéis da Gestão)
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
              Consulta aos valores consolidados da arrecadação e despesas aprovadas pelo Conselho Fiscal.
            </p>
          </div>

          <div style="display: flex; gap: 0.5rem;">
            <select id="filterAnoBal" class="form-control" style="width: auto;" onchange="BalancetesComponent.applyFilter()">
              <option value="todos">Todos os Anos</option>
              <option value="2026" selected>2026</option>
            </select>
          </div>
        </div>

        <div class="table-responsive">
          <table class="custom-table" id="tableBalancetes">
            <thead>
              <tr>
                <th>Competência</th>
                <th>Publicado em</th>
                <th style="text-align: right;">Receita Bruta (R$)</th>
                <th style="text-align: right;">Despesa Bruta (R$)</th>
                <th style="text-align: right;">Saldo Anterior (R$)</th>
                <th style="text-align: right;">Saldo do Mês (R$)</th>
                <th style="text-align: right;">Saldo Atual Acumulado (R$)</th>
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
                  <td style="text-align: right; color: var(--text-muted); font-weight: 600;">
                    R$ ${(bal.saldoAnterior || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </td>
                  <td style="text-align: right; color: #1976D2; font-weight: 700;">
                    R$ ${bal.saldoMes.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </td>
                  <td style="text-align: right; color: var(--primary-dark); font-weight: 800;">
                    R$ ${(bal.saldoAtual || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
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
  }
};
