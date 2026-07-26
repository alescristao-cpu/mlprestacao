/* ----------------------------------------------------
   Modern Life Residence - Painel Administrativo do Síndico
   Síndico: Alessandro Cristiano da Silva
   Aprovação, Exclusão & Cadastro Manual de Moradores (Cross-Device Sync)
   ---------------------------------------------------- */

window.AdminComponent = {
  render(container, data) {
    const user = window.CondoStore.currentUser;

    if (!user || user.role !== 'Administrador') {
      container.innerHTML = `
        <div class="card-widget" style="text-align: center; padding: 3rem 1.5rem; max-width: 550px; margin: 2rem auto;">
          <span class="material-symbols-outlined" style="font-size: 3rem; color: #C62828;">admin_panel_settings</span>
          <h2 style="font-family: var(--font-heading); color: var(--primary-dark); font-size: 1.3rem; margin-top: 0.5rem;">
            Acesso Restrito à Administração
          </h2>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0.75rem 0 1.25rem 0;">
            Este painel é de uso exclusivo do Síndico <strong>Alessandro Cristiano da Silva</strong> para aprovação, gestão e exclusão de cadastros de moradores.
          </p>
          <button class="btn-primary" onclick="AuthComponent.renderAuthModal()">
            <span class="material-symbols-outlined">login</span> Entrar como Síndico / Administrador
          </button>
        </div>
      `;
      return;
    }

    const moradores = data.moradores || [];
    const pendentes = moradores.filter(m => m.status === 'Pendente');
    const aprovados = moradores.filter(m => m.status === 'Aprovado');

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- Header Banner Síndico -->
        <div class="card-widget" style="background: linear-gradient(135deg, #1F4D30 0%, #2E6B42 100%); color: white;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge" style="background: rgba(255,255,255,0.2); color: white; margin-bottom: 0.4rem;">
                <span class="material-symbols-outlined" style="font-size: 0.85rem;">verified</span> PAINEL ADMINISTRATIVO MASTER
              </span>
              <h2 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700;">
                Gestão do Síndico Alessandro Cristiano da Silva
              </h2>
              <p style="font-size: 0.88rem; opacity: 0.9;">
                E-mail do Condomínio: <code>condominio.modern.life@gmail.com</code>
              </p>
            </div>

            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn-primary" style="background: white; color: var(--primary-dark); font-weight: 700;" onclick="AdminComponent.openManualAddModal()">
                <span class="material-symbols-outlined">person_add</span> Autorizar Novo Morador Manualmente
              </button>
            </div>
          </div>
        </div>

        <!-- Solicitações de Cadastro Pendentes de Aprovação Direta -->
        <div class="card-widget" style="border: 2px solid #FFE0B2;">
          <div class="card-header" style="background: #FFF8E1; padding: 1rem; border-radius: var(--radius-sm);">
            <div class="card-title" style="color: #E65100;">
              <span class="material-symbols-outlined" style="font-size: 1.6rem;">how_to_reg</span> Solicitações de Cadastro Aguardando Aprovação (${pendentes.length})
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 2px;">
              Clique em <strong>"Autorizar Acesso"</strong> para liberar o morador ou em <strong>"Excluir"</strong> para cancelar a solicitação.
            </p>
          </div>

          ${pendentes.length === 0 ? `
            <div style="padding: 2rem 1rem; text-align: center; color: var(--text-muted); font-size: 0.92rem;">
              <span class="material-symbols-outlined" style="font-size: 2.5rem; opacity: 0.5; display: block; margin-bottom: 0.4rem;">check_circle</span>
              Nenhum cadastro de morador aguardando aprovação no momento.
            </div>
          ` : `
            <div class="table-responsive" style="margin-top: 1rem;">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>Nome do Morador</th>
                    <th>Unidade / Apto</th>
                    <th>E-mail</th>
                    <th>Telefone</th>
                    <th>Data Cadastro</th>
                    <th style="text-align: center;">Ações do Síndico</th>
                  </tr>
                </thead>
                <tbody>
                  ${pendentes.map(p => `
                    <tr>
                      <td><strong>${p.nome}</strong></td>
                      <td>Apto ${p.apartamento}</td>
                      <td>${p.email}</td>
                      <td>${p.telefone || 'Não informado'}</td>
                      <td>${p.dataCadastro}</td>
                      <td style="text-align: center;">
                        <div style="display: flex; gap: 0.4rem; justify-content: center; flex-wrap: wrap;">
                          <button class="btn-primary btn-sm" style="background: #2E6B42; font-weight: 700;" onclick="AdminComponent.aprovarMorador('${p.id}')">
                            <span class="material-symbols-outlined" style="font-size: 1rem;">check_circle</span> Autorizar
                          </button>
                          <button class="btn-secondary btn-sm btn-danger" style="background: #FFEBEE; color: #C62828;" onclick="AdminComponent.excluirMorador('${p.id}', '${p.nome}', '${p.apartamento}')">
                            <span class="material-symbols-outlined" style="font-size: 1rem;">delete</span> Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>

        <!-- Lista de Moradores Com Acesso Liberado -->
        <div class="card-widget">
          <div class="card-header">
            <div class="card-title">
              <span class="material-symbols-outlined">groups</span> Moradores Com Acesso Autorizado (${aprovados.length})
            </div>
          </div>

          <div class="table-responsive">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Nome Completo</th>
                  <th>Unidade / Apto</th>
                  <th>E-mail</th>
                  <th>Perfil</th>
                  <th>Status</th>
                  <th style="text-align: center;">Ações</th>
                </tr>
              </thead>
              <tbody>
                ${aprovados.map(m => {
                  const isAdmin = m.role === 'Administrador' || m.id === 'usr_sindico' || m.email.toLowerCase() === 'condominio.modern.life@gmail.com';
                  return `
                    <tr>
                      <td>
                        <strong>${m.nome}</strong>
                        ${isAdmin ? '<span class="badge badge-info" style="margin-left: 6px;">Síndico Master</span>' : ''}
                      </td>
                      <td>Apto ${m.apartamento}</td>
                      <td>${m.email}</td>
                      <td><span class="badge badge-info">${m.role}</span></td>
                      <td><span class="badge badge-success">${m.status}</span></td>
                      <td style="text-align: center;">
                        ${isAdmin ? `
                          <span style="font-size: 0.78rem; color: var(--text-muted); font-style: italic;">
                            <span class="material-symbols-outlined" style="font-size: 0.9rem; vertical-align: middle;">lock</span> Não Excluível
                          </span>
                        ` : `
                          <button class="btn-secondary btn-sm btn-danger" style="background: #FFEBEE; color: #C62828; padding: 0.4rem 0.75rem;" onclick="AdminComponent.excluirMorador('${m.id}', '${m.nome}', '${m.apartamento}')">
                            <span class="material-symbols-outlined" style="font-size: 0.95rem;">delete</span> Excluir
                          </button>
                        `}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  },

  openManualAddModal() {
    const existing = document.getElementById('modalManualAdd');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="modal-overlay active" id="modalManualAdd">
        <div class="modal-card" style="max-width: 500px;">
          <div class="modal-header" style="background: var(--primary-dark); color: white;">
            <div class="modal-title" style="color: white; font-weight: 700;">Autorizar Morador Manualmente</div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalManualAdd').remove()">✕</button>
          </div>
          <div class="modal-body">
            <form onsubmit="AdminComponent.submeterAddManual(event)">
              <div class="form-group">
                <label class="form-label">Nome Completo do Morador</label>
                <input type="text" id="manualNome" class="form-control" placeholder="Ex: Carlos Eduardo" required>
              </div>

              <div class="form-group">
                <label class="form-label">E-mail do Morador</label>
                <input type="email" id="manualEmail" class="form-control" placeholder="morador@exemplo.com" required>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Unidade / Apto</label>
                  <input type="text" id="manualApto" class="form-control" placeholder="Ex: Apt 502" required>
                </div>

                <div class="form-group">
                  <label class="form-label">Telefone / WhatsApp</label>
                  <input type="tel" id="manualTelefone" class="form-control" placeholder="(11) 99999-9999">
                </div>
              </div>

              <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem;">
                <span class="material-symbols-outlined">check_circle</span> Liberar e Autorizar Acesso
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  submeterAddManual(e) {
    e.preventDefault();
    const nome = document.getElementById('manualNome').value.trim();
    const email = document.getElementById('manualEmail').value.trim();
    const apartamento = document.getElementById('manualApto').value.trim();
    const telefone = document.getElementById('manualTelefone').value.trim();

    const newMorador = window.CondoStore.addMorador({
      nome,
      email,
      telefone,
      apartamento,
      cpf: 'Cadastrado Pelo Síndico'
    });

    window.CondoStore.updateMoradorStatus(newMorador.id, 'Aprovado');

    App.showToast(`Morador "${nome}" cadastrado e APROVADO com sucesso!`, 'success');
    document.getElementById('modalManualAdd').remove();
    App.render();
  },

  aprovarMorador(id) {
    window.CondoStore.updateMoradorStatus(id, 'Aprovado');
    App.showToast('Acesso do morador autorizado com sucesso!', 'success');
    App.render();
  },

  excluirMorador(id, nome, apto) {
    if (!confirm(`Tem certeza que deseja EXCLUIR permanentemente o cadastro de "${nome}" (Apto ${apto})?`)) {
      return;
    }

    const res = window.CondoStore.deleteMorador(id);
    if (res.success) {
      App.showToast(`Cadastro do morador "${nome}" foi excluído.`, 'success');
      App.render();
    } else {
      alert(res.message);
    }
  }
};
