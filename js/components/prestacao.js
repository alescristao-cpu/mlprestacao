/* ====================================================
   Modern Life Residence - Prestação de Contas (Conteúdo Excluído e Redirecionado para o Dashboard Financeiro)
   ==================================================== */

window.PrestacaoComponent = {
  activeTab: 'dashboardFinanceiro',

  render(container, data) {
    if (window.App && window.App.navigateTo) {
      window.App.navigateTo('dashboardFinanceiro');
    } else {
      window.location.hash = 'dashboardFinanceiro';
    }
  }
};
