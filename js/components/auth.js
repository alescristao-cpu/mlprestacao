/* ----------------------------------------------------
   Modern Life Residence - Authentication UI Component
   ---------------------------------------------------- */

window.AuthComponent = {
  renderAuthModal() {
    const existing = document.getElementById('modalAuth');
    if (existing) existing.remove();

    const currentUser = window.CondoStore.currentUser;

    const modalHtml = `
      <div class="modal-overlay active" id="modalAuth">
        <div class="modal-card" style="max-width: 460px;">
          <div class="modal-header" style="background: var(--primary-dark); color: white;">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <img src="./assets/logo.svg" style="height: 32px; filter: brightness(0) invert(1);" alt="Logo">
              <span style="font-family: var(--font-heading); font-weight: 700; font-size: 1.1rem; color: white;">
                ${currentUser ? 'Perfil do Morador' : 'Acesso ao Portal'}
              </span>
            </div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalAuth').remove()">✕</button>
          </div>

          <div class="modal-body">
            ${currentUser ? this.renderUserProfile(currentUser) : this.renderLoginForm()}
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  renderLoginForm() {
    return `
      <div id="authTabs" class="tab-list">
        <button class="tab-btn active" onclick="AuthComponent.switchTab('login')">Entrar</button>
        <button class="tab-btn" onclick="AuthComponent.switchTab('register')">Cadastrar Morador</button>
      </div>

      <!-- Login View -->
      <form id="formLogin" onsubmit="AuthComponent.handleLogin(event)">
        <div class="form-group">
          <label class="form-label">E-mail Cadastrado</label>
          <input type="email" id="loginEmail" class="form-control" placeholder="seu.email@exemplo.com" required value="sindico@modernlife.com.br">
        </div>
        <div class="form-group">
          <label class="form-label">Senha de Acesso</label>
          <input type="password" id="loginPass" class="form-control" placeholder="••••••••" required value="123456">
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <label style="font-size: 0.8rem; display: flex; align-items: center; gap: 4px; cursor: pointer;">
            <input type="checkbox" checked> Lembrar acesso
          </label>
          <a href="#" onclick="alert('Instruções de redefinição enviadas para o seu e-mail cadastrado.')" style="font-size: 0.8rem; color: var(--primary); text-decoration: none;">Esqueceu a senha?</a>
        </div>

        <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.8rem;">
          <span class="material-symbols-outlined">login</span> Entrar no Portal
        </button>

        <div style="margin-top: 1rem; padding: 0.75rem; background: var(--primary-light); border-radius: var(--radius-sm); font-size: 0.78rem; color: var(--primary-dark);">
          💡 <strong>Modo de Demonstração Rápida:</strong><br>
          • <b>Síndico / Admin:</b> sindico@modernlife.com.br<br>
          • <b>Conselheiro:</b> mariana.castro@gmail.com<br>
          • <b>Morador:</b> roberto.almeida@hotmail.com
        </div>
      </form>

      <!-- Register View -->
      <form id="formRegister" onsubmit="AuthComponent.handleRegister(event)" style="display: none;">
        <div class="form-group">
          <label class="form-label">Nome Completo</label>
          <input type="text" id="regNome" class="form-control" placeholder="Ex: Ana Maria Santos" required>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Apartamento</label>
            <input type="text" id="regApto" class="form-control" placeholder="Ex: 104" required>
          </div>
          <div class="form-group">
            <label class="form-label">Bloco / Torre</label>
            <select id="regBloco" class="form-control" required>
              <option value="A">Bloco A</option>
              <option value="B">Bloco B</option>
            </select>
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">CPF</label>
            <input type="text" id="regCPF" class="form-control" placeholder="000.000.000-00" required>
          </div>
          <div class="form-group">
            <label class="form-label">Telefone / WhatsApp</label>
            <input type="text" id="regTel" class="form-control" placeholder="(11) 90000-0000" required>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">E-mail</label>
          <input type="email" id="regEmail" class="form-control" placeholder="seu@email.com" required>
        </div>
        <div class="form-group">
          <label class="form-label">Crie uma Senha</label>
          <input type="password" id="regSenha" class="form-control" placeholder="Mínimo 6 caracteres" required>
        </div>

        <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.8rem;">
          <span class="material-symbols-outlined">how_to_reg</span> Solicitar Cadastro
        </button>
        <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.6rem; text-align: center;">
          * O cadastro passará por aprovação do síndico/administração por motivos de segurança.
        </p>
      </form>
    `;
  },

  renderUserProfile(user) {
    return `
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div class="user-avatar" style="width: 70px; height: 70px; font-size: 1.8rem; margin: 0 auto 0.75rem auto;">
          ${user.nome.charAt(0)}
        </div>
        <h3 style="font-family: var(--font-heading); color: var(--primary-dark); font-size: 1.25rem;">${user.nome}</h3>
        <span class="badge ${user.status === 'Aprovado' ? 'badge-success' : 'badge-warning'}" style="margin-top: 4px;">
          ${user.role} &bull; ${user.status}
        </span>
      </div>

      <div style="background: var(--bg-app); padding: 1rem; border-radius: var(--radius-md); font-size: 0.88rem; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: var(--text-muted);">Apartamento / Bloco:</span>
          <strong>Apto ${user.apartamento} - Bloco ${user.bloco}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: var(--text-muted);">E-mail:</span>
          <strong>${user.email}</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-muted);">Telefone:</span>
          <strong>${user.telefone}</strong>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${user.role === 'Administrador' ? `
          <button onclick="document.getElementById('modalAuth').remove(); App.navigateTo('admin');" class="btn-primary" style="justify-content: center;">
            <span class="material-symbols-outlined">admin_panel_settings</span> Acessar Painel Administrativo
          </button>
        ` : ''}
        <button onclick="AuthComponent.logout()" class="btn-secondary btn-danger" style="justify-content: center; background: #FFEBEE; color: #C62828; border: 1px solid #FFCDD2;">
          <span class="material-symbols-outlined">logout</span> Sair da Conta
        </button>
      </div>
    `;
  },

  switchTab(tab) {
    const formLogin = document.getElementById('formLogin');
    const formRegister = document.getElementById('formRegister');
    const btns = document.querySelectorAll('#authTabs .tab-btn');

    if (tab === 'login') {
      formLogin.style.display = 'block';
      formRegister.style.display = 'none';
      btns[0].classList.add('active');
      btns[1].classList.remove('active');
    } else {
      formLogin.style.display = 'none';
      formRegister.style.display = 'block';
      btns[0].classList.remove('active');
      btns[1].classList.add('active');
    }
  },

  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;

    const res = await window.FirebaseService.loginWithEmailPassword(email, pass);
    if (res.success) {
      App.showToast('Login efetuado com sucesso!', 'success');
      document.getElementById('modalAuth').remove();
      App.render();
    } else {
      App.showToast(res.error, 'error');
    }
  },

  async handleRegister(e) {
    e.preventDefault();
    const userData = {
      nome: document.getElementById('regNome').value,
      apartamento: document.getElementById('regApto').value,
      bloco: document.getElementById('regBloco').value,
      cpf: document.getElementById('regCPF').value,
      telefone: document.getElementById('regTel').value,
      email: document.getElementById('regEmail').value,
      senha: document.getElementById('regSenha').value
    };

    const res = await window.FirebaseService.registerUser(userData);
    if (res.success) {
      alert('Cadastro enviado com sucesso! Seu acesso está pendente de aprovação pelo administrador do condomínio.');
      document.getElementById('modalAuth').remove();
    } else {
      App.showToast(res.error, 'error');
    }
  },

  logout() {
    window.CondoStore.setCurrentUser(null);
    App.showToast('Você saiu do sistema.', 'info');
    document.getElementById('modalAuth').remove();
    App.render();
  }
};
