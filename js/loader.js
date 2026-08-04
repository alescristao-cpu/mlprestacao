/* ====================================================
   Modern Life Residence - Automated Script Loader & Cache-Buster
   Carregamento Modular Sequencial de Componentes com Controle Automatizado de Cache
   ==================================================== */
(function() {
  const BUILD_VERSION = '20260804_v1039_' + Date.now();

  const scripts = [
    'js/supabase-config.js',
    'js/store.js',
    'js/components/modal-service.js',
    'js/services/email-service.js',
    'js/components/auth.js',
    'js/components/dashboard.js',
    'js/components/prestacao.js',
    'js/components/balancetes.js',
    'js/components/contratos.js',
    'js/components/transparencia.js',
    'js/components/dashboard-financeiro.js',
    'js/components/documentos.js',
    'js/components/recados.js',
    'js/components/ocorrencias.js',
    'js/components/canal.js',
    'js/components/utilidades.js',
    'js/components/portaria.js',
    'js/components/agenda.js',
    'js/components/galeria.js',
    'js/components/admin.js',
    'js/app.js'
  ];

  function loadNextScript(index) {
    if (index >= scripts.length) return;

    const scriptPath = scripts[index] + '?v=' + BUILD_VERSION;
    const script = document.createElement('script');
    script.src = scriptPath;
    script.async = false;
    script.onload = function() {
      loadNextScript(index + 1);
    };
    script.onerror = function() {
      console.error('Erro ao carregar o script:', scriptPath);
      loadNextScript(index + 1);
    };
    document.head.appendChild(script);
  }

  loadNextScript(0);
})();
