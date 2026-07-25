/* ----------------------------------------------------
   Modern Life Residence - Reclamações & Ocorrências Component
   ---------------------------------------------------- */

window.OcorrenciasComponent = {
  render(container, data) {
    const list = data.ocorrencias || [];
    const user = window.CondoStore.currentUser || {};

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Header & Action Button -->
        <div class="card-widget" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="card-title">
              <span class="material-symbols-outlined">assignment_late</span> Gestão Interna de Chamados e Ocorrências
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
              Registre e acompanhe o andamento de Reclamações, Sugestões e Elogios sobre a vida no condomínio.
            </p>
          </div>

          <button class="btn-primary" onclick="OcorrenciasComponent.openNewModal()">
            <span class="material-symbols-outlined">add</span> Abrir Novo Chamado
          </button>
        </div>

        <!-- Ocorrencias List -->
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          ${list.map(oco => {
            let badgeClass = 'badge-info';
            if (oco.status === 'Em análise') badgeClass = 'badge-warning';
            if (oco.status === 'Finalizado') badgeClass = 'badge-success';

            return `
              <div class="card-widget">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.85rem;">
                  <div>
                    <span class="badge ${badgeClass}" style="margin-bottom: 4px;">
                      ${oco.categoria} &bull; Status: ${oco.status}
                    </span>
                    <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--primary-dark); font-weight: 700;">
                      ${oco.assunto}
                    </h3>
                    <div style="font-size: 0.78rem; color: var(--text-muted);">
                      Registrado por <strong>${oco.moradorNome} (Apt ${oco.apartamento})</strong> em ${oco.data}
                    </div>
                  </div>
                </div>

                <p style="font-size: 0.92rem; color: var(--text-main); margin-bottom: 1rem; background: var(--bg-app); padding: 0.85rem; border-radius: var(--radius-sm);">
                  ${oco.descricao}
                </p>

                ${oco.fotos && oco.fotos.length ? `
                  <div style="display: flex; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap;">
                    ${oco.fotos.map(f => `<img src="${f}" style="width: 100px; height: 75px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border-color);" alt="Anexo">`).join('')}
                  </div>
                ` : ''}

                <!-- Status Timeline Bar -->
                <div style="margin-top: 1rem; border-top: 1px solid var(--border-light); padding-top: 1rem;">
                  <div style="font-size: 0.8rem; font-weight: 700; color: var(--primary-dark); margin-bottom: 0.5rem;">
                    Linha do Tempo de Resolução:
                  </div>

                  <div style="display: flex; justify-content: space-between; position: relative; font-size: 0.75rem; font-weight: 600; text-align: center;">
                    <div style="color: ${['Recebido', 'Em análise', 'Respondido', 'Finalizado'].includes(oco.status) ? 'var(--primary)' : 'var(--text-muted)'}; flex: 1;">
                      <span class="material-symbols-outlined" style="font-size: 1.2rem;">inbox</span><br>Recebido
                    </div>
                    <div style="color: ${['Em análise', 'Respondido', 'Finalizado'].includes(oco.status) ? 'var(--primary)' : 'var(--text-muted)'}; flex: 1;">
                      <span class="material-symbols-outlined" style="font-size: 1.2rem;">find_in_page</span><br>Em Análise
                    </div>
                    <div style="color: ${['Respondido', 'Finalizado'].includes(oco.status) ? 'var(--primary)' : 'var(--text-muted)'}; flex: 1;">
                      <span class="material-symbols-outlined" style="font-size: 1.2rem;">reply</span><br>Respondido
                    </div>
                    <div style="color: ${oco.status === 'Finalizado' ? '#2E7D32' : 'var(--text-muted)'}; flex: 1;">
                      <span class="material-symbols-outlined" style="font-size: 1.2rem;">check_circle</span><br>Finalizado
                    </div>
                  </div>
                </div>

                ${oco.respostaAdmin ? `
                  <div style="margin-top: 1rem; background: #E8F3EB; border-left: 4px solid var(--primary); padding: 0.85rem; border-radius: var(--radius-sm); font-size: 0.88rem;">
                    <strong>Resposta da Administração / Síndico:</strong>
                    <p style="margin-top: 4px; color: var(--primary-dark);">${oco.respostaAdmin}</p>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  openNewModal() {
    const existing = document.getElementById('modalNewOco');
    if (existing) existing.remove();

    const user = window.CondoStore.currentUser || {};

    const modalHtml = `
      <div class="modal-overlay active" id="modalNewOco">
        <div class="modal-card">
          <div class="modal-header">
            <div class="modal-title">Abrir Nova Ocorrência</div>
            <button class="modal-close" onclick="document.getElementById('modalNewOco').remove()">✕</button>
          </div>
          <form onsubmit="OcorrenciasComponent.submitOcorrencia(event)">
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Tipo de Chamado</label>
                <select id="ocoCat" class="form-control" required>
                  <option value="Reclamação">Reclamação</option>
                  <option value="Sugestão">Sugestão</option>
                  <option value="Elogio">Elogio</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Assunto</label>
                <input type="text" id="ocoAssunto" class="form-control" placeholder="Resumo em poucas palavras" required>
              </div>

              <div class="form-group">
                <label class="form-label">Descrição Detalhada</label>
                <textarea id="ocoDesc" class="form-control" rows="4" placeholder="Descreva os fatos, local e horários envolvidos..." required></textarea>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-secondary" onclick="document.getElementById('modalNewOco').remove()">Cancelar</button>
              <button type="submit" class="btn-primary">Registrar Ocorrência</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  submitOcorrencia(e) {
    e.preventDefault();
    const user = window.CondoStore.currentUser || { nome: 'Morador', apartamento: '00' };

    window.CondoStore.addOcorrencia({
      moradorNome: user.nome,
      apartamento: `${user.apartamento || '101'}${user.bloco || 'A'}`,
      categoria: document.getElementById('ocoCat').value,
      assunto: document.getElementById('ocoAssunto').value,
      descricao: document.getElementById('ocoDesc').value,
      fotos: []
    });

    document.getElementById('modalNewOco').remove();
    App.showToast('Ocorrência registrada com sucesso! Acompanhe o status nesta página.', 'success');
    App.render();
  }
};
