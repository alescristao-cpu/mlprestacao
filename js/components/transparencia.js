/* ----------------------------------------------------
   Modern Life Residence - Transparência Financeira Component
   ---------------------------------------------------- */

window.TransparenciaComponent = {
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
            Os gráficos de demonstrativo financeiro e evolução do caixa são de uso exclusivo dos moradores e conselheiros do Modern Life Residence.
          </p>
          <button class="btn-primary" onclick="AuthComponent.renderAuthModal()" style="padding: 0.8rem 1.5rem; font-size: 0.95rem;">
            <span class="material-symbols-outlined">login</span> Entrar / Cadastrar com Google
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Top Banner Header -->
        <div class="card-widget" style="background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%); color: white;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 54px; height: 54px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 2rem;">
              <span class="material-symbols-outlined" style="font-size: 2.2rem;">monitoring</span>
            </div>
            <div>
              <h2 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700;">
                Portal de Transparência Financeira Integrada
              </h2>
              <p style="font-size: 0.9rem; opacity: 0.9;">
                Visualização interativa da arrecadação, despesas categorizadas e evolução do caixa em tempo real.
              </p>
            </div>
          </div>
        </div>

        <!-- Charts Row 1: Category Doughnut & Revenue vs Expenses Bar -->
        <div class="grid-2col">
          <div class="card-widget">
            <div class="card-header">
              <div class="card-title">
                <span class="material-symbols-outlined">pie_chart</span> Gastos por Categoria (Maio 2026)
              </div>
            </div>
            <div style="height: 280px; position: relative;">
              <canvas id="chartExpensesCategory"></canvas>
            </div>
          </div>

          <div class="card-widget">
            <div class="card-header">
              <div class="card-title">
                <span class="material-symbols-outlined">bar_chart</span> Receitas vs Despesas (Histórico 2026)
              </div>
            </div>
            <div style="height: 280px; position: relative;">
              <canvas id="chartRevenueVsExpenses"></canvas>
            </div>
          </div>
        </div>

        <!-- Charts Row 2: Financial Evolution Line Chart -->
        <div class="card-widget">
          <div class="card-header">
            <div class="card-title">
              <span class="material-symbols-outlined">show_chart</span> Evolução Financeira &amp; Saldo de Reserva
            </div>
          </div>
          <div style="height: 260px; position: relative;">
            <canvas id="chartFinancialEvolution"></canvas>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      window.CondoCharts.renderTransparenciaCharts(data);
    }, 100);
  }
};
