/* ----------------------------------------------------
   Modern Life Residence - Financial Charts Module
   ---------------------------------------------------- */

window.CondoCharts = {
  instances: {},

  renderTransparenciaCharts(data) {
    if (!window.Chart) {
      console.warn('Chart.js library not loaded yet.');
      return;
    }

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#F0F4F1' : '#222222';
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

    // 1. Doughnut Chart: Expenses by Category
    const ctxCategory = document.getElementById('chartExpensesCategory');
    if (ctxCategory) {
      if (this.instances.category) this.instances.category.destroy();

      const latestPC = data.prestacaoContas[0] || {};
      const categories = latestPC.categoriasDespesa || [];

      this.instances.category = new Chart(ctxCategory, {
        type: 'doughnut',
        data: {
          labels: categories.map(c => c.nome),
          datasets: [{
            data: categories.map(c => c.valor),
            backgroundColor: [
              '#2E6B42',
              '#1F4D30',
              '#4CAF50',
              '#81C784',
              '#D4AF37',
              '#FF9800'
            ],
            borderWidth: 2,
            borderColor: isDark ? '#1F2722' : '#FFFFFF'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: { color: textColor, font: { family: 'Inter', size: 12 } }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const val = context.raw || 0;
                  return ` R$ ${val.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
                }
              }
            }
          }
        }
      });
    }

    // 2. Bar Chart: Revenue vs Expenses Timeline
    const ctxBar = document.getElementById('chartRevenueVsExpenses');
    if (ctxBar) {
      if (this.instances.revenueVsExpenses) this.instances.revenueVsExpenses.destroy();

      const reversedPC = [...data.prestacaoContas].reverse();

      this.instances.revenueVsExpenses = new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: reversedPC.map(p => p.mesAno),
          datasets: [
            {
              label: 'Receitas (R$)',
              data: reversedPC.map(p => p.receitas),
              backgroundColor: '#2E6B42',
              borderRadius: 6
            },
            {
              label: 'Despesas (R$)',
              data: reversedPC.map(p => p.despesas),
              backgroundColor: '#E53935',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { ticks: { color: textColor }, grid: { color: gridColor } },
            y: { ticks: { color: textColor }, grid: { color: gridColor } }
          },
          plugins: {
            legend: { labels: { color: textColor } }
          }
        }
      });
    }

    // 3. Line Chart: Financial Evolution (Net Balance)
    const ctxLine = document.getElementById('chartFinancialEvolution');
    if (ctxLine) {
      if (this.instances.financialEvolution) this.instances.financialEvolution.destroy();

      const reversedPC = [...data.prestacaoContas].reverse();

      this.instances.financialEvolution = new Chart(ctxLine, {
        type: 'line',
        data: {
          labels: reversedPC.map(p => p.mesAno),
          datasets: [{
            label: 'Saldo Mensal Acumulado (R$)',
            data: reversedPC.map(p => p.saldo),
            borderColor: '#2E6B42',
            backgroundColor: 'rgba(46, 107, 66, 0.15)',
            fill: true,
            tension: 0.3,
            pointRadius: 6,
            pointBackgroundColor: '#1F4D30'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { ticks: { color: textColor }, grid: { color: gridColor } },
            y: { ticks: { color: textColor }, grid: { color: gridColor } }
          },
          plugins: {
            legend: { labels: { color: textColor } }
          }
        }
      });
    }
  }
};
