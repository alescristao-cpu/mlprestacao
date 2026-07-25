/* ----------------------------------------------------
   Modern Life Residence - Canal Direto com o Síndico
   ---------------------------------------------------- */

window.CanalComponent = {
  render(container, data) {
    const user = window.CondoStore.currentUser || {};

    container.innerHTML = `
      <div class="card-widget" style="max-width: 720px; margin: 0 auto;">
        <div class="card-header">
          <div>
            <div class="card-title">
              <span class="material-symbols-outlined">mark_email_unread</span> Canal Direto com a Administração
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
              Envie uma mensagem direta para o e-mail oficial do condomínio (<code>condominio.modern.life@gmail.com</code>).
            </p>
          </div>
        </div>

        <form onsubmit="CanalComponent.sendMessage(event)">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Seu Nome Completo</label>
              <input type="text" class="form-control" id="canalNome" value="${user.nome || ''}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Apartamento / Bloco</label>
              <input type="text" class="form-control" id="canalApto" value="Apto ${user.apartamento || ''} - Bloco ${user.bloco || 'A'}" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Assunto do E-mail</label>
            <input type="text" class="form-control" id="canalAssunto" placeholder="Ex: Solicitação de reunião / Dúvida sobre cota condominial" required>
          </div>

          <div class="form-group">
            <label class="form-label">Mensagem Detalhada</label>
            <textarea class="form-control" id="canalMensagem" rows="6" placeholder="Escreva aqui sua mensagem..." required></textarea>
          </div>

          <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-size: 0.95rem;">
            <span class="material-symbols-outlined">send</span> Enviar E-mail Direto para condominio.modern.life@gmail.com
          </button>
        </form>
      </div>
    `;
  },

  sendMessage(e) {
    e.preventDefault();
    const nome = document.getElementById('canalNome').value;
    const apto = document.getElementById('canalApto').value;
    const assunto = document.getElementById('canalAssunto').value;
    const msg = document.getElementById('canalMensagem').value;

    const emailBody = encodeURIComponent(`Nome: ${nome}\nUnidade: ${apto}\n\nMensagem:\n${msg}`);
    const mailtoUrl = `mailto:condominio.modern.life@gmail.com?subject=${encodeURIComponent(assunto)}&body=${emailBody}`;

    window.open(mailtoUrl, '_blank');

    App.showToast('Redirecionando para envio direto ao e-mail oficial (condominio.modern.life@gmail.com)...', 'success');
    App.navigateTo('dashboard');
  }
};
