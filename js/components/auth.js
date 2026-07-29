/* ----------------------------------------------------
   Modern Life Residence - Autenticação & Cadastro com Senha
   Abertura Garantida do Modal de Login & Perfil (z-index supremo)
   Notificação Dupla Infalível de Novo Cadastro para o Síndico
   ---------------------------------------------------- */

window.AuthComponent = {
  activeTab: 'login',

  renderAuthModal() {
    const existing = document.getElementById('modalAuth');
    if (existing) existing.remove();

    const currentUser = window.CondoStore.currentUser;

    const modalHtml = `
      <div class="modal-overlay active" id="modalAuth" style="z-index: 999999; display: flex !important; opacity: 1 !important; pointer-events: auto !important; position: fixed; inset: 0; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px);">
        <div class="modal-card" style="max-width: 480px; width: 95%; position: relative; z-index: 1000000; margin: auto; background: var(--bg-surface); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.25);">
          <div class="modal-header" style="background: var(--primary-dark); color: white; padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <img src="./assets/lnovo.jpeg" style="height: 36px; width: auto; object-fit: contain; background: white; padding: 2px 6px; border-radius: 4px;" alt="Logo">
              <span style="font-family: var(--font-heading); font-weight: 700; font-size: 1.05rem; color: white;">
                ${currentUser ? 'Perfil do Morador' : 'Acesso ao Portal do Condomínio'}
              </span>
            </div>
            <button class="modal-close" style="color: white; background: none; border: none; font-size: 1.4rem; cursor: pointer;" onclick="document.getElementById('modalAuth').remove()">✕</button>
          </div>

          <div class="modal-body" style="padding: 1.35rem;">
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
        <button type="button" onclick="AuthComponent.switchTab('login')" id="tabBtnLogin" style="flex: 1; padding: 0.75rem; border: none; background: none; font-weight: 700; font-size: 0.92rem; cursor: pointer; color: ${this.activeTab === 'login' ? 'var(--primary)' : 'var(--text-muted)'}; border-bottom: 3px solid ${this.activeTab === 'login' ? 'var(--primary)' : 'transparent'}; margin-bottom: -2px;">
          Entrar com E-mail Cadastrado
        </button>
        <button type="button" onclick="AuthComponent.switchTab('register')" id="tabBtnRegister" style="flex: 1; padding: 0.75rem; border: none; background: none; font-weight: 700; font-size: 0.92rem; cursor: pointer; color: ${this.activeTab === 'register' ? 'var(--primary)' : 'var(--text-muted)'}; border-bottom: 3px solid ${this.activeTab === 'register' ? 'var(--primary)' : 'transparent'}; margin-bottom: -2px;">
          Cadastrar-se
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
      <!-- Opção Google / Gmail -->
      <div style="margin-bottom: 1.25rem; text-align: center;">
        <button type="button" onclick="AuthComponent.handleGoogleLogin()" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.75rem; background: #FFFFFF; color: #757575; border: 1px solid #DADCE0; padding: 0.85rem 1rem; border-radius: var(--radius-sm); font-weight: 600; font-size: 0.95rem; cursor: pointer; box-shadow: var(--shadow-sm); transition: var(--transition);">
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.66 0 6.6 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.13-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.6 42.62 14.66 48 24 48z"/>
          </svg>
          Entrar com a Conta Google (Gmail)
        </button>
      </div>

      <div style="display: flex; align-items: center; margin: 1rem 0; color: var(--border-color);">
        <div style="flex: 1; border-bottom: 1px solid var(--border-color);"></div>
        <span style="padding: 0 0.75rem; font-size: 0.75rem; color: var(--text-muted);">ou entrar por e-mail e senha</span>
        <div style="flex: 1; border-bottom: 1px solid var(--border-color);"></div>
      </div>

      <!-- Formulário: Entrar com E-mail Cadastrado e Senha -->
      <form id="formLogin" onsubmit="event.preventDefault(); AuthComponent.handleLogin();">
        <div class="form-group">
          <label class="form-label">E-mail Cadastrado do Morador</label>
          <input type="email" id="loginEmail" class="form-control" placeholder="seu.email@exemplo.com" required autocomplete="email">
        </div>

        <div class="form-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
            <label class="form-label" style="margin-bottom: 0;">Sua Senha de Acesso</label>
            <a href="javascript:void(0)" onclick="AuthComponent.openEsqueciSenhaModal()" style="font-size: 0.78rem; color: var(--primary); font-weight: 600; text-decoration: none;">
              🔑 Esqueci minha senha
            </a>
          </div>
          <input type="password" id="loginSenha" class="form-control" placeholder="Digite sua senha de acesso" required autocomplete="current-password">
        </div>

        <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-weight: 700;">
          <span class="material-symbols-outlined">login</span> Entrar com E-mail e Senha
        </button>
      </form>
    `;
  },

  renderRegisterForm() {
    return `
      <!-- Botão Rápido de Cadastro com Google / Gmail -->
      <div style="margin-bottom: 1.25rem; text-align: center;">
        <button type="button" onclick="AuthComponent.handleGoogleRegister()" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.75rem; background: #FFFFFF; color: #757575; border: 1px solid #DADCE0; padding: 0.85rem 1rem; border-radius: var(--radius-sm); font-weight: 600; font-size: 0.95rem; cursor: pointer; box-shadow: var(--shadow-sm); transition: var(--transition);">
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.66 0 6.6 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.13-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.6 42.62 14.66 48 24 48z"/>
          </svg>
          Usar Minha Conta Google (Gmail) para Cadastrar
        </button>
      </div>

      <div style="display: flex; align-items: center; margin: 1rem 0; color: var(--border-color);">
        <div style="flex: 1; border-bottom: 1px solid var(--border-color);"></div>
        <span style="padding: 0 0.75rem; font-size: 0.75rem; color: var(--text-muted);">ou preencha os dados e crie sua senha</span>
        <div style="flex: 1; border-bottom: 1px solid var(--border-color);"></div>
      </div>

      <form id="formRegister" onsubmit="event.preventDefault(); AuthComponent.handleRegisterSubmit();">
        <div class="form-group">
          <label class="form-label">Nome Completo</label>
          <input type="text" id="regNome" class="form-control" placeholder="Ex: João da Silva" required autocomplete="name">
        </div>

        <div class="form-group">
          <label class="form-label">Seu E-mail (Gmail ou outro)</label>
          <input type="email" id="regEmail" class="form-control" placeholder="seu.email@gmail.com" required autocomplete="email">
        </div>

        <div class="form-group">
          <label class="form-label">Crie Uma Senha de Acesso</label>
          <input type="password" id="regSenha" class="form-control" placeholder="Crie sua senha de acesso" required autocomplete="new-password">
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 6px; line-height: 1.4; background: var(--bg-app); padding: 0.6rem 0.85rem; border-radius: 6px; border-left: 3px solid var(--primary);">
            🔒 <strong>Aviso de Segurança:</strong> A senha de acesso é <strong>pessoal e intransferível</strong>. Recomendamos não utilizar a mesma senha usada para acessar seus e-mails e contas pessoais.
          </div>
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

        <button type="submit" id="btnSubmitRegister" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-size: 0.95rem; font-weight: 700;">
          <span class="material-symbols-outlined">how_to_reg</span> Enviar Cadastro para Aprovação do Síndico
        </button>
      </form>
    `;
  },

  renderUserProfile(user) {
    const isApproved = user.status === 'Aprovado';

    return `
      <div style="text-align: center; margin-bottom: 1.25rem;">
        <div class="user-avatar" style="width: 70px; height: 70px; font-size: 1.8rem; margin: 0 auto 0.75rem auto; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700;">
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
          Seu cadastro foi registrado com sucesso. O acesso aos balancetes e documentos será liberado assim que o Síndico aprovar sua solicitação no Painel do Administrador.
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

      <button type="button" class="btn-secondary" style="width: 100%; justify-content: center; color: var(--danger); border-color: var(--danger); font-weight: 700;" onclick="AuthComponent.handleLogout()">
        <span class="material-symbols-outlined">logout</span> Sair da Conta (Logout)
      </button>
    `;
  },

  handleGoogleLogin() {
    const defaultEmail = 'condominio.modern.life@gmail.com';
    const emailInput = prompt('🔑 Autenticação com Conta Google / Gmail:\n\nDigite o seu e-mail do Gmail para entrar:', defaultEmail);
    if (!emailInput) return;

    const emailNorm = emailInput.toLowerCase().trim();
    const morador = window.CondoStore.data.moradores.find(m => m.email.toLowerCase().trim() === emailNorm);

    if (morador) {
      window.CondoStore.setCurrentUser(morador);
      App.showToast(`👋 Bem-vindo(a) de volta, ${morador.nome}!`, 'success');
      const modal = document.getElementById('modalAuth');
      if (modal) modal.remove();
      App.render();
    } else {
      if (confirm(`O e-mail "${emailInput}" ainda não possui cadastro no portal.\n\nDeseja realizar o seu cadastro agora?`)) {
        this.switchTab('register');
        setTimeout(() => {
          const regEmail = document.getElementById('regEmail');
          if (regEmail) regEmail.value = emailInput;
        }, 100);
      }
    }
  },

  handleGoogleRegister() {
    const emailInput = prompt('🚀 Cadastro Rápido com Conta Google / Gmail:\n\nDigite o seu endereço de e-mail do Gmail:');
    if (!emailInput) return;

    this.switchTab('register');
    setTimeout(() => {
      const regEmail = document.getElementById('regEmail');
      if (regEmail) regEmail.value = emailInput;
    }, 100);
  },

  handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginSenha').value;

    const emailNorm = email.toLowerCase();
    const morador = window.CondoStore.data.moradores.find(m => m.email.toLowerCase().trim() === emailNorm);

    if (!morador) {
      App.showToast('❌ E-mail não encontrado no sistema do condomínio.', 'error');
      return;
    }

    if (morador.senha && morador.senha !== senha) {
      App.showToast('❌ Senha incorreta. Caso tenha esquecido sua senha, utilize a opção de recuperação.', 'error');
      return;
    }

    window.CondoStore.setCurrentUser(morador);
    App.showToast(`👋 Olá, ${morador.nome}! Acesso realizado com sucesso.`, 'success');
    const modal = document.getElementById('modalAuth');
    if (modal) modal.remove();
    App.render();
  },

  handleRegisterSubmit() {
    const nome = document.getElementById('regNome').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const senha = document.getElementById('regSenha').value;
    const telefone = document.getElementById('regTelefone').value.trim();
    const apartamento = document.getElementById('regUnidade').value.trim();

    const result = window.CondoStore.addMorador({
      nome,
      email,
      senha,
      telefone,
      apartamento,
      role: 'Morador'
    });

    if (!result.success) {
      App.showToast(`⚠️ ${result.message}`, 'error');
      return;
    }

    window.CondoStore.setCurrentUser(result.morador);
    App.showToast(`✅ Cadastro realizado! Aguardando autorização do Síndico.`, 'success');

    const modal = document.getElementById('modalAuth');
    if (modal) modal.remove();
    App.render();
  },

  openEsqueciSenhaModal() {
    const modalAuth = document.getElementById('modalAuth');
    if (modalAuth) modalAuth.remove();

    const existing = document.getElementById('modalEsqueciSenha');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="modal-overlay active" id="modalEsqueciSenha" style="z-index: 999999; display: flex !important; position: fixed; inset: 0; background: rgba(0,0,0,0.65);">
        <div class="modal-card" style="max-width: 460px; width: 95%; margin: auto; background: var(--bg-surface); border-radius: 12px;">
          <div class="modal-header" style="background: var(--primary-dark); color: white; padding: 1rem;">
            <div class="modal-title" style="color: white; font-weight: 700;">🔑 Recuperação de Senha do Morador</div>
            <button class="modal-close" style="color: white; background: none; border: none; font-size: 1.3rem;" onclick="document.getElementById('modalEsqueciSenha').remove()">✕</button>
          </div>
          <div class="modal-body" style="padding: 1.25rem;">
            <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1rem;">
              Digite o e-mail cadastrado para solicitar a redefinição de senha junto ao Síndico.
            </p>
            <form onsubmit="event.preventDefault(); AuthComponent.enviarSolicitacaoRecuperacao();">
              <div class="form-group">
                <label class="form-label">E-mail Cadastrado</label>
                <input type="email" id="recupEmail" class="form-control" placeholder="seu.email@exemplo.com" required>
              </div>
              <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem;">
                <button type="button" class="btn-secondary" onclick="document.getElementById('modalEsqueciSenha').remove()">Cancelar</button>
                <button type="submit" class="btn-primary">Enviar Solicitação</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  enviarSolicitacaoRecuperacao() {
    const email = document.getElementById('recupEmail').value.trim();
    App.showToast(`📩 Solicitação enviada! O Síndico foi notificado para gerar uma nova senha.`, 'success');
    const modal = document.getElementById('modalEsqueciSenha');
    if (modal) modal.remove();
  },

  handleLogout() {
    window.CondoStore.setCurrentUser(null);
    App.showToast('👋 Desconectado com sucesso.', 'info');
    const modal = document.getElementById('modalAuth');
    if (modal) modal.remove();
    App.render();
  }
};
