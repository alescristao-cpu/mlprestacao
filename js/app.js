/* ----------------------------------------------------
   Modern Life Residence - Main Application Orchestrator
   Exibição Exclusiva do Nome do Morador Logado no Cabeçalho Superior
   ---------------------------------------------------- */

window.App = {
  currentRoute: 'dashboard',

  init() {
    try {
      this.initTheme();
      this.checkEmailApprovalParams();
      this.bindEvents();
      this.registerServiceWorker();
      
      const user = window.CondoStore.currentUser;
      if (user && user.role === 'Portaria') {
        this.currentRoute = 'portaria';
      } else {
        const hash = window.location.hash.replace('#', '');
        if (hash && this.isValidRoute(hash)) {
          this.currentRoute = hash;
        }
      }

      this.render();

      window.CondoStore.subscribe(() => {
        const currentUser = window.CondoStore.currentUser;
        if (currentUser && currentUser.role === 'Portaria' && !['portaria', 'utilidades', 'agenda'].includes(this.currentRoute)) {
          this.currentRoute = 'portaria';
        }
        this.render();
      });
    } catch (err) {
      console.error('App init error:', err);
    }
  },

  isValidRoute(route) {
    const validRoutes = [
      'dashboard', 'prestacao', 'balancetes', 'contratos',
      'transparencia', 'documentos', 'recados', 'ocorrencias',
      'canal', 'utilidades', 'agenda', 'galeria', 'admin', 'portaria'
    ];
    return validRoutes.includes(route);
  },

  checkEmailApprovalParams() {
    try {
      const params = new URLSearchParams(window.location.search);
      const emailToApprove = params.get('approve_email');
      if (emailToApprove) {
        const moradores = window.CondoStore.data.moradores;
        const target = moradores.find(m => m.email.toLowerCase() === emailToApprove.toLowerCase());
        if (target) {
          window.CondoStore.updateMoradorStatus(target.id, 'Aprovado');
          setTimeout(() => {
            alert(`✅ AUTORIZAÇÃO CONCLUÍDA!\n\nO morador ${target.nome} (${target.email} - Apto ${target.apartamento}) foi APROVADO pelo Síndico com sucesso! O acesso aos arquivos e balancetes foi liberado.`);
          }, 300);
        }
      }
    } catch (e) {}
  },

  initTheme() {
    const savedTheme = localStorage.getItem('MODERN_LIFE_THEME') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('MODERN_LIFE_THEME', next);
    this.showToast(`Modo ${next === 'dark' ? 'Escuro' : 'Claro'} ativado.`, 'info');
  },

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openGlobalSearchModal();
      }
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-route]');
      if (btn) {
        const route = btn.getAttribute('data-route');
        if (route) {
          e.preventDefault();
          this.navigateTo(route);
        }
      }
    });

    document.addEventListener('click', (e) => {
      const sidebar = document.getElementById('sidebar');
      const toggle = e.target.closest('.mobile-toggle');
      if (sidebar && sidebar.classList.contains('mobile-open') && !sidebar.contains(e.target) && !toggle) {
        sidebar.classList.remove('mobile-open');
      }
    });
  },

  navigateTo(route) {
    const user = window.CondoStore.currentUser;
    const isPortaria = user && user.role === 'Portaria';

    if (isPortaria && !['portaria', 'utilidades', 'agenda'].includes(route)) {
      route = 'portaria';
    } else if (!this.isValidRoute(route)) {
      route = 'dashboard';
    }

    this.currentRoute = route;
    window.location.hash = route;

    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.render();
  },

  toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('mobile-open');
  },

  render() {
    const data = window.CondoStore.data;

    this.updateNavigationUI();

    const pageContainer = document.getElementById('pageContent');
    if (!pageContainer) return;

    switch (this.currentRoute) {
      case 'dashboard':
        if (window.DashboardComponent) window.DashboardComponent.render(pageContainer, data);
        break;
      case 'prestacao':
        if (window.PrestacaoComponent) window.PrestacaoComponent.render(pageContainer, data);
        break;
      case 'balancetes':
        if (window.BalancetesComponent) window.BalancetesComponent.render(pageContainer, data);
        break;
      case 'contratos':
        if (window.ContratosComponent) window.ContratosComponent.render(pageContainer, data);
        break;
      case 'transparencia':
        if (window.TransparenciaComponent) window.TransparenciaComponent.render(pageContainer, data);
        break;
      case 'documentos':
        if (window.DocumentosComponent) window.DocumentosComponent.render(pageContainer, data);
        break;
      case 'recados':
        if (window.RecadosComponent) window.RecadosComponent.render(pageContainer, data);
        break;
      case 'canal':
        if (window.CanalComponent) window.CanalComponent.render(pageContainer, data);
        break;
      case 'ocorrencias':
        if (window.OcorrenciasComponent) window.OcorrenciasComponent.render(pageContainer, data);
        break;
      case 'utilidades':
        if (window.UtilidadesComponent) window.UtilidadesComponent.render(pageContainer, data);
        break;
      case 'agenda':
        if (window.AgendaComponent) window.AgendaComponent.render(pageContainer, data);
        break;
      case 'galeria':
        if (window.GaleriaComponent) window.GaleriaComponent.render(pageContainer, data);
        break;
      case 'admin':
        if (window.AdminComponent) window.AdminComponent.render(pageContainer, data);
        break;
      case 'portaria':
        if (window.PortariaComponent) window.PortariaComponent.render(pageContainer, data);
        break;
      default:
        if (window.DashboardComponent) window.DashboardComponent.render(pageContainer, data);
    }
  },

  updateNavigationUI() {
    const user = window.CondoStore.currentUser;
    const isPortaria = user && user.role === 'Portaria';

    // Oculta menus financeiros e administrativos para o Perfil da Portaria
    const portariaAllowedRoutes = ['portaria', 'utilidades', 'agenda'];

    document.querySelectorAll('.nav-item').forEach(item => {
      const route = item.getAttribute('data-route');

      if (isPortaria) {
        if (portariaAllowedRoutes.includes(route)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      } else {
        item.style.display = 'flex';
      }

      if (route === this.currentRoute) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    const titleMap = {
      dashboard: 'Página Inicial',
      prestacao: 'Prestação de Contas',
      balancetes: 'Balancetes Consolidados',
      contratos: 'Contratos Vigentes',
      transparencia: 'Portal de Transparência',
      documentos: 'Documentos & Manuais',
      recados: 'Mural de Recados',
      ocorrencias: 'Reclamações & Elogios',
      canal: 'Canal Direto com o Síndico',
      utilidades: 'Utilidades & Reservas',
      agenda: 'Agenda & Calendário',
      galeria: 'Galeria do Condomínio',
      admin: 'Painel Administrativo do Síndico',
      portaria: 'Painel da Portaria & Guarita'
    };

    const headerTitleEl = document.getElementById('pageHeaderTitle');
    if (headerTitleEl) {
      headerTitleEl.innerText = titleMap[this.currentRoute] || 'Modern Life Residence';
    }

    const topHeaderUserText = document.getElementById('topHeaderUserText');
    const topHeaderUserBtn = document.getElementById('topHeaderUserBtn');

    if (user) {
      if (topHeaderUserText) {
        topHeaderUserText.innerText = user.nome;
      }
      if (topHeaderUserBtn) {
        topHeaderUserBtn.title = `Conectado como: ${user.nome} (Apto ${user.apartamento})`;
        topHeaderUserBtn.style.background = 'var(--primary-dark)';
      }
    } else {
      if (topHeaderUserText) {
        topHeaderUserText.innerText = 'Entrar';
      }
      if (topHeaderUserBtn) {
        topHeaderUserBtn.title = 'Entrar / Cadastrar-se';
        topHeaderUserBtn.style.background = 'var(--primary)';
      }
    }
  },

  openGlobalSearchModal() {
    const existing = document.getElementById('modalSearch');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="modal-overlay active" id="modalSearch">
        <div class="modal-card" style="max-width: 550px; margin-top: 100px;">
          <div class="modal-header">
            <div style="display: flex; align-items: center; gap: 0.5rem; width: 100%;">
              <span class="material-symbols-outlined" style="color: var(--primary);">search</span>
              <input type="text" id="globalSearchInput" class="form-control" placeholder="Buscar documentos, contratos, recados..." autofocus onkeyup="App.executeGlobalSearch()">
            </div>
            <button class="modal-close" onclick="document.getElementById('modalSearch').remove()">✕</button>
          </div>
          <div class="modal-body" id="globalSearchResults" style="max-height: 350px; overflow-y: auto;">
            <p style="font-size: 0.85rem; color: var(--text-muted); text-align: center;">Digite o que procura para pesquisar no portal...</p>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    setTimeout(() => {
      const input = document.getElementById('globalSearchInput');
      if (input) input.focus();
    }, 50);
  },

  executeGlobalSearch() {
    const q = document.getElementById('globalSearchInput').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('globalSearchResults');
    if (!q) {
      resultsContainer.innerHTML = '<p style="font-size: 0.85rem; color: var(--text-muted); text-align: center;">Digite o que procura para pesquisar no portal...</p>';
      return;
    }

    const data = window.CondoStore.data;
    const matches = [];

    (data.documentos || []).forEach(d => {
      if (d.nome.toLowerCase().includes(q) || d.categoria.toLowerCase().includes(q)) {
        matches.push({ title: d.nome, category: 'Documento', route: 'documentos' });
      }
    });

    (data.contratos || []).forEach(c => {
      if (c.empresa.toLowerCase().includes(q) || c.objeto.toLowerCase().includes(q)) {
        matches.push({ title: `${c.empresa} - ${c.objeto}`, category: 'Contrato', route: 'contratos' });
      }
    });

    (data.recados || []).forEach(r => {
      if (r.titulo.toLowerCase().includes(q) || r.resumo.toLowerCase().includes(q)) {
        matches.push({ title: r.titulo, category: 'Mural de Recados', route: 'recados' });
      }
    });

    if (matches.length === 0) {
      resultsContainer.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted); text-align: center;">Nenhum resultado encontrado para "<strong>${q}</strong>"</p>`;
      return;
    }

    resultsContainer.innerHTML = matches.map(m => `
      <div style="padding: 0.75rem; border-bottom: 1px solid var(--border-light); cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="App.navigateTo('${m.route}'); document.getElementById('modalSearch').remove();">
        <div>
          <strong style="font-size: 0.9rem; color: var(--primary-dark);">${m.title}</strong>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${m.category}</div>
        </div>
        <span class="material-symbols-outlined" style="color: var(--primary); font-size: 1.1rem;">chevron_right</span>
      </div>
    `).join('');
  },

  showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    let icon = 'info';
    if (type === 'success') icon = 'check_circle';
    if (type === 'error') icon = 'error';

    toast.innerHTML = `
      <span class="material-symbols-outlined" style="color: var(--primary);">${icon}</span>
      <span style="font-size: 0.88rem; font-weight: 500;">${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  },

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.App.init());
} else {
  window.App.init();
}
