/* ----------------------------------------------------
   Modern Life Residence - Canal Direto com a Administração
   Sigilo & Privacidade: Acesso exclusivo para moradores autorizados
   ---------------------------------------------------- */

window.CanalComponent = {
  render(container, data) {
    const user = window.CondoStore.currentUser;

    // Access Gate for non-approved visitors
    if (!user || user.status !== 'Aprovado') {
      container.innerHTML = `
        <div class="card-widget" style="text-align: center; padding: 3.5rem 1.5rem; max-width: 600px; margin: 2rem auto;">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 1.25rem auto;">
            <span class="material-symbols-outlined" style="font-size: 2.8rem;">lock</span>
          </div>
          <h2 style="font-family: var(--font-heading); color: var(--primary-dark); font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem;">
            Acesso Restrito: Canal Direto com a Administração
          </h2>
          <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 1.5rem; line-height: 1.6;">
            O envio de mensagens diretas à gestão e ao Síndico Alessandro Cristiano da Silva é um recurso exclusivo para moradores cadastrados e autorizados.
          </p>
          <button class="btn-primary" onclick="AuthComponent.renderAuthModal()" style="padding: 0.8rem 1.5rem; font-size: 0.95rem;">
            <span class="material-symbols-outlined">login</span> Entrar / Cadastrar para Liberar Acesso
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- Header Banner -->
        <div class="card-widget" style="background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%); color: white;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h2 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700;">
                Canal Direto de Comunicação com a Administração
              </h2>
              <p style="font-size: 0.9rem; opacity: 0.9;">
                Envie e-mails diretos para o e-mail oficial do condomínio: <code>condominio.modern.life@gmail.com</code>
              </p>
            </div>
            <span class="badge" style="background: rgba(255,255,255,0.2); color: white; padding: 0.5rem 0.85rem;">
              <span class="material-symbols-outlined" style="font-size: 0.85rem;">verified_user</span> Acesso Autorizado
            </span>
          </div>
        </div>

        <!-- Form Card -->
        <div class="card-widget">
          <div class="card-header">
            <div class="card-title">
              <span class="material-symbols-outlined">mail</span> Formular Mensagem ao Síndico
            </div>
          </div>

          <form onsubmit="CanalComponent.enviarMensagem(event)">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nome do Morador</label>
                <input type="text" id="canalNome" class="form-control" value="${user.nome}" readonly style="background: var(--bg-app);">
              </div>

              <div class="form-group">
                <label class="form-label">Unidade / Apto</label>
                <input type="text" id="canalApto" class="form-control" value="Apto ${user.apartamento}" readonly style="background: var(--bg-app);">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Assunto</label>
              <input type="text" id="canalAssunto" class="form-control" placeholder="Ex: Solicitação de Manutenção / Dúvida sobre Convenção" required>
            </div>

            <div class="form-group">
              <label class="form-label">Mensagem Detalhada</label>
              <textarea id="canalMensagem" class="form-control" rows="6" placeholder="Escreva aqui sua mensagem para a administração..." required></textarea>
            </div>

            <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-size: 0.95rem;">
              <span class="material-symbols-outlined">send</span> Enviar E-mail para condominio.modern.life@gmail.com
            </button>
          </form>
        </div>

      </div>
    `;
  },

  enviarMensagem(e) {
    e.preventDefault();
    const user = window.CondoStore.currentUser;
    const assunto = document.getElementById('canalAssunto').value.trim();
    const mensagem = document.getElementById('canalMensagem').value.trim();

    const subject = encodeURIComponent(`[CANAL DIRETO] ${assunto} - Apto ${user.apartamento}`);
    const body = encodeURIComponent(`Morador: ${user.nome}\nUnidade: Apto ${user.apartamento}\nE-mail: ${user.email}\nTelefone: ${user.telefone || 'Não informado'}\n\nMensagem:\n${mensagem}`);

    window.open(`mailto:condominio.modern.life@gmail.com?subject=${subject}&body=${body}`, '_blank');
    App.showToast('Cliente de e-mail aberto! Mensagem pronta para envio.', 'success');
  }
};
