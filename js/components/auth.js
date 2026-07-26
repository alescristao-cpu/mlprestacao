/* ----------------------------------------------------
   Modern Life Residence - Cadastro de Moradores & Sincronização iOS/iPhone
   Garante que cadastros feitos no iPhone cheguem ao Síndico em qualquer dispositivo
   ---------------------------------------------------- */

window.AuthComponent = {
  activeTab: 'login',

  renderAuthModal() {
    const existing = document.getElementById('modalAuth');
    if (existing) existing.remove();

    const currentUser = window.CondoStore.currentUser;

    const modalHtml = `
      <div class="modal-overlay active" id="modalAuth">
        <div class="modal-card" style="max-width: 480px;">
          <div class="modal-header" style="background: var(--primary-dark); color: white;">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <img src="./assets/lnovo.jpeg" style="height: 36px; width: auto; object-fit: contain; background: white; padding: 2px 6px; border-radius: 4px;" alt="Logo">
              <span style="font-family: var(--font-heading); font-weight: 700; font-size: 1.05rem; color: white;">
                ${currentUser ? 'Perfil do Morador' : 'Acesso ao Portal do Condomínio'}
              </span>
            </div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalAuth').remove()">✕</button>
          </div>

          <div class="modal-body">
            ${currentUser ? this.renderUserProfile(currentUser) : this.renderAuthTabs()}
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  renderAuthTabs() {
    return `
      <!-- Tab Switcher -->
      <div style="display: flex; border-bottom: 2px solid var(--border-light); margin-bottom: 1.25rem;">
        <button type="button" onclick="AuthComponent.switchTab('login')" id="tabBtnLogin" style="flex: 1; padding: 0.75rem; border: none; background: none; font-weight: 700; font-size: 0.95rem; cursor: pointer; color: ${this.activeTab === 'login' ? 'var(--primary)' : 'var(--text-muted)'}; border-bottom: 3px solid ${this.activeTab === 'login' ? 'var(--primary)' : 'transparent'}; margin-bottom: -2px;">
          Entrar
        </button>
        <button type="button" onclick="AuthComponent.switchTab('register')" id="tabBtnRegister" style="flex: 1; padding: 0.75rem; border: none; background: none; font-weight: 700; font-size: 0.95rem; cursor: pointer; color: ${this.activeTab === 'register' ? 'var(--primary)' : 'var(--text-muted)'}; border-bottom: 3px solid ${this.activeTab === 'register' ? 'var(--primary)' : 'transparent'}; margin-bottom: -2px;">
          Cadastrar Novo Morador
        </button>
      </div>

      ${this.activeTab === 'login' ? this.renderLoginForm() : this.renderRegisterForm()}
    `;
  },

  switchTab(tab) {
    this.activeTab = tab;
    const body = document.querySelector('#modalAuth .modal-body');
    if (body) {
      body.innerHTML = this.renderAuthTabs();
    }
  },

  renderLoginForm() {
    return `
      <!-- Google Auth Primary Option -->
      <div style="margin-bottom: 1.25rem; text-align: center;">
        <button type="button" onclick="AuthComponent.handleGoogleLogin()" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.75rem; background: #FFFFFF; color: #757575; border: 1px solid #DADCE0; padding: 0.8rem 1rem; border-radius: var(--radius-sm); font-weight: 600; font-size: 0.95rem; cursor: pointer; box-shadow: var(--shadow-sm); transition: var(--transition);">
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.66 0 6.6 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.13-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.6 42.62 14.66 48 24 48z"/>
          </svg>
          Entrar com a Conta Google
        </button>
        <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 0.4rem;">
          Moradores autorizados pela administração acessam diretamente via Google.
        </div>
      </div>

      <div style="display: flex; align-items: center; margin: 1rem 0; color: var(--border-color);">
        <div style="flex: 1; border-bottom: 1px solid var(--border-color);"></div>
        <span style="padding: 0 0.75rem; font-size: 0.75rem; color: var(--text-muted);">ou entrar por e-mail</span>
        <div style="flex: 1; border-bottom: 1px solid var(--border-color);"></div>
      </div>

      <!-- E-mail Form -->
      <form id="formLogin" onsubmit="AuthComponent.handleLogin(event)">
        <div class="form-group">
          <label class="form-label">E-mail do Morador</label>
          <input type="email" id="loginEmail" class="form-control" placeholder="seu.email@exemplo.com" required>
        </div>

        <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.8rem;">
          <span class="material-symbols-outlined">login</span> Entrar por E-mail
        </button>
      </form>
    `;
  },

  renderRegisterForm() {
    return `
      <div style="background: var(--primary-light); padding: 0.85rem; border-radius: var(--radius-sm); font-size: 0.82rem; color: var(--primary-dark); margin-bottom: 1rem; border-left: 4px solid var(--primary);">
        📋 <strong>Cadastro de Morador (iOS / Android / PC):</strong><br>
        Preencha seus dados abaixo. Sua solicitação será enviada para o <strong>Painel do Administrador (Síndico)</strong>.
      </div>

      <form id="formRegister" onsubmit="AuthComponent.handleRegister(event)">
        <div class="form-group">
          <label class="form-label">Nome Completo</label>
          <input type="text" id="regNome" class="form-control" placeholder="Ex: João da Silva" required autocomplete="name">
        </div>

        <div class="form-group">
          <label class="form-label">E-mail Principal</label>
          <input type="email" id="regEmail" class="form-control" placeholder="seu.email@exemplo.com" required autocomplete="email">
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Telefone / WhatsApp</label>
            <input type="tel" id="regTelefone" class="form-control" placeholder="(11) 99999-9999" required autocomplete="tel">
          </div>

          <div class="form-group">
            <label class="form-label">Unidade / Apartamento</label>
            <input type="text" id="regUnidade" class="form-control" placeholder="Ex: Apt 402" required>
          </div>
        </div>

        <button type="button" onclick="AuthComponent.handleRegisterSubmit()" id="btnSubmitRegister" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-size: 0.95rem;">
          <span class="material-symbols-outlined">send</span> Cadastrar &amp; Enviar Solicitação
        </button>
      </form>
    `;
  },

  renderUserProfile(user) {
    const isApproved = user.status === 'Aprovado';

    return `
      <div style="text-align: center; margin-bottom: 1.25rem;">
        <div class="user-avatar" style="width: 70px; height: 70px; font-size: 1.8rem; margin: 0 auto 0.75rem auto;">
          ${user.nome.charAt(0)}
        </div>
        <h3 style="font-family: var(--font-heading); color: var(--primary-dark); font-size: 1.2rem;">${user.nome}</h3>
        <span class="badge ${isApproved ? 'badge-success' : 'badge-warning'}" style="margin-top: 4px;">
          ${user.role} &bull; ${user.status}
        </span>
      </div>

      ${!isApproved ? `
        <div style="background: #FFF3E0; border: 1px solid #FFE0B2; padding: 1rem; border-radius: var(--radius-md); font-size: 0.85rem; color: #E65100; margin-bottom: 1.25rem; text-align: center;">
          <span class="material-symbols-outlined" style="font-size: 2rem; display: block; margin-bottom: 0.25rem;">hourglass_top</span>
          <strong>Aguardando Autorização da Administração!</strong><br>
          Seu cadastro foi enviado com sucesso. O acesso aos balancetes e documentos será liberado assim que o Síndico aprovar sua solicitação no Painel do Administrador.
        </div>
      ` : ''}

      <div style="background: var(--bg-app); padding: 1rem; border-radius: var(--radius-md); font-size: 0.88rem; margin-bottom: 1.25rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
          <span style="color: var(--text-muted);">Unidade / Apartamento:</span>
          <strong>Apto ${user.apartamento}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
          <span style="color: var(--text-muted);">E-mail:</span>
          <strong>${user.email}</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-muted);">Telefone:</span>
          <strong>${user.telefone || 'Não informado'}</strong>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${user.role === 'Administrador' ? `
          <button onclick="document.getElementById('modalAuth').remove(); App.navigateTo('admin');" class="btn-primary" style="justify-content: center;">
            <span class="material-symbols-outlined">admin_panel_settings</span> Acessar Painel do Administrador (Síndico)
          </button>
        ` : ''}
        <button onclick="AuthComponent.logout()" class="btn-secondary btn-danger" style="justify-content: center; background: #FFEBEE; color: #C62828; border: 1px solid #FFCDD2;">
          <span class="material-symbols-outlined">logout</span> Sair da Conta
        </button>
      </div>
    `;
  },

  async handleGoogleLogin() {
    const res = await window.FirebaseService.loginWithGoogle();
    if (res.success) {
      App.showToast(`Autenticado via Google como ${res.user.nome}!`, 'success');
      const modal = document.getElementById('modalAuth');
      if (modal) modal.remove();
      App.render();
    } else {
      App.showToast(res.error, 'error');
    }
  },

  handleLogin(e) {
    if (e) e.preventDefault();
    const emailEl = document.getElementById('loginEmail');
    if (!emailEl) return;

    const email = emailEl.value.trim();
    if (!email) return;

    const user = window.CondoStore.data.moradores.find(m => m.email.toLowerCase() === email.toLowerCase());

    if (user) {
      window.CondoStore.setCurrentUser(user);
      if (user.status === 'Aprovado') {
        App.showToast(`Bem-vindo(a), ${user.nome}!`, 'success');
      } else {
        App.showToast('Seu cadastro está aguardando aprovação no Painel do Administrador (Síndico).', 'info');
      }
      const modal = document.getElementById('modalAuth');
      if (modal) modal.remove();
      App.render();
    } else {
      App.showToast('E-mail não encontrado. Por favor, cadastre-se primeiro.', 'error');
    }
  },

  handleRegister(e) {
    if (e) e.preventDefault();
    this.handleRegisterSubmit();
  },

  async handleRegisterSubmit() {
    const nomeEl = document.getElementById('regNome');
    const emailEl = document.getElementById('regEmail');
    const telefoneEl = document.getElementById('regTelefone');
    const unidadeEl = document.getElementById('regUnidade');

    if (!nomeEl || !emailEl || !unidadeEl) return;

    const nome = nomeEl.value.trim();
    const email = emailEl.value.trim();
    const telefone = telefoneEl ? telefoneEl.value.trim() : '';
    const unidade = unidadeEl.value.trim();

    if (!nome || !email || !unidade) {
      App.showToast('Preencha todos os campos obrigatórios (Nome, E-mail e Unidade).', 'error');
      return;
    }

    const btnSubmit = document.getElementById('btnSubmitRegister');
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `<span class="material-symbols-outlined" style="animation: spin 1s infinite linear;">sync</span> Enviando Cadastro...`;
    }

    // 1. Cadastra localmente com status PENDENTE
    const newMorador = window.CondoStore.addMorador({
      nome,
      email,
      telefone,
      apartamento: unidade,
      cpf: 'Cadastrado no Portal'
    });

    window.CondoStore.setCurrentUser(newMorador);

    // 2. Dispara envio para o serviço central de nuvem (FormSubmit) para chegar no painel do Síndico em qualquer dispositivo
    try {
      await fetch('https://formsubmit.co/ajax/condominio.modern.life@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `[NOVO CADASTRO DE MORADOR] ${nome} (Apto ${unidade})`,
          "Nome do Morador": nome,
          "E-mail": email,
          "Telefone": telefone,
          "Unidade": unidade,
          "Data do Cadastro": new Date().toLocaleString("pt-BR"),
          "Status": "Aguardando Aprovação no Painel do Síndico"
        })
      });
    } catch (err) {}

    App.showToast(`Cadastro de ${nome} realizado com sucesso! Aguardando aprovação do Síndico.`, 'info');

    const modal = document.getElementById('modalAuth');
    if (modal) modal.remove();

    App.render();
  },

  logout() {
    window.CondoStore.setCurrentUser(null);
    App.showToast('Você saiu da sua conta.', 'info');
    const modal = document.getElementById('modalAuth');
    if (modal) modal.remove();
    App.render();
  }
};
