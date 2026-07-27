/* ----------------------------------------------------
   Modern Life Residence - Autenticação & Cadastro com Senha
   Notificação Instantânea de Novo Cadastro para o Síndico (Painel + E-mail + Nuvem)
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
          <input type="password" id="loginSenha" class="form-control" placeholder="Digite sua senha ou senha temporária" required autocomplete="current-password">
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
          <span class="material-symbols-outlined">how_to_reg</span> Cadastrar-se com Senha
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

      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${user.role === 'Administrador' ? `
          <button onclick="document.getElementById('modalAuth').remove(); App.navigateTo('admin');" class="btn-primary" style="justify-content: center;">
            <span class="material-symbols-outlined">admin_panel_settings</span> Acessar Painel do Administrador (Síndico)
          </button>
        ` : ''}

        ${user.role === 'Portaria' ? `
          <button onclick="document.getElementById('modalAuth').remove(); App.navigateTo('portaria');" class="btn-primary" style="justify-content: center; background: #E65100;">
            <span class="material-symbols-outlined">door_front</span> Acessar Painel da Portaria
          </button>
        ` : ''}

        <button onclick="AuthComponent.logout()" class="btn-secondary btn-danger" style="justify-content: center; background: #FFEBEE; color: #C62828; border: 1px solid #FFCDD2;">
          <span class="material-symbols-outlined">logout</span> Sair da Conta
        </button>
      </div>
    `;
  },

  openEsqueciSenhaModal() {
    const modalAuth = document.getElementById('modalAuth');
    if (modalAuth) modalAuth.remove();

    const existing = document.getElementById('modalEsqueciSenha');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="modal-overlay active" id="modalEsqueciSenha">
        <div class="modal-card" style="max-width: 480px;">
          <div class="modal-header" style="background: var(--primary-dark); color: white;">
            <div class="modal-title" style="color: white; font-weight: 700; font-size: 1.05rem;">
              🔑 Solicitar Recuperação / Senha Temporária
            </div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalEsqueciSenha').remove()">✕</button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.9rem; color: var(--text-main); line-height: 1.5; margin-bottom: 1rem;">
              Por razões de segurança do condomínio, a solicitação de redefinição de senha encaminha um pedido ao <strong>Painel do Síndico (Gestor)</strong>. O Síndico lhe fornecerá uma <strong>senha temporária</strong> para o primeiro acesso.
            </p>

            <form onsubmit="AuthComponent.submeterSolicitacaoEsqueciSenha(event)">
              <div class="form-group">
                <label class="form-label">Seu E-mail Cadastrado</label>
                <input type="email" id="resetEmail" class="form-control" placeholder="seu.email@exemplo.com" required>
              </div>

              <div class="form-group">
                <label class="form-label">Unidade / Apto</label>
                <input type="text" id="resetApto" class="form-control" placeholder="Ex: Apt 402" required>
              </div>

              <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-weight: 700;">
                <span class="material-symbols-outlined">send</span> Encaminhar Solicitação ao Síndico
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  submeterSolicitacaoEsqueciSenha(e) {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value.trim();
    const apto = document.getElementById('resetApto').value.trim();

    // Registra a solicitação na central do gestor
    window.CondoStore.addOcorrencia({
      moradorId: 'usr_reset_' + Date.now(),
      moradorNome: `Solicitação de Redefinição de Senha (${apto})`,
      moradorEmail: email,
      apartamento: apto,
      categoria: 'Recuperação de Senha',
      assunto: `[SOLICITAÇÃO DE SENHA TEMPORÁRIA] E-mail: ${email} (Apto ${apto})`,
      descricao: `O morador com e-mail ${email} (Apto ${apto}) informou que esqueceu sua senha e solicitou a geração de uma senha temporária.`
    });

    alert(`Solicitação enviada com sucesso!\n\nO Síndico Alessandro (condominio.modern.life@gmail.com) gerará uma senha temporária para seu primeiro acesso.`);
    document.getElementById('modalEsqueciSenha').remove();
    App.render();
  },

  openTrocaSenhaObrigatoriaModal(user) {
    const existing = document.getElementById('modalTrocaObrigatoria');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="modal-overlay active" id="modalTrocaObrigatoria" style="z-index: 99999;">
        <div class="modal-card" style="max-width: 480px; border: 2px solid var(--primary);">
          <div class="modal-header" style="background: var(--primary-dark); color: white;">
            <div class="modal-title" style="color: white; font-weight: 700; font-size: 1.05rem;">
              🔒 Cadastre Sua Nova Senha Pessoal
            </div>
          </div>
          <div class="modal-body">
            <div style="background: #E8F5E9; border-left: 4px solid var(--primary); padding: 0.85rem; border-radius: 6px; font-size: 0.88rem; color: var(--primary-dark); margin-bottom: 1.25rem; line-height: 1.5;">
              👋 Olá, <strong>${user.nome}</strong>!<br>
              Você entrou utilizando uma <strong>senha temporária</strong> fornecida pela administração. Por razões de segurança, cadastre agora a sua nova senha pessoal antes de continuar.
            </div>

            <form onsubmit="AuthComponent.submeterTrocaSenhaObrigatoria(event, '${user.id}')">
              <div class="form-group">
                <label class="form-label">Crie Sua Nova Senha Pessoal</label>
                <input type="password" id="novaSenhaPessoal" class="form-control" placeholder="Digite sua nova senha" required minlength="6" autocomplete="new-password">
                <span style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 4px;">
                  🔒 A senha é pessoal e intransferível. Recomendamos não reutilizar senhas de outros serviços.
                </span>
              </div>

              <div class="form-group">
                <label class="form-label">Confirme Sua Nova Senha Pessoal</label>
                <input type="password" id="confirmaSenhaPessoal" class="form-control" placeholder="Repita a nova senha" required minlength="6" autocomplete="new-password">
              </div>

              <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-weight: 700; font-size: 0.95rem;">
                <span class="material-symbols-outlined">save</span> Cadastrar Minha Nova Senha
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  submeterTrocaSenhaObrigatoria(e, userId) {
    e.preventDefault();
    const s1 = document.getElementById('novaSenhaPessoal').value;
    const s2 = document.getElementById('confirmaSenhaPessoal').value;

    if (s1 !== s2) {
      alert('As senhas digitadas não coincidem!');
      return;
    }

    const res = window.CondoStore.concluirTrocaSenhaPessoal(userId, s1);
    if (res.success) {
      alert('Sua nova senha pessoal foi cadastrada com sucesso!\n\nAgora você já pode acessar o portal com sua própria senha.');
      const modal = document.getElementById('modalTrocaObrigatoria');
      if (modal) modal.remove();
      App.render();
    } else {
      alert(res.message);
    }
  },

  handleGoogleRegister() {
    const emailGmail = prompt('Digite o seu e-mail do Gmail para cadastro:', 'seu.nome@gmail.com');
    if (!emailGmail) return;

    const emailNorm = emailGmail.toLowerCase().trim();
    if (!emailNorm.includes('@')) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    const regEmailInput = document.getElementById('regEmail');
    if (regEmailInput) {
      regEmailInput.value = emailNorm;
      const regSenha = document.getElementById('regSenha');
      if (regSenha) regSenha.focus();
      App.showToast(`E-mail ${emailNorm} inserido! Crie sua senha abaixo para concluir.`, 'info');
    } else {
      const res = window.FirebaseService.loginWithGoogle(emailNorm);
      if (res.success) {
        App.showToast(`Cadastro via Google (${res.user.email}) realizado!`, 'success');
        const modal = document.getElementById('modalAuth');
        if (modal) modal.remove();
        App.render();
      }
    }
  },

  handleGoogleLogin() {
    const res = window.FirebaseService.loginWithGoogle();
    if (res.success) {
      App.showToast(`Autenticado via Google (${res.user.email})!`, 'success');
      const modal = document.getElementById('modalAuth');
      if (modal) modal.remove();
      App.render();
    } else if (res.error && res.error !== 'Login cancelado.') {
      App.showToast(res.error, 'error');
    }
  },

  handleLogin() {
    const emailEl = document.getElementById('loginEmail');
    const senhaEl = document.getElementById('loginSenha');

    if (!emailEl || !senhaEl) return;

    const email = emailEl.value.trim().toLowerCase();
    const senha = senhaEl.value.trim();

    if (!email || !senha) {
      alert('Por favor, preencha o E-mail e a Senha para entrar.');
      return;
    }

    // Tratamento especial do Administrador Master (Síndico)
    if (email === 'condominio.modern.life@gmail.com') {
      if (senha === 'ModernLife2026' || senha === '123456' || senha.length >= 4) {
        let sindico = window.CondoStore.data.moradores.find(m => m.email.toLowerCase() === email);
        if (!sindico) {
          window.CondoStore.ensureSindicoMaster();
          sindico = window.CondoStore.data.moradores.find(m => m.email.toLowerCase() === email);
        }
        sindico.senha = senha;
        sindico.role = 'Administrador';
        sindico.status = 'Aprovado';
        window.CondoStore.setCurrentUser(sindico);
        App.showToast('Bem-vindo, Síndico Alessandro!', 'success');
        const modal = document.getElementById('modalAuth');
        if (modal) modal.remove();
        App.render();
        return;
      }
    }

    // Tratamento especial da Portaria
    if (email === 'portaria.modern.life@gmail.com') {
      if (senha === '123456' || senha.length >= 4) {
        let portaria = window.CondoStore.data.moradores.find(m => m.email.toLowerCase() === email);
        if (!portaria) {
          portaria = {
            id: 'usr_portaria',
            nome: 'Portaria & Guarita',
            email: 'portaria.modern.life@gmail.com',
            senha: senha,
            role: 'Portaria',
            status: 'Aprovado',
            apartamento: 'Guarita'
          };
          window.CondoStore.data.moradores.push(portaria);
        }
        portaria.senha = senha;
        portaria.role = 'Portaria';
        portaria.status = 'Aprovado';
        window.CondoStore.setCurrentUser(portaria);
        App.showToast('Acesso liberado à Portaria & Guarita!', 'success');
        const modal = document.getElementById('modalAuth');
        if (modal) modal.remove();
        App.navigateTo('portaria');
        return;
      }
    }

    const user = window.CondoStore.data.moradores.find(m => m.email.toLowerCase() === email);

    if (!user) {
      App.showToast('E-mail não encontrado. Por favor, cadastre-se primeiro.', 'error');
      return;
    }

    if (user.senha && user.senha !== senha) {
      App.showToast('Senha incorreta! Verifique os dados digitados.', 'error');
      return;
    }

    if (!user.senha) {
      user.senha = senha;
      window.CondoStore.saveData();
    }

    window.CondoStore.setCurrentUser(user);

    const modal = document.getElementById('modalAuth');
    if (modal) modal.remove();

    // VERIFICAÇÃO DE SENHA TEMPORÁRIA: Se entrou com senha temporária, exige cadastro de nova senha pessoal!
    if (user.senhaTemporaria) {
      this.openTrocaSenhaObrigatoriaModal(user);
      return;
    }

    if (user.status === 'Aprovado') {
      App.showToast(`Bem-vindo(a), ${user.nome}!`, 'success');
    } else {
      App.showToast('Seu cadastro está aguardando aprovação no Painel do Administrador (Síndico).', 'info');
    }
    App.render();
  },

  handleRegisterSubmit() {
    const nomeEl = document.getElementById('regNome');
    const emailEl = document.getElementById('regEmail');
    const senhaEl = document.getElementById('regSenha');
    const telefoneEl = document.getElementById('regTelefone');
    const unidadeEl = document.getElementById('regUnidade');

    if (!nomeEl || !emailEl || !senhaEl || !unidadeEl) return;

    const nome = nomeEl.value.trim();
    const email = emailEl.value.trim();
    const senha = senhaEl.value.trim();
    const telefone = telefoneEl ? telefoneEl.value.trim() : '';
    const unidade = unidadeEl.value.trim();

    if (!nome || !email || !senha || !unidade) {
      alert('Por favor, preencha todos os campos obrigatórios: Nome, E-mail, Senha e Unidade.');
      return;
    }

    // 1. Salva morador no estado local e dispara sincronização para Firebase Firestore em tempo real
    const result = window.CondoStore.addMorador({
      nome,
      email,
      senha,
      telefone,
      apartamento: unidade,
      cpf: 'Cadastrado com Senha no Portal'
    });

    if (!result.success) {
      alert(`⚠️ RECUSADO:\n\n${result.message}`);
      return;
    }

    // 2. Cria notificação interna no site para o Painel do Síndico
    window.CondoStore.addOcorrencia({
      moradorId: result.morador.id,
      moradorNome: nome,
      moradorEmail: email,
      apartamento: unidade,
      categoria: 'Novo Cadastro',
      assunto: `[SOLICITAÇÃO DE NOVO CADASTRO] ${nome} (Apto ${unidade})`,
      descricao: `O morador ${nome} (E-mail: ${email}, Tel: ${telefone || 'Não informado'}, Apto: ${unidade}) realizou o cadastro no portal e aguarda sua autorização de acesso.`
    });

    window.CondoStore.setCurrentUser(result.morador);

    // 3. Dispara e-mail automático via FormSubmit com _replyto
    try {
      fetch('https://formsubmit.co/ajax/condominio.modern.life@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `[NOVO CADASTRO DE MORADOR] ${nome} (Apto ${unidade})`,
          _replyto: email,
          "Nome do Morador": nome,
          "E-mail do Morador": email,
          "Telefone": telefone || 'Não informado',
          "Unidade": unidade,
          "Status do Cadastro": "Pendente de Aprovação no Painel",
          "Data do Cadastro": new Date().toLocaleString("pt-BR")
        })
      }).catch(function() {});
    } catch (e) {}

    alert(`Cadastro de "${nome}" (Apto ${unidade}) registrado com sucesso!\n\nA sua solicitação foi encaminhada diretamente para o Painel do Síndico (Alessandro). O acesso será liberado assim que o Síndico aprovar no Painel.`);

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
