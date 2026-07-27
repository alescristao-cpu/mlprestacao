/* ----------------------------------------------------
   Modern Life Residence - Canal Direto com a Administração
   Postagem Direta no Site e Encaminhamento ao Painel do Síndico
   ---------------------------------------------------- */

window.CanalComponent = {
  render(container, data) {
    const user = window.CondoStore.currentUser;

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
            O envio de mensagens diretas à gestão do Síndico Alessandro Cristiano da Silva é um recurso exclusivo para moradores cadastrados e autorizados.
          </p>
          <button class="btn-primary" onclick="AuthComponent.renderAuthModal()" style="padding: 0.8rem 1.5rem; font-size: 0.95rem;">
            <span class="material-symbols-outlined">login</span> Entrar / Cadastrar para Liberar Acesso
          </button>
        </div>
      `;
      return;
    }

    const allMsgs = (data.ocorrencias || []).filter(o => o.categoria === 'Canal Direto');
    const isMasterAdmin = user.role === 'Administrador';

    // PRIVACIDADE: Síndico enxerga todas. Morador comum vê APENAS as mensagens da sua conta.
    const userMsgs = isMasterAdmin
      ? allMsgs
      : allMsgs.filter(m => (m.moradorEmail && m.moradorEmail.toLowerCase() === user.email.toLowerCase()) || m.moradorId === user.id);

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- Header Banner -->
        <div class="card-widget" style="background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%); color: white;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h2 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700;">
                Canal Direto de Comunicação com o Síndico
              </h2>
              <p style="font-size: 0.9rem; opacity: 0.9;">
                Envie suas dúvidas, solicitações ou comunicados diretamente para o Painel da Gestão.
              </p>
            </div>
            <span class="badge" style="background: rgba(255,255,255,0.2); color: white; padding: 0.5rem 0.85rem;">
              <span class="material-symbols-outlined" style="font-size: 0.85rem;">verified_user</span> Transmissão Direta no Site
            </span>
          </div>
        </div>

        <!-- Formulário de Postagem Direta no Site -->
        <div class="card-widget">
          <div class="card-header">
            <div class="card-title">
              <span class="material-symbols-outlined">mail</span> Formular Mensagem Direta ao Síndico
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
              <input type="text" id="canalAssunto" class="form-control" placeholder="Ex: Dúvida sobre Regimento Interno / Solicitação de Manutenção" required>
            </div>

            <div class="form-group">
              <label class="form-label">Mensagem Detalhada</label>
              <textarea id="canalMensagem" class="form-control" rows="5" placeholder="Escreva aqui sua mensagem direta para a gestão..." required></textarea>
            </div>

            <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-size: 0.95rem; font-weight: 700;">
              <span class="material-symbols-outlined">send</span> Enviar ao Painel do Síndico
            </button>
          </form>
        </div>

        <!-- Caixa de Mensagens Diretas Enviadas & Respostas do Síndico -->
        <div class="card-widget">
          <div class="card-header">
            <div class="card-title">
              <span class="material-symbols-outlined">inbox</span> ${isMasterAdmin ? 'Mensagens Recebidas no Canal Direto (Síndico Master)' : 'Minha Caixa de Mensagens &amp; Respostas do Síndico'}
            </div>
          </div>

          ${userMsgs.length === 0 ? `
            <div style="padding: 2rem 1rem; text-align: center; color: var(--text-muted);">
              <span class="material-symbols-outlined" style="font-size: 2.5rem; opacity: 0.4; display: block; margin-bottom: 0.4rem;">mail_lock</span>
              Nenhuma mensagem direta registrada até o momento.
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              ${userMsgs.map(m => `
                <div style="background: var(--bg-app); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1.1rem;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <div>
                      <h4 style="font-family: var(--font-heading); font-weight: 700; color: var(--primary-dark); font-size: 1.1rem;">
                        ${m.assunto}
                      </h4>
                      <div style="font-size: 0.78rem; color: var(--text-muted);">
                        Enviado em: ${m.data} &bull; De: <strong>${m.moradorNome} (Apto ${m.apartamento})</strong>
                      </div>
                    </div>

                    <span class="badge ${m.status.includes('Respondido') ? 'badge-success' : 'badge-warning'}">
                      ${m.status}
                    </span>
                  </div>

                  <p style="font-size: 0.9rem; color: var(--text-main); background: white; padding: 0.75rem 0.9rem; border-radius: 6px; border: 1px solid var(--border-light); margin-bottom: 0.75rem; white-space: pre-line;">
                    ${m.descricao}
                  </p>

                  <!-- Caixa de Resposta do Síndico -->
                  ${(m.respostas && m.respostas.length > 0) ? `
                    <div style="display: flex; flex-direction: column; gap: 0.5rem; border-top: 1px solid var(--border-light); padding-top: 0.75rem;">
                      <strong style="font-size: 0.82rem; color: var(--primary-dark);">💬 Respostas do Síndico:</strong>
                      ${m.respostas.map(r => `
                        <div style="background: #E8F5E9; border-left: 4px solid #2E6B42; padding: 0.65rem 0.85rem; border-radius: 4px; font-size: 0.85rem;">
                          <div style="font-weight: 700; color: #1F4D30; font-size: 0.8rem; display: flex; justify-content: space-between;">
                            <span>${r.autor}</span>
                            <span style="font-weight: 400; opacity: 0.8;">${r.data}</span>
                          </div>
                          <p style="margin-top: 3px; color: var(--text-main);">${r.texto}</p>
                        </div>
                      `).join('')}
                    </div>
                  ` : `
                    <div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">
                      ⏳ Mensagem recebida no Painel do Gestor. Aguardando resposta do Síndico.
                    </div>
                  `}
                </div>
              `).join('')}
            </div>
          `}
        </div>

      </div>
    `;
  },

  enviarMensagem(e) {
    e.preventDefault();
    const user = window.CondoStore.currentUser;
    const assunto = document.getElementById('canalAssunto').value.trim();
    const mensagem = document.getElementById('canalMensagem').value.trim();

    if (!assunto || !mensagem) {
      alert('Por favor, preencha o assunto e a mensagem.');
      return;
    }

    // Registra a mensagem no banco de dados e envia ao Painel do Síndico
    window.CondoStore.addOcorrencia({
      moradorId: user.id,
      moradorNome: user.nome,
      moradorEmail: user.email,
      apartamento: `${user.apartamento}`,
      categoria: 'Canal Direto',
      assunto: assunto,
      descricao: mensagem
    });

    App.showToast('Mensagem enviada com sucesso ao Painel do Síndico!', 'success');
    
    document.getElementById('canalAssunto').value = '';
    document.getElementById('canalMensagem').value = '';
    
    App.render();
  }
};
