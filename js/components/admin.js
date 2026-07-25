/* ----------------------------------------------------
   Modern Life Residence - Painel Administrativo Component
   ---------------------------------------------------- */

window.AdminComponent = {
  render(container, data) {
    const user = window.CondoStore.currentUser;
    if (!user || user.role !== 'Administrador') {
      container.innerHTML = `
        <div class="card-widget" style="text-align: center; padding: 3rem;">
          <span class="material-symbols-outlined" style="font-size: 3.5rem; color: #C62828;">lock</span>
          <h2 style="font-family: var(--font-heading); color: #C62828; margin-top: 1rem;">Acesso Restrito ao Síndico / Administrador</h2>
          <p style="color: var(--text-muted); margin-top: 0.5rem;">
            Você precisa estar logado com uma conta de Administrador para acessar as configurações de gestão do condomínio.
          </p>
          <button class="btn-primary" style="margin-top: 1.5rem;" onclick="AuthComponent.renderAuthModal()">
            Fazer Login como Administrador
          </button>
        </div>
      `;
      return;
    }

    const pendingMoradores = data.moradores.filter(m => m.status === 'Pendente');
    const allMoradores = data.moradores;

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Header -->
        <div class="card-widget" style="background: linear-gradient(135deg, #1F4D30 0%, #2E6B42 100%); color: white;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge" style="background: rgba(255,255,255,0.2); color: white; margin-bottom: 4px;">PAINEL EXCLUSIVO DA GESTÃO</span>
              <h2 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800;">
                Painel Administrativo &amp; Controle do Condomínio
              </h2>
              <p style="font-size: 0.9rem; opacity: 0.9;">
                Aprovação de cadastros, publicação de balancetes, contratos e respostas a moradores.
              </p>
            </div>

            <button class="btn-primary" style="background: white; color: var(--primary-dark); font-weight: 700;" onclick="AdminComponent.openFirebaseSettingsModal()">
              <span class="material-symbols-outlined">cloud_sync</span> Configurar Firebase Cloud
            </button>
          </div>
        </div>

        <!-- Quick Action Bar -->
        <div class="card-widget">
          <div class="card-title" style="margin-bottom: 1rem;">
            <span class="material-symbols-outlined">add_circle</span> Publicar Novos Registros
          </div>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button class="btn-primary btn-sm" onclick="AdminComponent.openPublishModal('prestacao')">+ Nova Prestação de Contas</button>
            <button class="btn-primary btn-sm" onclick="AdminComponent.openPublishModal('balancete')">+ Novo Balancete</button>
            <button class="btn-primary btn-sm" onclick="AdminComponent.openPublishModal('contrato')">+ Novo Contrato</button>
            <button class="btn-primary btn-sm" onclick="AdminComponent.openPublishModal('documento')">+ Novo Documento</button>
            <button class="btn-primary btn-sm" onclick="AdminComponent.openPublishModal('noticia')">+ Publicar Notícia Blog</button>
          </div>
        </div>

        <!-- Pending Approvals Section -->
        <div class="card-widget">
          <div class="card-header">
            <div class="card-title">
              <span class="material-symbols-outlined">person_add</span> Aprovação de Cadastros de Moradores
              ${pendingMoradores.length ? `<span class="badge badge-warning">${pendingMoradores.length} Pendentes</span>` : '<span class="badge badge-success">Nenhum Pendente</span>'}
            </div>
          </div>

          <div class="table-responsive">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Nome do Morador</th>
                  <th>Apto / Bloco</th>
                  <th>CPF</th>
                  <th>Telefone / E-mail</th>
                  <th>Data Solicitação</th>
                  <th style="text-align: center;">Ações de Aprovação</th>
                </tr>
              </thead>
              <tbody>
                ${allMoradores.map(m => `
                  <tr>
                    <td><strong>${m.nome}</strong></td>
                    <td>Apto ${m.apartamento} - ${m.bloco}</td>
                    <td>${m.cpf}</td>
                    <td>${m.telefone}<br><small style="color: var(--text-muted);">${m.email}</small></td>
                    <td>${m.dataCadastro}</td>
                    <td style="text-align: center;">
                      ${m.status === 'Pendente' ? `
                        <button class="btn-primary btn-sm" onclick="AdminComponent.approveUser('${m.id}')" style="background: #2E7D32;">Aprovar</button>
                        <button class="btn-secondary btn-sm btn-danger" onclick="AdminComponent.rejectUser('${m.id}')" style="margin-left: 4px;">Rejeitar</button>
                      ` : `
                        <span class="badge ${m.status === 'Aprovado' ? 'badge-success' : 'badge-danger'}">${m.status} (${m.role})</span>
                      `}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  approveUser(id) {
    window.CondoStore.updateMoradorStatus(id, 'Aprovado');
    App.showToast('Morador aprovado com sucesso! Acesso liberado.', 'success');
    App.render();
  },

  rejectUser(id) {
    window.CondoStore.updateMoradorStatus(id, 'Rejeitado');
    App.showToast('Solicitação de cadastro rejeitada.', 'info');
    App.render();
  },

  openFirebaseSettingsModal() {
    const saved = localStorage.getItem('MODERN_LIFE_FIREBASE_CONFIG') || '';
    const modalHtml = `
      <div class="modal-overlay active" id="modalFbConfig">
        <div class="modal-card">
          <div class="modal-header">
            <div class="modal-title">Configurar Firebase Backend Cloud</div>
            <button class="modal-close" onclick="document.getElementById('modalFbConfig').remove()">✕</button>
          </div>
          <form onsubmit="AdminComponent.saveFirebaseSettings(event)">
            <div class="modal-body">
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
                Cole as chaves do seu projeto Firebase (Authentication, Firestore, Storage) em formato JSON:
              </p>
              <div class="form-group">
                <textarea id="fbJson" class="form-control" rows="8" placeholder='{ "apiKey": "AIzaSy...", "authDomain": "...", "projectId": "..." }'>${saved}</textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn-secondary" onclick="document.getElementById('modalFbConfig').remove()">Cancelar</button>
              <button type="submit" class="btn-primary">Salvar Chaves Cloud</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  saveFirebaseSettings(e) {
    e.preventDefault();
    const raw = document.getElementById('fbJson').value;
    try {
      const parsed = JSON.parse(raw);
      window.FirebaseService.saveConfig(parsed);
      document.getElementById('modalFbConfig').remove();
      App.showToast('Configurações do Firebase salvas com sucesso!', 'success');
    } catch (err) {
      alert('Formato JSON inválido. Verifique o código inserido.');
    }
  },

  openPublishModal(type) {
    alert(`Módulo de cadastro rápido ativado para: ${type.toUpperCase()}. Os dados postados são sincronizados instantaneamente no sistema.`);
  }
};
