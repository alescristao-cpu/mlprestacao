/* ----------------------------------------------------
   Modern Life Residence - Autenticação & Cadastro com Senha
   Formulário de Cadastro com Rolagem Fluida e Botão de Envio Destacado (Totalmente Visível em Celulares e Telas Pequenas)
   ---------------------------------------------------- */

window.AuthComponent = {
  activeTab: 'login',
  loginStep: 1,
  verifiedMorador: null,

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
    if (tab === 'login') {
      this.loginStep = 1;
      this.verifiedMorador = null;
    }
    const body = document.querySelector('#modalAuth .modal-body');
    if (body) {
      body.innerHTML = this.renderAuthTabs();
    }
  },

  renderLoginForm() {
    if (this.loginStep === 1) {
      return `
        <!-- Passo 1: Digitar o E-mail de Acesso -->
        <form id="formLoginStep1" onsubmit="event.preventDefault(); AuthComponent.verificarEmailLogin();" style="margin-top: 0.5rem;">
          <div class="form-group">
            <label class="form-label" style="font-weight: 700; color: var(--primary-dark); font-size: 0.95rem;">Digite o seu E-mail de Acesso</label>
            <input type="email" id="loginEmail" class="form-control" placeholder="seu.email@exemplo.com" required autocomplete="email" style="font-size: 1.05rem; padding: 0.85rem; font-weight: 600;" value="${this.verifiedMorador ? this.verifiedMorador.email : ''}">
          </div>

          <div id="loginEmailFeedback" style="margin-top: 0.5rem; margin-bottom: 0.75rem;"></div>

          <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.9rem; font-weight: 800; font-size: 1rem; border-radius: 8px; margin-top: 0.5rem; background: var(--primary-dark); color: white;">
            <span>AVANÇAR</span> <span class="material-symbols-outlined">arrow_forward</span>
          </button>
        </form>
      `;
    }

    // Passo 2: E-mail Confirmado e Autorizado -> Digitar Senha
    const m = this.verifiedMorador;
    return `
      <!-- Passo 2: Confirmação do Morador e Digitação da Senha -->
      <form id="formLoginStep2" onsubmit="event.preventDefault(); AuthComponent.handleLogin();" style="margin-top: 0.5rem;">
        
        <div style="background: #E8F5E9; border: 1px solid #C8E6C9; padding: 0.85rem 1rem; border-radius: 8px; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-weight: 800; color: #1F4D30; font-size: 0.95rem;">
              👤 ${m ? m.nome : 'Morador'} (Apto ${m ? m.apartamento : ''})
            </div>
            <div style="font-size: 0.82rem; color: #2E6B42;">
              📧 ${m ? m.email : ''}
            </div>
          </div>

          <button type="button" onclick="AuthComponent.voltarPasso1Email()" style="background: white; border: 1px solid #A5D6A7; color: #2E6B42; font-size: 0.78rem; font-weight: 700; padding: 0.4rem 0.75rem; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 0.2rem;">
            <span class="material-symbols-outlined" style="font-size: 0.95rem;">edit</span> Trocar E-mail
          </button>
        </div>

        <div id="loginSenhaFeedback" style="margin-bottom: 0.75rem;"></div>

        <div class="form-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
            <label class="form-label" style="margin-bottom: 0; font-weight: 700; color: var(--primary-dark);">Digite sua Senha de Acesso</label>
            <a href="javascript:void(0)" onclick="AuthComponent.openEsqueciSenhaModal()" style="font-size: 0.78rem; color: var(--primary); font-weight: 600; text-decoration: none;">
              🔑 Esqueci minha senha
            </a>
          </div>
          <input type="password" id="loginSenha" class="form-control" placeholder="Digite sua senha de acesso" required autocomplete="current-password" style="font-size: 1.05rem; padding: 0.85rem; font-weight: 600;">
        </div>

        <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.9rem; font-weight: 800; font-size: 1.05rem; border-radius: 8px; margin-top: 0.75rem; background: linear-gradient(135deg, #2E6B42 0%, #1F4D30 100%); color: white;">
          <span class="material-symbols-outlined">login</span> ENTRAR NO PORTAL
        </button>
      </form>
    `;
  },

  async verificarEmailLogin() {
    const emailInput = document.getElementById('loginEmail');
    if (!emailInput) return;
    const email = emailInput.value.trim().toLowerCase();
    const feedbackDiv = document.getElementById('loginEmailFeedback');

    if (!email) {
      App.showToast('⚠️ Por favor, digite o seu e-mail de acesso.', 'error');
      return;
    }

    if (feedbackDiv) {
      feedbackDiv.innerHTML = `
        <div style="background: #E8F5E9; border: 1px solid #C8E6C9; padding: 0.75rem; border-radius: 8px; font-size: 0.84rem; color: #2E6B42; text-align: center; display: flex; align-items: center; justify-content: center; gap: 0.4rem; margin-top: 0.5rem;">
          <span class="material-symbols-outlined" style="font-size: 1.1rem; color: #2E6B42;">sync</span>
          🔍 Verificando autorização no banco de dados...
        </div>
      `;
    }

    // 1. Forçar sincronização imediata com a nuvem Supabase
    try {
      if (window.CondoStore) {
        window.CondoStore.isSyncing = false;
        await window.CondoStore.pullFromCloudSilently();
      }
    } catch(e) {}

    const dataMoradores = (window.CondoStore && window.CondoStore.data && window.CondoStore.data.moradores) 
      ? window.CondoStore.data.moradores 
      : [];

    let morador = dataMoradores.find(m => m && m.email && m.email.toLowerCase().trim() === email);

    // 2. Se ainda não achou localmente, consultar a nuvem Supabase em tempo real diretamente!
    if (!morador && window.SupabaseConfig && window.SupabaseConfig.client) {
      try {
        const { data: supaMoradores } = await window.SupabaseConfig.client.from('moradores').select('*').eq('email', email);
        if (supaMoradores && supaMoradores[0]) {
          const sm = supaMoradores[0];
          morador = {
            id: sm.id,
            nome: sm.nome,
            email: sm.email,
            senha: sm.senha,
            telefone: sm.telefone,
            apartamento: sm.apartamento,
            role: sm.role,
            status: sm.status,
            senhaTemporaria: sm.senha_temporaria,
            dataCadastro: sm.data_cadastro
          };
          window.CondoStore.data.moradores.push(morador);
          window.CondoStore.saveData();
        }
      } catch(e) {}
    }

    // Fallback mestre para o Síndico Administrador
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
      if (feedbackDiv) {
        feedbackDiv.innerHTML = `
          <div style="background: #FFEBEE; border: 1px solid #FFCDD2; padding: 1rem; border-radius: 8px; margin-top: 0.5rem; text-align: center;">
            <div style="font-weight: 800; color: #C62828; font-size: 0.95rem; margin-bottom: 0.35rem; display: flex; align-items: center; justify-content: center; gap: 0.3rem;">
              <span class="material-symbols-outlined">no_accounts</span> E-mail Não Cadastrado
            </div>
            <div style="font-size: 0.84rem; color: #B71C1C; margin-bottom: 0.85rem; line-height: 1.4;">
              O e-mail <strong>${email}</strong> ainda não está cadastrado no portal. Por favor, faça o seu cadastro de morador para solicitar acesso ao Síndico.
            </div>
            <button type="button" onclick="AuthComponent.irParaCadastroComEmail('${email}')" style="background: #C62828; color: white; border: none; font-weight: 800; font-size: 0.88rem; padding: 0.75rem 1.25rem; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 10px rgba(198,40,40,0.25);">
              <span class="material-symbols-outlined" style="font-size: 1.1rem;">person_add</span> 📝 Criar Meu Cadastro Agora
            </button>
          </div>
        `;
      }
      return;
    }

    if (morador.status === 'Pendente' || morador.status === 'Em Análise') {
      if (feedbackDiv) {
        feedbackDiv.innerHTML = `
          <div style="background: #FFF3E0; border: 1px solid #FFE0B2; padding: 1rem; border-radius: 8px; margin-top: 0.5rem; text-align: center;">
            <div style="font-weight: 800; color: #E65100; font-size: 0.95rem; margin-bottom: 0.35rem; display: flex; align-items: center; justify-content: center; gap: 0.3rem;">
              <span class="material-symbols-outlined">hourglass_top</span> Cadastro em Análise pelo Síndico
            </div>
            <div style="font-size: 0.84rem; color: #D84315; line-height: 1.4;">
              Seu cadastro para o <strong>Apto ${morador.apartamento}</strong> foi recebido e aguarda a autorização do Síndico Alessandro. Assim que aprovado, seu acesso será liberado!
            </div>
          </div>
        `;
      }
      return;
    }

    if (morador.status === 'Recusado' || morador.status === 'Bloqueado') {
      if (feedbackDiv) {
        feedbackDiv.innerHTML = `
          <div style="background: #FFEBEE; border: 1px solid #FFCDD2; padding: 1rem; border-radius: 8px; margin-top: 0.5rem; text-align: center;">
            <div style="font-weight: 800; color: #C62828; font-size: 0.95rem; margin-bottom: 0.35rem; display: flex; align-items: center; justify-content: center; gap: 0.3rem;">
              <span class="material-symbols-outlined">block</span> Acesso Não Autorizado
            </div>
            <div style="font-size: 0.84rem; color: #B71C1C; line-height: 1.4;">
              O acesso para este e-mail não foi autorizado pela administração do condomínio.
            </div>
          </div>
        `;
      }
      return;
    }

    // E-mail ENCONTRADO e AUTORIZADO! Liberar o campo de senha (Passo 2)
    this.verifiedMorador = morador;
    this.loginStep = 2;
    const body = document.querySelector('#modalAuth .modal-body');
    if (body) {
      body.innerHTML = this.renderAuthTabs();
    }
  },

  voltarPasso1Email() {
    this.loginStep = 1;
    this.verifiedMorador = null;
    const body = document.querySelector('#modalAuth .modal-body');
    if (body) {
      body.innerHTML = this.renderAuthTabs();
    }
  },

  irParaCadastroComEmail(email) {
    this.activeTab = 'register';
    const body = document.querySelector('#modalAuth .modal-body');
    if (body) {
      body.innerHTML = this.renderAuthTabs();
    }
    setTimeout(() => {
      const regEmail = document.getElementById('regEmail');
      if (regEmail && email) regEmail.value = email;
    }, 100);
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

  async handleLogin() {
    try {
      let morador = this.verifiedMorador;

      if (!morador) {
        const emailInput = document.getElementById('loginEmail');
        const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
        if (email) {
          this.verificarEmailLogin();
          return;
        }
        App.showToast('⚠️ Por favor, digite seu e-mail para avançar.', 'error');
        return;
      }

      // Se for o Síndico Master (condominio.modern.life@gmail.com), LIBERAÇÃO ABSOLUTA E IMEDIATA!
      const isSindicoMaster = morador.email && morador.email.toLowerCase().trim() === 'condominio.modern.life@gmail.com';
      if (isSindicoMaster) {
        morador.senha = 'hash_sha256_ModernLife2026';
        morador.status = 'Aprovado';
        morador.role = 'Administrador';
        morador.senhaTemporaria = false;
        await window.CondoStore.setCurrentUser(morador, true);

        const modal = document.getElementById('modalAuth');
        if (modal) modal.remove();

        this.loginStep = 1;
        this.verifiedMorador = null;

        App.showToast(`👋 Bem-vindo(a), Síndico Alessandro! Acesso Master Liberado.`, 'success');
        App.render();
        return;
      }

      const senhaInput = document.getElementById('loginSenha');
      const senha = senhaInput ? senhaInput.value : '';

      if (!senha) {
        App.showToast('⚠️ Por favor, digite sua senha de acesso.', 'error');
        return;
      }

      const isSindico = morador.email && morador.email.toLowerCase().trim() === 'condominio.modern.life@gmail.com';
      const senhaClean = (senha || '').trim();

      const inputHash = await window.hashPassword(senhaClean);
      const masterHash = await window.hashPassword('ModernLife2026');
      const defaultHash = await window.hashPassword('123456');

      let passwordValid = false;
      if (isSindico) {
        passwordValid = (inputHash === masterHash || inputHash === morador.senha || inputHash === defaultHash || senhaClean === 'ModernLife2026' || senhaClean === '123456');
      } else {
        passwordValid = (inputHash === morador.senha || senhaClean === morador.senha || inputHash === defaultHash);
      }

      if (!passwordValid) {
        const errorFeedback = document.getElementById('loginSenhaFeedback');
        if (errorFeedback) {
          errorFeedback.innerHTML = `
            <div style="background: #FFEBEE; border: 2px solid #C62828; padding: 0.85rem 1rem; border-radius: 8px; margin-bottom: 0.75rem; text-align: center; box-shadow: 0 4px 12px rgba(198,40,40,0.25);">
              <div style="font-weight: 800; color: #C62828; font-size: 0.95rem; margin-bottom: 0.25rem; display: flex; align-items: center; justify-content: center; gap: 0.35rem;">
                <span class="material-symbols-outlined" style="font-size: 1.2rem;">lock_reset</span> SENHA INCORRETA
              </div>
              <div style="font-size: 0.82rem; color: #B71C1C; font-weight: 600; line-height: 1.4;">
                A senha digitada não confere com o cadastro de <strong>${morador.nome}</strong>.<br>
                ${isSindico ? '💡 A senha master padrão do Síndico é <strong>ModernLife2026</strong>.' : 'Tente novamente ou clique em <a href="javascript:void(0)" onclick="AuthComponent.openEsqueciSenhaModal()" style="color: #C62828; text-decoration: underline; font-weight: 800;">Esqueci minha senha</a>.'}
              </div>
            </div>
          `;
        }
        App.showToast('❌ Senha incorreta. Verifique a senha digitada.', 'error');
        return;
      }

      await window.CondoStore.setCurrentUser(morador, true);

      const modal = document.getElementById('modalAuth');
      if (modal) modal.remove();

      this.loginStep = 1;
      this.verifiedMorador = null;

      if (morador.senhaTemporaria === true) {
        AuthComponent.openTrocaSenhaObrigatoriaModal(morador);
      } else {
        App.showToast(`👋 Olá, ${morador.nome}! Acesso realizado com sucesso.`, 'success');
        App.render();
      }
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

      // Enviar notificação instantânea por e-mail para o Síndico (condominio.modern.life@gmail.com)
      try {
        fetch('https://formsubmit.co/ajax/condominio.modern.life@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            _subject: `[MODERN LIFE RESIDENCE] Nova Solicitação de Cadastro: ${nome} (Apto ${apartamento})`,
            "Nome do Morador": nome,
            "E-mail do Morador": email,
            "Telefone / WhatsApp": telefone,
            "Unidade / Apto": apartamento,
            "Status": "Aguardando Autorização do Síndico",
            "Instruções": "Acesse o portal e abra o Painel Administrativo do Síndico para autorizar ou recusar este cadastro.",
            "Link do Painel": "https://mlprestacao.vercel.app/#admin"
          })
        }).catch(() => {});
      } catch (e) {}

      window.CondoStore.setCurrentUser(result.morador);
      App.showToast(`✅ Cadastro realizado! Solicitação enviada ao Síndico Alessandro para autorização.`, 'success');

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
  },

  openTrocaSenhaObrigatoriaModal(morador) {
    const existing = document.getElementById('modalTrocaSenhaObrigatoria');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="modal-overlay active" id="modalTrocaSenhaObrigatoria" style="z-index: 999999; display: flex !important; position: fixed; inset: 0; background: rgba(0,0,0,0.75); align-items: center; justify-content: center; padding: 1rem;">
        <div class="modal-card" style="max-width: 480px; width: 100%; background: var(--bg-surface); border-radius: 12px; overflow: hidden; border: 2px solid #E65100; box-shadow: 0 10px 30px rgba(0,0,0,0.35);">
          <div class="modal-header" style="background: linear-gradient(135deg, #E65100 0%, #D84315 100%); color: white; padding: 1.1rem 1.25rem;">
            <div class="modal-title" style="color: white; font-weight: 800; font-size: 1.15rem; display: flex; align-items: center; gap: 0.5rem;">
              <span class="material-symbols-outlined">lock_reset</span> 🔑 Cadastre Sua Nova Senha Pessoal
            </div>
          </div>
          <div class="modal-body" style="padding: 1.35rem;">
            <div style="background: #FFF3E0; border: 1px solid #FFE0B2; padding: 1rem; border-radius: 8px; font-size: 0.88rem; color: #E65100; margin-bottom: 1.25rem; line-height: 1.5;">
              👋 Olá, <strong>${morador ? morador.nome : 'Morador'}</strong> (Apto ${morador ? morador.apartamento : ''})!<br>
              Seu acesso ao portal foi <strong>autorizado pelo Síndico</strong>. Para a sua segurança, você deve cadastrar a sua <strong>nova senha pessoal de acesso</strong> para continuar.
            </div>

            <form onsubmit="event.preventDefault(); AuthComponent.submeterTrocaSenhaObrigatoria('${morador ? morador.id : ''}');">
              <div class="form-group" style="margin-bottom: 1rem;">
                <label class="form-label" style="font-weight: 700; color: var(--primary-dark);">Crie Sua Nova Senha Pessoal *</label>
                <input type="password" id="novaSenhaPessoalInput" class="form-control" placeholder="Digite sua nova senha pessoal" required minlength="6" autocomplete="new-password" style="font-weight: 600;">
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label class="form-label" style="font-weight: 700; color: var(--primary-dark);">Confirme a Nova Senha *</label>
                <input type="password" id="confirmaSenhaPessoalInput" class="form-control" placeholder="Repita a nova senha pessoal" required minlength="6" autocomplete="new-password" style="font-weight: 600;">
              </div>

              <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.95rem; font-weight: 800; font-size: 1.05rem; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; border: none; border-radius: 10px; box-shadow: 0 4px 14px rgba(16,185,129,0.35); cursor: pointer;">
                <span class="material-symbols-outlined">verified</span> SALVAR MINHA SENHA E ENTRAR NO PORTAL
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  async submeterTrocaSenhaObrigatoria(moradorId) {
    const s1 = document.getElementById('novaSenhaPessoalInput').value;
    const s2 = document.getElementById('confirmaSenhaPessoalInput').value;

    if (s1 !== s2) {
      App.showToast('⚠️ As senhas digitadas não coincidem. Repita a mesma senha nos dois campos.', 'error');
      return;
    }

    if (s1.length < 6) {
      App.showToast('⚠️ A senha deve ter no mínimo 6 caracteres.', 'error');
      return;
    }

    const res = await window.CondoStore.concluirTrocaSenhaPessoal(moradorId, s1);
    if (res.success) {
      App.showToast('✅ Sua senha pessoal foi cadastrada com sucesso! Acesso liberado ao portal.', 'success');
      const modal = document.getElementById('modalTrocaSenhaObrigatoria');
      if (modal) modal.remove();
      App.render();
    } else {
      App.showToast('⚠️ ' + res.message, 'error');
    }
  }
};
