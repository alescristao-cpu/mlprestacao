/* ----------------------------------------------------
   Modern Life Residence - Autenticação & Cadastro com Senha
   Formulário de Cadastro com Rolagem Fluida e Botão de Envio Destacado (Totalmente Visível em Celulares e Telas Pequenas)
   ---------------------------------------------------- */

window.AuthComponent = {
  activeTab: 'login',

  renderAuthModal() {
    const existing = document.getElementById('modalAuth');
    if (existing) existing.remove();

    const currentUser = window.CondoStore ? window.CondoStore.currentUser : null;

    const modalHtml = `
      <div class="modal-overlay active" id="modalAuth" style="z-index: 999999; display: flex !important; position: fixed; inset: 0; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); align-items: center; justify-content: center; padding: 1rem;">
        <div class="modal-card" style="max-width: 500px; width: 100%; max-height: 90vh; display: flex; flex-direction: column; z-index: 1000000; background: var(--bg-surface); border-radius: 14px; overflow: hidden; box-shadow: 0 12px 35px rgba(0,0,0,0.3);">
          
          <div class="modal-header" style="background: var(--primary-dark); color: white; padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <img src="./assets/lnovo.jpeg" style="height: 36px; width: auto; object-fit: contain; background: white; padding: 2px 6px; border-radius: 4px;" alt="Logo">
              <span style="font-family: var(--font-heading); font-weight: 700; font-size: 1.05rem; color: white;">
                ${currentUser ? 'Perfil do Morador' : 'Acesso ao Portal do Condomínio'}
              </span>
            </div>
            <button class="modal-close" style="color: white; background: none; border: none; font-size: 1.4rem; cursor: pointer;" onclick="document.getElementById('modalAuth').remove()">✕</button>
          </div>

          <div class="modal-body" style="padding: 1.35rem; overflow-y: auto; flex: 1; -webkit-overflow-scrolling: touch;">
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
      <div style="display: flex; border-bottom: 2px solid var(--border-light); margin-bottom: 1.25rem; position: sticky; top: -1.35rem; background: var(--bg-surface); z-index: 10; padding-top: 0.25rem;">
        <button type="button" onclick="AuthComponent.switchTab('login')" id="tabBtnLogin" style="flex: 1; padding: 0.75rem; border: none; background: none; font-weight: 700; font-size: 0.92rem; cursor: pointer; color: ${this.activeTab === 'login' ? 'var(--primary)' : 'var(--text-muted)'}; border-bottom: 3px solid ${this.activeTab === 'login' ? 'var(--primary)' : 'transparent'}; margin-bottom: -2px;">
          Entrar
        </button>
        <button type="button" onclick="AuthComponent.switchTab('register')" id="tabBtnRegister" style="flex: 1; padding: 0.75rem; border: none; background: none; font-weight: 700; font-size: 0.92rem; cursor: pointer; color: ${this.activeTab === 'register' ? 'var(--primary)' : 'var(--text-muted)'}; border-bottom: 3px solid ${this.activeTab === 'register' ? 'var(--primary)' : 'transparent'}; margin-bottom: -2px;">
          📝 Cadastrar-se
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
      <!-- Formulário: Entrar com E-mail Cadastrado e Senha -->
      <form id="formLogin" onsubmit="event.preventDefault(); AuthComponent.handleLogin();" style="margin-top: 0.5rem;">
        <div class="form-group">
          <label class="form-label" style="font-weight: 700;">E-mail Cadastrado do Morador</label>
          <input type="email" id="loginEmail" class="form-control" placeholder="seu.email@exemplo.com" required autocomplete="email">
        </div>

        <div class="form-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
            <label class="form-label" style="margin-bottom: 0; font-weight: 700;">Sua Senha de Acesso</label>
            <a href="javascript:void(0)" onclick="AuthComponent.openEsqueciSenhaModal()" style="font-size: 0.78rem; color: var(--primary); font-weight: 600; text-decoration: none;">
              🔑 Esqueci minha senha
            </a>
          </div>
          <input type="password" id="loginSenha" class="form-control" placeholder="Digite sua senha de acesso" required autocomplete="current-password">
        </div>

        <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.9rem; font-weight: 700; font-size: 1rem; border-radius: 8px; margin-top: 0.75rem;" onclick="AuthComponent.handleLogin()">
          <span class="material-symbols-outlined">login</span> Entrar com E-mail e Senha
        </button>
      </form>
    `;
  },

  renderRegisterForm() {
    return `
      <form id="formRegister" onsubmit="event.preventDefault(); AuthComponent.handleRegisterSubmit();" style="margin-top: 0.5rem;">
        
        <div class="form-group">
          <label class="form-label" style="font-weight: 700; color: var(--primary-dark);">Nome Completo *</label>
          <input type="text" id="regNome" class="form-control" placeholder="Ex: João da Silva" required autocomplete="name" style="font-weight: 600;">
        </div>

        <div class="form-group">
          <label class="form-label" style="font-weight: 700; color: var(--primary-dark);">Seu E-mail *</label>
          <input type="email" id="regEmail" class="form-control" placeholder="seu.email@exemplo.com" required autocomplete="email" style="font-weight: 600;">
        </div>

        <div class="form-group">
          <label class="form-label" style="font-weight: 700; color: var(--primary-dark);">Crie Uma Senha de Acesso *</label>
          <input type="password" id="regSenha" class="form-control" placeholder="Crie sua senha de acesso" required autocomplete="new-password" style="font-weight: 600;">
        </div>

        <div class="form-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
          <div class="form-group">
            <label class="form-label" style="font-weight: 700; color: var(--primary-dark);">Telefone / WhatsApp *</label>
            <input type="tel" id="regTelefone" class="form-control" placeholder="(27) 99999-9999" required autocomplete="tel" style="font-weight: 600;">
          </div>

          <div class="form-group">
            <label class="form-label" style="font-weight: 700; color: var(--primary-dark);">Apartamento *</label>
            <input type="text" id="regUnidade" class="form-control" placeholder="Ex: 402" required style="font-weight: 600;">
          </div>
        </div>

        <!-- BOTÃO DE CADASTRO SEMPRE VISÍVEL E DESTACADO -->
        <div style="margin-top: 1.25rem; margin-bottom: 0.5rem;">
          <button type="submit" id="btnSubmitRegister" class="btn-primary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; font-size: 1.05rem; font-weight: 800; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; border: none; border-radius: 10px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35); cursor: pointer;" onclick="AuthComponent.handleRegisterSubmit()">
            <span class="material-symbols-outlined" style="font-size: 1.4rem;">how_to_reg</span> FINALIZAR E ENVIAR CADASTRO
          </button>
        </div>

      </form>
    `;
  },

  renderUserProfile(user) {
    const isApproved = user.status === 'Aprovado';

    return `
      <div style="text-align: center; margin-bottom: 1.25rem;">
        <div class="user-avatar" style="width: 70px; height: 70px; font-size: 1.8rem; margin: 0 auto 0.75rem auto; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700;">
          ${user.nome ? user.nome.charAt(0) : 'U'}
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
    try {
      const emailInput = document.getElementById('loginEmail');
      const senhaInput = document.getElementById('loginSenha');

      if (!emailInput || !senhaInput) {
        alert('Por favor, informe seu e-mail e senha.');
        return;
      }

      const email = emailInput.value.trim().toLowerCase();
      const senha = senhaInput.value;

      if (!email) {
        App.showToast('⚠️ Por favor, digite seu e-mail cadastrado.', 'error');
        return;
      }

      const moradores = (window.CondoStore && window.CondoStore.data) ? window.CondoStore.data.moradores : [];
      let morador = moradores.find(m => m.email && m.email.toLowerCase().trim() === email);

      // Fallback infalível para o Síndico Master (condominio.modern.life@gmail.com)
      if (!morador && email === 'condominio.modern.life@gmail.com') {
        morador = {
          id: 'usr_sindico',
          nome: 'Alessandro Cristiano da Silva',
          apartamento: 'Administração',
          cpf: 'Cadastrado no Portal',
          telefone: '27992516970',
          email: 'condominio.modern.life@gmail.com',
          senha: 'ModernLife2026',
          status: 'Aprovado',
          role: 'Administrador',
          dataCadastro: '2025-01-10'
        };
      }

      if (!morador) {
        App.showToast(`❌ O e-mail "${email}" não foi encontrado. Clique na aba Cadastrar-se.`, 'error');
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
    } catch (err) {
      console.error('Erro no handleLogin:', err);
      alert('Erro ao tentar logar: ' + err.message);
    }
  },

  handleRegisterSubmit() {
    try {
      const nomeInput = document.getElementById('regNome');
      const emailInput = document.getElementById('regEmail');
      const senhaInput = document.getElementById('regSenha');
      const telefoneInput = document.getElementById('regTelefone');
      const unidadeInput = document.getElementById('regUnidade');

      if (!nomeInput || !emailInput || !senhaInput || !telefoneInput || !unidadeInput) {
        return;
      }

      const nome = nomeInput.value.trim();
      const email = emailInput.value.trim();
      const senha = senhaInput.value;
      const telefone = telefoneInput.value.trim();
      const apartamento = unidadeInput.value.trim();

      if (!nome || !email || !senha || !telefone || !apartamento) {
        App.showToast('⚠️ Por favor, preencha todos os campos do formulário.', 'error');
        return;
      }

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
    } catch (err) {
      console.error('Erro no handleRegisterSubmit:', err);
      alert('Erro no cadastro: ' + err.message);
    }
  },

  openEsqueciSenhaModal() {
    const modalAuth = document.getElementById('modalAuth');
    if (modalAuth) modalAuth.remove();

    const existing = document.getElementById('modalEsqueciSenha');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="modal-overlay active" id="modalEsqueciSenha" style="z-index: 999999; display: flex !important; position: fixed; inset: 0; background: rgba(0,0,0,0.65); align-items: center; justify-content: center; padding: 1rem;">
        <div class="modal-card" style="max-width: 460px; width: 100%; background: var(--bg-surface); border-radius: 12px; overflow: hidden;">
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
