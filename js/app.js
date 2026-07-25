/* ----------------------------------------------------
   Modern Life Residence - Main Application Orchestrator
   ---------------------------------------------------- */

window.App = {
  currentRoute: 'dashboard',

  init() {
    this.bindEvents();
    this.initTheme();
    this.registerServiceWorker();
    this.render();

    window.CondoStore.subscribe(() => {
      this.render();
    });
  },

  initTheme() {
    const savedTheme = localStorage.getItem('MODERN_LIFE_THEME') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
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
  },

  navigateTo(route) {
    this.currentRoute = route;
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
        window.DashboardComponent.render(pageContainer, data);
        break;
      case 'prestacao':
        window.PrestacaoComponent.render(pageContainer, data);
        break;
      case 'balancetes':
        window.BalancetesComponent.render(pageContainer, data);
        break;
      case 'contratos':
        window.ContratosComponent.render(pageContainer, data);
        break;
      case 'transparencia':
        window.TransparenciaComponent.render(pageContainer, data);
        break;
      case 'documentos':
        window.DocumentosComponent.render(pageContainer, data);
        break;
      case 'recados':
        window.RecadosComponent.render(pageContainer, data);
        break;
      case 'canal':
        window.CanalComponent.render(pageContainer, data);
        break;
      case 'ocorrencias':
        window.OcorrenciasComponent.render(pageContainer, data);
        break;
      case 'utilidades':
        window.UtilidadesComponent.render(pageContainer, data);
        break;
      case 'agenda':
        window.AgendaComponent.render(pageContainer, data);
        break;
      case 'galeria':
        window.GaleriaComponent.render(pageContainer, data);
        break;
      case 'admin':
        window.AdminComponent.render(pageContainer, data);
        break;
      default:
        window.DashboardComponent.render(pageContainer, data);
    }
  },

  updateNavigationUI() {
    const routeTitles = {
      dashboard: 'Página Inicial - Dashboard',
      prestacao: 'Prestação de Contas Mensal',
      balancetes: 'Balancetes Consolidados',
      contratos: 'Contratos Firmados',
      transparencia: 'Demonstrativo Financeiro & Gráficos',
      documentos: 'Biblioteca de Documentos',
      recados: 'Mural de Recados da Administração',
      canal: 'Canal Direto com o Síndico',
      ocorrencias: 'Reclamações & Ocorrências',
      utilidades: 'Utilidades & Reservas',
      agenda: 'Agenda & Calendário',
      galeria: 'Galeria do Condomínio',
      admin: 'Painel Administrativo Restrito'
    };

    const headerTitle = document.getElementById('headerPageTitle');
    if (headerTitle) {
      headerTitle.innerText = routeTitles[this.currentRoute] || 'Modern Life Residence';
    }

    document.querySelectorAll('.nav-item').forEach(item => {
      const route = item.getAttribute('data-route');
      if (route === this.currentRoute) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    const user = window.CondoStore.currentUser;
    const userNameEl = document.getElementById('sidebarUserName');
    const userRoleEl = document.getElementById('sidebarUserRole');
    const userAvatarEl = document.getElementById('sidebarUserAvatar');

    if (user) {
      if (userNameEl) userNameEl.innerText = user.nome;
      if (userRoleEl) userRoleEl.innerHTML = `<span class="material-symbols-outlined" style="font-size: 0.85rem;">shield</span> ${user.role} (Apto ${user.apartamento})`;
      if (userAvatarEl) userAvatarEl.innerText = user.nome.charAt(0);
    } else {
      if (userNameEl) userNameEl.innerText = 'Visitante';
      if (userRoleEl) userRoleEl.innerText = 'Clique para Entrar';
      if (userAvatarEl) userAvatarEl.innerText = '?';
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

    data.documentos.forEach(d => {
      if (d.nome.toLowerCase().includes(q) || d.categoria.toLowerCase().includes(q)) {
        matches.push({ title: d.nome, category: 'Documento', route: 'documentos' });
      }
    });

    data.contratos.forEach(c => {
      if (c.empresa.toLowerCase().includes(q) || c.objeto.toLowerCase().includes(q)) {
        matches.push({ title: `${c.empresa} - ${c.objeto}`, category: 'Contrato', route: 'contratos' });
      }
    });

    data.recados.forEach(r => {
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

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
