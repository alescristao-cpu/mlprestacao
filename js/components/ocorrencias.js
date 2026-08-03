/* ----------------------------------------------------
   Modern Life Residence - Reclamações, Elogios & Sugestões (Caixa Privada)
   Postagem Direta no Site e Encaminhamento ao Painel do Gestor
   ---------------------------------------------------- */

window.OcorrenciasComponent = {
  render(container, data) {
    const user = window.CondoStore.currentUser;

    if (!user || user.status !== 'Aprovado') {
      container.innerHTML = `
        <div class="card-widget" style="text-align: center; padding: 3.5rem 1.5rem; max-width: 600px; margin: 2rem auto;">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 1.25rem auto;">
            <span class="material-symbols-outlined" style="font-size: 2.8rem;">lock</span>
          </div>
          <h2 style="font-family: var(--font-heading); color: var(--primary-dark); font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem;">
            Acesso Restrito às Suas Mensagens Privadas
          </h2>
          <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 1.5rem;">
            Para abrir ou visualizar o histórico de suas Reclamações, Elogios e Sugestões e acessar a caixa de respostas do Síndico, faça login no portal.
          </p>
          <button class="btn-primary" onclick="AuthComponent.renderAuthModal()" style="padding: 0.8rem 1.5rem; font-size: 0.95rem;">
            <span class="material-symbols-outlined">login</span> Entrar / Cadastrar com E-mail
          </button>
        </div>
      `;
      return;
    }

    const isMasterAdmin = user.role === 'Administrador';
    // Ocorrências excluem as mensagens puras do Canal Direto nesta aba
    const allOcorrencias = (data.ocorrencias || []).filter(o => o.categoria !== 'Canal Direto');

    // PRIVACIDADE ESTREITA: Síndico vê todas. Morador comum vê APENAS as suas OU as tornadas visíveis a todos pelo administrador.
    const userOcorrencias = isMasterAdmin 
      ? allOcorrencias 
      : allOcorrencias.filter(o => 
          (o.moradorEmail && o.moradorEmail.toLowerCase().trim() === user.email.toLowerCase().trim()) || 
          o.moradorId === user.id || 
          o.visivelParaTodos === true
        );

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- Header Banner -->
        <div class="card-widget" style="background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%); color: white;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <span class="material-symbols-outlined" style="font-size: 2.5rem;">support_agent</span>
              <div>
                <h2 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700;">
                  ${isMasterAdmin ? 'Painel Master de Reclamações, Elogios &amp; Sugestões (Síndico)' : 'Reclamações, Elogios &amp; Sugestões'}
                </h2>
                <p style="font-size: 0.9rem; opacity: 0.9;">
                  ${isMasterAdmin ? 'Gerenciamento privado e controle de visibilidade pública das mensagens dos moradores.' : 'Comunicação pessoal com a administração. Suas mensagens são privadas, a menos que autorizadas para exibição comunitária.'}
                </p>
              </div>
            </div>

            ${!isMasterAdmin ? `
              <button class="btn-primary" style="background: white; color: var(--primary-dark); font-weight: 700;" onclick="OcorrenciasComponent.openNewFormModal()">
                <span class="material-symbols-outlined">add_comment</span> Nova Reclamação / Sugestão / Elogio
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Section List of Private Occurrences -->
        <div class="card-widget">
          <div class="card-header">
            <div class="card-title">
              <span class="material-symbols-outlined">inbox</span> ${isMasterAdmin ? 'Caixa de Entrada Geral (Todas as Mensagens dos Moradores)' : 'Minhas Mensagens &amp; Ocorrências Comunitárias'}
            </div>
          </div>

          ${userOcorrencias.length === 0 ? `
            <div style="padding: 2.5rem 1rem; text-align: center; color: var(--text-muted);">
              <span class="material-symbols-outlined" style="font-size: 3rem; opacity: 0.5; display: block; margin-bottom: 0.5rem;">mail_lock</span>
              <p style="font-size: 0.95rem;">Nenhuma mensagem registrada na sua caixa.</p>
              ${!isMasterAdmin ? `
                <button class="btn-outline-primary" style="margin-top: 1rem;" onclick="OcorrenciasComponent.openNewFormModal()">
                  Abrir Primeira Reclamação, Elogio ou Sugestão
                </button>
              ` : ''}
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 1.25rem;">
              ${userOcorrencias.map(item => `
                <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem; box-shadow: var(--shadow-sm);">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
                    <div>
                      <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap; margin-bottom: 4px;">
                        <span class="badge ${item.categoria === 'Reclamação' ? 'badge-danger' : item.categoria === 'Elogio' ? 'badge-success' : 'badge-info'}">
                          ${item.categoria}
                        </span>
                        <span class="badge ${item.visivelParaTodos ? 'badge-success' : 'badge-secondary'}" style="font-weight: 700;">
                          ${item.visivelParaTodos ? '🌐 Visível a Todos os Moradores' : '🔒 Mensagem Privada'}
                        </span>
                      </div>
                      <h3 style="font-family: var(--font-heading); font-size: 1.2rem; color: var(--primary-dark); font-weight: 700; margin-top: 2px;">
                        ${item.assunto}
                      </h3>
                      <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">
                        Enviado em: ${item.data} &bull; Autor: <strong>${item.moradorNome} (Apto ${item.apartamento})</strong>
                      </div>
                    </div>

                    <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                      <span class="badge ${item.status.includes('Respondido') ? 'badge-success' : 'badge-warning'}">
                        ${item.status}
                      </span>
                      ${isMasterAdmin ? `
                        <button class="btn-secondary btn-sm" onclick="OcorrenciasComponent.toggleVisibilidade('${item.id}')" style="font-size: 0.78rem; font-weight: 700; border: 1px solid var(--border-color);" title="Alternar Visibilidade Pública">
                          ${item.visivelParaTodos ? '🔒 Tornar Privada' : '🌐 Tornar Visível a Todos'}
                        </button>
                      ` : ''}
                    </div>
                  </div>

                  <p style="font-size: 0.92rem; color: var(--text-main); background: var(--bg-app); padding: 0.85rem; border-radius: var(--radius-sm); margin-bottom: 1rem; white-space: pre-line;">
                    ${item.descricao}
                  </p>

                  <!-- Respostas da Administração (Caixa de Resposta Pessoal) -->
                  <div style="border-top: 1px solid var(--border-light); padding-top: 0.85rem; margin-top: 0.85rem;">
                    <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--primary-dark); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 4px;">
                      <span class="material-symbols-outlined" style="font-size: 1.1rem; color: var(--primary);">reply_all</span>
                      Caixa de Respostas do Síndico (${item.respostas ? item.respostas.length : 0})
                    </h4>

                    ${(item.respostas && item.respostas.length > 0) ? `
                      <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 0.75rem;">
                        ${item.respostas.map(r => `
                          <div style="background: var(--primary-light); border-left: 4px solid var(--primary); padding: 0.75rem 1rem; border-radius: var(--radius-sm); font-size: 0.86rem; color: var(--primary-dark);">
                            <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 2px;">
                              <span>${r.autor}</span>
                              <span style="font-size: 0.72rem; opacity: 0.8;">${r.data}</span>
                            </div>
                            <p style="color: var(--text-main); margin-top: 2px;">${r.texto}</p>
                          </div>
                        `).join('')}
                      </div>
                    ` : `
                      <p style="font-size: 0.8rem; color: var(--text-muted); font-style: italic; margin-bottom: 0.5rem;">
                        ⏳ Ocorrência encaminhada ao Painel do Gestor. Aguardando resposta do Síndico.
                      </p>
                    `}

                    <!-- Form de Resposta Direta para o Síndico (Master Admin) -->
                    ${isMasterAdmin ? `
                      <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
                        <input type="text" id="inputResposta_${item.id}" class="form-control" placeholder="Escreva a resposta do Síndico para o morador..." style="font-size: 0.85rem;">
                        <button class="btn-primary btn-sm" onclick="OcorrenciasComponent.enviarRespostaSindico('${item.id}')">
                          Enviar Resposta
                        </button>
                      </div>
                    ` : ''}
                  </div>

                </div>
              `).join('')}
            </div>
          `}
        </div>

      </div>
    `;
  },

  openNewFormModal() {
    const existing = document.getElementById('modalNewOcorrencia');
    if (existing) existing.remove();

    const user = window.CondoStore.currentUser;

    const modalHtml = `
      <div class="modal-overlay active" id="modalNewOcorrencia">
        <div class="modal-card" style="max-width: 580px;">
          <div class="modal-header">
            <div class="modal-title">Nova Reclamação, Elogio ou Sugestão</div>
            <button class="modal-close" onclick="document.getElementById('modalNewOcorrencia').remove()">✕</button>
          </div>
          <div class="modal-body">
            <div style="background: var(--primary-light); padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.8rem; color: var(--primary-dark); margin-bottom: 1rem; border-left: 3px solid var(--primary);">
              🔒 <strong>Garantia de Privacidade:</strong> Sua mensagem é gravada diretamente no portal e encaminhada ao Painel do Síndico. Nenhum outro morador terá acesso às suas informações.
            </div>

            <form onsubmit="OcorrenciasComponent.submeterForm(event)">
              <div class="form-group">
                <label class="form-label">Tipo de Mensagem</label>
                <select id="ocoCategoria" class="form-control" required>
                  <option value="Reclamação">⚠️ Reclamação</option>
                  <option value="Sugestão">💡 Sugestão</option>
                  <option value="Elogio">👏 Elogio</option>
                  <option value="Outros">📌 Outros</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Assunto</label>
                <input type="text" id="ocoAssunto" class="form-control" placeholder="Ex: Barulho após às 22h / Elogio à portaria" required>
              </div>

              <div class="form-group">
                <label class="form-label">Descrição Detalhada</label>
                <textarea id="ocoDescricao" class="form-control" rows="5" placeholder="Descreva aqui o ocorrido com todos os detalhes..." required></textarea>
              </div>

              <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-size: 0.95rem;">
                <span class="material-symbols-outlined">send</span> Registrar e Encaminhar ao Painel do Gestor
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  submeterForm(e) {
    e.preventDefault();
    const user = window.CondoStore.currentUser;
    const categoria = document.getElementById('ocoCategoria').value;
    const assunto = document.getElementById('ocoAssunto').value;
    const descricao = document.getElementById('ocoDescricao').value;

    // Registra a ocorrência no banco de dados e envia ao Painel do Gestor
    window.CondoStore.addOcorrencia({
      moradorId: user.id,
      moradorNome: user.nome,
      moradorEmail: user.email,
      apartamento: `${user.apartamento}`,
      categoria,
      assunto,
      descricao
    });

    App.showToast(`Sua ${categoria.toLowerCase()} foi registrada com sucesso e encaminhada ao Painel do Gestor!`, 'success');
    document.getElementById('modalNewOcorrencia').remove();
    App.render();
  },

  enviarRespostaSindico(ocoId) {
    const input = document.getElementById('inputResposta_' + ocoId);
    const text = input ? input.value.trim() : '';
    if (!text) return;

    window.CondoStore.addRespostaOcorrencia(ocoId, text, 'Síndico Alessandro Cristiano da Silva');
    App.showToast('Resposta enviada ao morador!', 'success');
    App.render();
  },

  toggleVisibilidade(ocoId) {
    const novaVis = window.CondoStore.toggleOcorrenciaVisibilidade(ocoId);
    App.showToast(novaVis ? '🌐 Ocorrência tornada visível para todos os moradores!' : '🔒 Ocorrência tornada privada (visível apenas para o autor e o síndico).', 'info');
    App.render();
  }
};
