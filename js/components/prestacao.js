/* ----------------------------------------------------
   Modern Life Residence - Prestação de Contas Component
   ---------------------------------------------------- */

window.PrestacaoComponent = {
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
            A consulta ao detalhamento das despesas e prestação de contas é de uso exclusivo dos moradores e conselheiros do Modern Life Residence.
          </p>
          <button class="btn-primary" onclick="AuthComponent.renderAuthModal()" style="padding: 0.8rem 1.5rem; font-size: 0.95rem;">
            <span class="material-symbols-outlined">login</span> Entrar / Cadastrar com Google
          </button>
        </div>
      `;
      return;
    }

    const list = data.prestacaoContas || [];

    container.innerHTML = `
      <div class="card-widget" style="margin-bottom: 1.5rem;">
        <div class="card-header">
          <div>
            <div class="card-title">
              <span class="material-symbols-outlined">account_balance</span> Demonstrativo Mensal de Prestação de Contas
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
              Valores reais consolidados extraídos dos relatórios de auditoria e prestação de contas.
            </p>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          ${list.map(item => `
            <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem; transition: var(--transition);">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
                <div>
                  <span class="badge badge-success" style="margin-bottom: 4px;">
                    <span class="material-symbols-outlined" style="font-size: 0.85rem;">verified</span> ${item.status || 'Publicado e Auditado'}
                  </span>
                  <h3 style="font-family: var(--font-heading); font-size: 1.3rem; color: var(--primary-dark); font-weight: 700;">
                    ${item.mesAno}
                  </h3>
                </div>

                <button class="btn-outline-primary btn-sm" onclick="PrestacaoComponent.openDetailsModal('${item.id}')">
                  <span class="material-symbols-outlined">visibility</span> Ver Detalhamento do Mês
                </button>
              </div>

              <!-- Metrics bar for this month -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; background: var(--bg-app); padding: 1rem; border-radius: var(--radius-sm);">
                <div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Receita Bruta Total</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: #2E6B42;">
                    R$ ${item.receitas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </div>
                </div>
                <div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Despesas Operacionais</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: #C62828;">
                    R$ ${item.despesas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </div>
                </div>
                <div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Saldo do Mês</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: #1976D2;">
                    R$ ${item.saldo.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </div>
                </div>
                <div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Saldo Atual Acumulado</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary-dark);">
                    R$ ${(item.saldoAtual || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
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
                <span style="font-size: 0.8rem; color: var(--text-muted);">Saldo Atual em Caixa</span>
                <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary-dark);">
                  R$ ${(item.saldoAtual || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                </div>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 0.8rem; color: var(--text-muted);">Saldo do Mês</span>
                <div style="font-size: 1.3rem; font-weight: 700; color: #1976D2;">
                  R$ ${item.saldo.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                </div>
              </div>
            </div>

            <h4 style="font-family: var(--font-heading); color: var(--primary-dark); margin-bottom: 0.75rem;">
              Detalhamento de Despesas por Grupo (Sem dados de Unidades)
            </h4>
            <div class="table-responsive">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>Grupo de Despesa</th>
                    <th style="text-align: right;">Valor Realizado (R$)</th>
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
