/* ----------------------------------------------------
   Modern Life Residence - Main Application Orchestrator
   Roteamento, Temas, Eventos Globais e Abertura do Modal de Login
   ---------------------------------------------------- */

window.App = {
  currentRoute: 'dashboard',

  init() {
    this.setupTheme();
    this.bindEvents();
    
    // Ler rota inicial via hash da URL
    const hash = window.location.hash.replace('#', '');
    if (hash && this.isValidRoute(hash)) {
      this.currentRoute = hash;
    }

    // Escutar mudanças de dados na Store
    window.CondoStore.subscribe(() => {
      this.render();
    });

    this.render();
  },

  isValidRoute(route) {
    const validRoutes = [
      'dashboard', 'prestacao', 'balancetes', 'contratos',
      'transparencia', 'documentos', 'recados', 'ocorrencias',
      'canal', 'utilidades', 'portaria', 'agenda', 'galeria', 'admin'
    ];
    return validRoutes.includes(route);
  },

  setupTheme() {
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

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && this.isValidRoute(hash)) {
        if (hash === 'balancetes' && window.PrestacaoComponent) {
          window.PrestacaoComponent.activeTab = 'balancetes';
          this.navigateTo('prestacao');
        } else if (hash === 'contratos' && window.PrestacaoComponent) {
          window.PrestacaoComponent.activeTab = 'contratos';
          this.navigateTo('prestacao');
        } else if (hash !== this.currentRoute) {
          this.navigateTo(hash);
        }
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

    // Clique direto no botão de Entrar/Perfil do Header
    document.addEventListener('click', (e) => {
      const loginBtn = e.target.closest('#topHeaderUserBtn, .btn-login-trigger');
      if (loginBtn) {
        e.preventDefault();
        if (window.AuthComponent) {
          window.AuthComponent.renderAuthModal();
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

    if (route === 'balancetes' && window.PrestacaoComponent) {
      window.PrestacaoComponent.activeTab = 'balancetes';
      route = 'prestacao';
    } else if (route === 'contratos' && window.PrestacaoComponent) {
      window.PrestacaoComponent.activeTab = 'contratos';
      route = 'prestacao';
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
      case 'balancetes':
      case 'contratos':
        if (window.PrestacaoComponent) window.PrestacaoComponent.render(pageContainer, data);
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
      prestacao: 'Contas',
      balancetes: 'Contas',
      contratos: 'Contas',
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

    // Atualizar Widget de Perfil / Login no Header Topo
    const topHeaderUserText = document.getElementById('topHeaderUserText');
    const topHeaderUserBtn = document.getElementById('topHeaderUserBtn');

    // Atualizar Badge de Pedidos de Aprovação Pendentes para o Síndico
    const pendentesCount = (data.moradores || []).filter(m => m.status === 'Pendente').length;
    const isMasterAdmin = user && user.email && user.email.toLowerCase().trim() === 'condominio.modern.life@gmail.com';
    const adminNavItem = document.querySelector('.nav-item[data-route="admin"]');
    
    if (adminNavItem) {
      let badgeEl = adminNavItem.querySelector('.nav-pending-badge');
      if (pendentesCount > 0 && isMasterAdmin) {
        if (!badgeEl) {
          badgeEl = document.createElement('span');
          badgeEl.className = 'nav-pending-badge';
          badgeEl.style.cssText = 'background: #E65100; color: white; border-radius: 12px; padding: 2px 7px; font-size: 0.75rem; font-weight: 800; margin-left: auto; border: 1px solid #FFD54F;';
          adminNavItem.appendChild(badgeEl);
        }
        badgeEl.innerText = `${pendentesCount} Pendente${pendentesCount > 1 ? 's' : ''}`;
      } else if (badgeEl) {
        badgeEl.remove();
      }
    }

    if (user) {
      if (topHeaderUserText) {
        topHeaderUserText.innerText = pendentesCount > 0 && isMasterAdmin 
          ? `${user.nome} (${pendentesCount} 🔔)` 
          : user.nome;
      }
      if (topHeaderUserBtn) {
        topHeaderUserBtn.title = `Conectado como: ${user.nome} (Apto ${user.apartamento})`;
        topHeaderUserBtn.style.background = pendentesCount > 0 && isMasterAdmin ? '#E65100' : 'var(--primary-dark)';
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
      <div class="modal-overlay active" id="modalSearch" style="z-index: 999999;">
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
    const query = document.getElementById('globalSearchInput').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('globalSearchResults');
    if (!resultsContainer) return;

    if (!query || query.length < 2) {
      resultsContainer.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted); text-align: center;">Digite o que procura para pesquisar no portal...</p>`;
      return;
    }

    const data = window.CondoStore.data;
    const matches = [];

    // Documentos
    (data.documentos || []).forEach(doc => {
      if (doc.nome.toLowerCase().includes(query) || (doc.categoria && doc.categoria.toLowerCase().includes(query))) {
        matches.push({
          tipo: 'Documento',
          icone: 'picture_as_pdf',
          titulo: doc.nome,
          subtitulo: `Categoria: ${doc.categoria}`,
          action: () => {
            document.getElementById('modalSearch').remove();
            this.navigateTo('documentos');
          }
        });
      }
    });

    // Contratos
    (data.contratos || []).forEach(ctr => {
      if (ctr.empresa.toLowerCase().includes(query) || ctr.objeto.toLowerCase().includes(query)) {
        matches.push({
          tipo: 'Contrato',
          icone: 'description',
          titulo: ctr.empresa,
          subtitulo: ctr.objeto,
          action: () => {
            document.getElementById('modalSearch').remove();
            window.PrestacaoComponent.activeTab = 'contratos';
            this.navigateTo('prestacao');
          }
        });
      }
    });

    // Recados
    (data.recados || []).forEach(rec => {
      if (rec.titulo.toLowerCase().includes(query) || (rec.resumo && rec.resumo.toLowerCase().includes(query))) {
        matches.push({
          tipo: 'Mural de Recados',
          icone: 'campaign',
          titulo: rec.titulo,
          subtitulo: rec.resumo || rec.autor,
          action: () => {
            document.getElementById('modalSearch').remove();
            this.navigateTo('recados');
          }
        });
      }
    });

    if (matches.length === 0) {
      resultsContainer.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 1rem;">Nenhum resultado encontrado para "${query}".</p>`;
      return;
    }

    resultsContainer.innerHTML = matches.map((m, idx) => `
      <div style="padding: 0.75rem; border-bottom: 1px solid var(--border-light); cursor: pointer; display: flex; align-items: center; gap: 0.75rem; border-radius: 6px; transition: var(--transition);" 
           onmouseover="this.style.background='var(--primary-light)'" 
           onmouseout="this.style.background='transparent'" 
           onclick="App.runSearchAction(${idx})">
        <span class="material-symbols-outlined" style="color: var(--primary);">${m.icone}</span>
        <div>
          <strong style="display: block; font-size: 0.9rem; color: var(--text-main);">${m.titulo}</strong>
          <span style="font-size: 0.78rem; color: var(--text-muted);">${m.tipo} &bull; ${m.subtitulo}</span>
        </div>
      </div>
    `).join('');

    window.searchMatchesActions = matches.map(m => m.action);
  },

  runSearchAction(idx) {
    if (window.searchMatchesActions && window.searchMatchesActions[idx]) {
      window.searchMatchesActions[idx]();
    }
  },

  showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconName = 'info';
    if (type === 'success') iconName = 'check_circle';
    if (type === 'error') iconName = 'error';

    toast.innerHTML = `
      <span class="material-symbols-outlined">${iconName}</span>
      <div style="flex: 1; font-size: 0.9rem; font-weight: 500;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
};

// Inicializar a Aplicação assim que a página estiver pronta
document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});
