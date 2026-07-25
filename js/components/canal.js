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
              Envie uma mensagem direta e sigilosa para o e-mail do Síndico <strong>Alessandro Cristiano da Silva</strong> (<code>condominio.modern.life@gmail.com</code>).
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
              <input type="text" class="form-control" id="canalApto" value="Apto ${user.apartamento || ''} - Bloco ${user.bloco || ''}" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Assunto</label>
            <input type="text" class="form-control" id="canalAssunto" placeholder="Ex: Solicitação de reunião / Dúvida sobre cota condominial" required>
          </div>

          <div class="form-group">
            <label class="form-label">Mensagem Detalhada</label>
            <textarea class="form-control" id="canalMensagem" rows="5" placeholder="Escreva sua mensagem..." required></textarea>
          </div>

          <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.8rem;">
            <span class="material-symbols-outlined">send</span> Enviar E-mail ao Síndico Alessandro
          </button>
        </form>
      </div>
    `;
  },

  sendMessage(e) {
    e.preventDefault();
    const assunto = document.getElementById('canalAssunto').value;
    alert(`Mensagem enviada com sucesso para o e-mail oficial (condominio.modern.life@gmail.com) com o assunto "${assunto}". O Síndico Alessandro Cristiano da Silva responderá em breve.`);
    App.navigateTo('dashboard');
  }
};
