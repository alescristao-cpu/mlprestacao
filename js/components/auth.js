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
              <img src="./assets/logo.png" style="height: 32px; width: auto; object-fit: contain; background: white; padding: 2px 6px; border-radius: 4px;" alt="Logo">
              <span style="font-family: var(--font-heading); font-weight: 700; font-size: 1.1rem; color: white;">
                ${currentUser ? 'Perfil do Morador' : 'Acesso com Google'}
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
      <!-- Google Auth Button (Primary Requirement) -->
      <div style="margin-bottom: 1.5rem; text-align: center;">
        <button type="button" onclick="AuthComponent.handleGoogleLogin()" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.75rem; background: #FFFFFF; color: #757575; border: 1px solid #DADCE0; padding: 0.8rem 1rem; border-radius: var(--radius-sm); font-weight: 600; font-size: 0.95rem; cursor: pointer; box-shadow: var(--shadow-sm); transition: var(--transition);">
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.66 0 6.6 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.13-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.6 42.62 14.66 48 24 48z"/>
          </svg>
          Entrar com a Conta Google
        </button>
        <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.5rem;">
          Autenticação segura via Google Workspace para moradores.
        </div>
      </div>

      <div style="display: flex; align-items: center; margin: 1.25rem 0; color: var(--border-color);">
        <div style="flex: 1; border-bottom: 1px solid var(--border-color);"></div>
        <span style="padding: 0 0.75rem; font-size: 0.78rem; color: var(--text-muted);">ou acesse por e-mail</span>
        <div style="flex: 1; border-bottom: 1px solid var(--border-color);"></div>
      </div>

      <!-- Traditional Email Login -->
      <form id="formLogin" onsubmit="AuthComponent.handleLogin(event)">
        <div class="form-group">
          <label class="form-label">E-mail Cadastrado</label>
          <input type="email" id="loginEmail" class="form-control" placeholder="condominio.modern.life@gmail.com" required value="condominio.modern.life@gmail.com">
        </div>
        <div class="form-group">
          <label class="form-label">Senha de Acesso</label>
          <input type="password" id="loginPass" class="form-control" placeholder="••••••••" required value="123456">
        </div>

        <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.8rem;">
          <span class="material-symbols-outlined">login</span> Entrar com E-mail
        </button>

        <div style="margin-top: 1rem; padding: 0.75rem; background: var(--primary-light); border-radius: var(--radius-sm); font-size: 0.78rem; color: var(--primary-dark);">
          💡 <strong>E-mail Oficial do Condomínio:</strong><br>
          • <b>Síndico:</b> condominio.modern.life@gmail.com<br>
          • <b>Nome do Síndico:</b> Alessandro Cristiano da Silva
        </div>
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

  async handleGoogleLogin() {
    const res = await window.FirebaseService.loginWithGoogle();
    if (res.success) {
      App.showToast(`Autenticado via Google com sucesso como ${res.user.nome}!`, 'success');
      document.getElementById('modalAuth').remove();
      App.render();
    } else {
      App.showToast(res.error, 'error');
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

  logout() {
    window.CondoStore.setCurrentUser(null);
    App.showToast('Você saiu do sistema.', 'info');
    document.getElementById('modalAuth').remove();
    App.render();
  }
};
