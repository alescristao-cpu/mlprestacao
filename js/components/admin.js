/* ----------------------------------------------------
   Modern Life Residence - Painel Administrativo do Síndico
   Síndico: Alessandro Cristiano da Silva
   Aprovação, Edição, Exclusão e Botão de Sincronização em Tempo Real
   ---------------------------------------------------- */

window.AdminComponent = {
  render(container, data) {
    const user = window.CondoStore.currentUser;

    if (!user || user.role !== 'Administrador') {
      container.innerHTML = `
        <div class="card-widget" style="text-align: center; padding: 3rem 1.5rem; max-width: 550px; margin: 2rem auto;">
          <span class="material-symbols-outlined" style="font-size: 3.5rem; color: #C62828; display: block; margin-bottom: 0.5rem;">admin_panel_settings</span>
          <h2 style="font-family: var(--font-heading); color: var(--primary-dark); font-size: 1.3rem; margin-top: 0.5rem;">
            Acesso Restrito à Administração
          </h2>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0.75rem 0 1.25rem 0; line-height: 1.5;">
            Este painel é de uso exclusivo do Síndico <strong>Alessandro Cristiano da Silva</strong> para aprovação, edição e alteração de funções.
          </p>
          <button class="btn-primary" onclick="AuthComponent.renderAuthModal()" style="width: 100%; justify-content: center; padding: 0.85rem;">
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
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        
        <!-- Banner Principal do Síndico -->
        <div class="card-widget" style="background: linear-gradient(135deg, #1F4D30 0%, #2E6B42 100%); color: white; padding: 1.25rem;">
          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            <div>
              <span class="badge" style="background: rgba(255,255,255,0.2); color: white; margin-bottom: 0.4rem;">
                <span class="material-symbols-outlined" style="font-size: 0.85rem;">verified</span> PAINEL ADMINISTRATIVO MASTER
              </span>
              <h2 style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 700;">
                Gestão do Síndico Alessandro Cristiano da Silva
              </h2>
              <p style="font-size: 0.82rem; opacity: 0.9;">
                E-mail oficial: <code>condominio.modern.life@gmail.com</code>
              </p>
            </div>

            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn-primary" style="background: white; color: var(--primary-dark); font-weight: 700; flex: 1; justify-content: center; padding: 0.85rem; font-size: 0.9rem; min-width: 220px;" onclick="AdminComponent.openQuickApproveModal()">
                <span class="material-symbols-outlined" style="color: var(--primary);">person_add</span> ➕ Autorizar Novo Morador Manualmente
              </button>

              <button class="btn-secondary" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.4); font-weight: 600; padding: 0.85rem;" onclick="AdminComponent.forcarSincronizacaoNuvem()">
                <span class="material-symbols-outlined">sync</span> 🔄 Buscar Novos Cadastros na Nuvem
              </button>
            </div>
          </div>
        </div>

        <!-- Seção 1: Solicitações de Cadastro Pendentes -->
        <div class="card-widget" style="border: 2px solid #FFE0B2; padding: 1.25rem;">
          <div style="background: #FFF8E1; padding: 0.85rem 1rem; border-radius: var(--radius-sm); margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
            <div style="font-weight: 700; color: #E65100; font-size: 1rem; display: flex; align-items: center; gap: 0.4rem;">
              <span class="material-symbols-outlined" style="font-size: 1.4rem;">how_to_reg</span> Cadastros Aguardando Aprovação (${pendentes.length})
            </div>
            <span class="badge badge-warning">${pendentes.length} Pendentes</span>
          </div>

          ${pendentes.length === 0 ? `
            <div style="padding: 1.5rem 0.5rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
              <span class="material-symbols-outlined" style="font-size: 2.5rem; opacity: 0.4; display: block; margin-bottom: 0.3rem;">check_circle</span>
              Nenhuma solicitação pendente no momento nesta tela.<br>
              <button class="btn-outline-primary btn-sm" style="margin-top: 0.75rem;" onclick="AdminComponent.forcarSincronizacaoNuvem()">
                <span class="material-symbols-outlined">sync</span> Checar Se Há Novos Cadastros Feitos no Celular
              </button>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              ${pendentes.map(p => `
                <div style="background: var(--bg-app); border: 1px solid #FFE0B2; border-radius: var(--radius-sm); padding: 1rem; display: flex; flex-direction: column; gap: 0.6rem;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                      <strong style="font-size: 1.05rem; color: var(--primary-dark);">${p.nome}</strong>
                      <div style="font-size: 0.85rem; color: var(--text-main); font-weight: 600;">Unidade: Apto ${p.apartamento}</div>
                    </div>
                    <span class="badge badge-warning">Pendente</span>
                  </div>

                  <div style="font-size: 0.82rem; color: var(--text-muted);">
                    <div>📧 E-mail: <strong>${p.email}</strong></div>
                    <div>📱 Telefone: <strong>${p.telefone || 'Não informado'}</strong></div>
                  </div>

                  <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.4rem;">
                    <button class="btn-primary btn-sm" style="flex: 1; justify-content: center; background: #2E6B42; padding: 0.65rem; font-weight: 700;" onclick="AdminComponent.aprovarMorador('${p.id}')">
                      <span class="material-symbols-outlined" style="font-size: 1rem;">check_circle</span> Autorizar
                    </button>

                    <button class="btn-outline-primary btn-sm" style="padding: 0.65rem;" onclick="AdminComponent.openEditMoradorModal('${p.id}')">
                      <span class="material-symbols-outlined" style="font-size: 1rem;">edit</span> Editar / Função
                    </button>

                    <button class="btn-secondary btn-sm btn-danger" style="background: #FFEBEE; color: #C62828; padding: 0.65rem;" onclick="AdminComponent.excluirMorador('${p.id}', '${p.nome}', '${p.apartamento}')">
                      <span class="material-symbols-outlined" style="font-size: 1rem;">delete</span> Excluir
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Seção 2: Lista de Moradores Autorizados -->
        <div class="card-widget" style="padding: 1.25rem;">
          <div class="card-header" style="margin-bottom: 0.85rem;">
            <div class="card-title">
              <span class="material-symbols-outlined">groups</span> Moradores Com Acesso Autorizado (${aprovados.length})
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">
              Clique em <strong>"Editar / Função"</strong> para definir qualquer morador como <strong>Conselheiro</strong>.
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            ${aprovados.map(m => {
              const isAdmin = m.role === 'Administrador' || m.id === 'usr_sindico' || m.email.toLowerCase() === 'condominio.modern.life@gmail.com';
              const isConselheiro = m.role === 'Conselheiro';

              return `
                <div style="background: var(--bg-app); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
                  <div>
                    <div style="font-weight: 700; font-size: 1rem; color: var(--primary-dark); display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
                      ${m.nome}
                      ${isAdmin ? '<span class="badge badge-info" style="font-size: 0.72rem;">Síndico Master</span>' : ''}
                      ${isConselheiro ? '<span class="badge badge-success" style="font-size: 0.72rem; background: #D1E7DD; color: #0F5132;">👑 Conselheiro</span>' : ''}
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-main); margin-top: 2px;">
                      <strong>Apto ${m.apartamento}</strong> &bull; 📧 ${m.email} &bull; 📱 ${m.telefone || 'Sem telefone'}
                    </div>
                  </div>

                  <div style="display: flex; gap: 0.4rem; align-items: center;">
                    <button class="btn-outline-primary btn-sm" onclick="AdminComponent.openEditMoradorModal('${m.id}')" title="Editar dados e função (Conselheiro)">
                      <span class="material-symbols-outlined" style="font-size: 0.95rem;">edit</span> Editar / Função
                    </button>

                    ${isAdmin ? `
                      <span style="font-size: 0.75rem; color: var(--text-muted); font-style: italic; margin-left: 4px;">
                        🔒 Administrador
                      </span>
                    ` : `
                      <button class="btn-secondary btn-sm btn-danger" style="background: #FFEBEE; color: #C62828;" onclick="AdminComponent.excluirMorador('${m.id}', '${m.nome}', '${m.apartamento}')" title="Excluir cadastro">
                        <span class="material-symbols-outlined" style="font-size: 0.95rem;">delete</span> Excluir
                      </button>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>
    `;
  },

  async forcarSincronizacaoNuvem() {
    await window.CondoStore.pullFromCloudSilently();
    await window.CondoStore.broadcastToCloud();
    App.showToast('Verificação concluída!', 'success');
    App.render();
  },

  openEditMoradorModal(moradorId) {
    const morador = window.CondoStore.data.moradores.find(m => m.id === moradorId);
    if (!morador) return;

    const existing = document.getElementById('modalEditMorador');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="modal-overlay active" id="modalEditMorador">
        <div class="modal-card" style="max-width: 520px;">
          <div class="modal-header" style="background: var(--primary-dark); color: white;">
            <div class="modal-title" style="color: white; font-weight: 700; font-size: 1.1rem;">
              ✏️ Editar Morador &amp; Definir Função (Conselheiro)
            </div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalEditMorador').remove()">✕</button>
          </div>
          <div class="modal-body">
            <form onsubmit="AdminComponent.submeterEdicaoMorador(event, '${morador.id}')">
              
              <div class="form-group">
                <label class="form-label">Nome Completo</label>
                <input type="text" id="editNome" class="form-control" value="${morador.nome}" required>
              </div>

              <div class="form-group">
                <label class="form-label">Função / Perfil no Condomínio</label>
                <select id="editRole" class="form-control" style="font-weight: 700;" required>
                  <option value="Morador" ${morador.role === 'Morador' ? 'selected' : ''}>🏡 Morador Padrão</option>
                  <option value="Conselheiro" ${morador.role === 'Conselheiro' ? 'selected' : ''}>👑 Conselheiro (Conselho Consultivo / Fiscal)</option>
                  <option value="Administrador" ${morador.role === 'Administrador' ? 'selected' : ''}>🛡️ Administrador (Síndico)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">E-mail Principal</label>
                <input type="email" id="editEmail" class="form-control" value="${morador.email}" required>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Unidade / Apto</label>
                  <input type="text" id="editApto" class="form-control" value="${morador.apartamento}" required>
                </div>

                <div class="form-group">
                  <label class="form-label">Telefone / WhatsApp</label>
                  <input type="tel" id="editTelefone" class="form-control" value="${morador.telefone || ''}">
                </div>
              </div>

              <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem;">
                <button type="button" class="btn-secondary" onclick="document.getElementById('modalEditMorador').remove()">Cancelar</button>
                <button type="submit" class="btn-primary" style="padding: 0.8rem 1.4rem;">
                  <span class="material-symbols-outlined">save</span> Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  submeterEdicaoMorador(e, moradorId) {
    e.preventDefault();
    const nome = document.getElementById('editNome').value.trim();
    const role = document.getElementById('editRole').value;
    const email = document.getElementById('editEmail').value.trim();
    const apartamento = document.getElementById('editApto').value.trim();
    const telefone = document.getElementById('editTelefone').value.trim();

    const res = window.CondoStore.updateMoradorDetails(moradorId, {
      nome,
      role,
      email,
      apartamento,
      telefone
    });

    if (res.success) {
      App.showToast(`Morador "${nome}" atualizado para ${role}!`, 'success');
      document.getElementById('modalEditMorador').remove();
      App.render();
    } else {
      alert(res.message);
    }
  },

  openQuickApproveModal() {
    const existing = document.getElementById('modalQuickApprove');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="modal-overlay active" id="modalQuickApprove">
        <div class="modal-card" style="max-width: 480px;">
          <div class="modal-header" style="background: var(--primary-dark); color: white;">
            <div class="modal-title" style="color: white; font-weight: 700; font-size: 1.1rem;">
              ➕ Autorizar Novo Morador Manualmente
            </div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalQuickApprove').remove()">✕</button>
          </div>
          <div class="modal-body">
            <form onsubmit="AdminComponent.submeterAprovacaoRapida(event)">
              <div class="form-group">
                <label class="form-label">Nome Completo do Morador</label>
                <input type="text" id="quickNome" class="form-control" placeholder="Ex: João da Silva" required>
              </div>

              <div class="form-group">
                <label class="form-label">Função / Perfil no Condomínio</label>
                <select id="quickRole" class="form-control" style="font-weight: 700;" required>
                  <option value="Morador">🏡 Morador Padrão</option>
                  <option value="Conselheiro">👑 Conselheiro (Conselho Consultivo / Fiscal)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">E-mail do Morador</label>
                <input type="email" id="quickEmail" class="form-control" placeholder="morador@exemplo.com" required>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Unidade / Apto</label>
                  <input type="text" id="quickApto" class="form-control" placeholder="Ex: Apt 402" required>
                </div>

                <div class="form-group">
                  <label class="form-label">Telefone / WhatsApp</label>
                  <input type="tel" id="quickTelefone" class="form-control" placeholder="(11) 99999-9999">
                </div>
              </div>

              <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-weight: 700;">
                <span class="material-symbols-outlined">check_circle</span> Liberar e Autorizar Acesso
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  submeterAprovacaoRapida(e) {
    e.preventDefault();
    const nome = document.getElementById('quickNome').value.trim();
    const role = document.getElementById('quickRole').value;
    const email = document.getElementById('quickEmail').value.trim();
    const apartamento = document.getElementById('quickApto').value.trim();
    const telefone = document.getElementById('quickTelefone') ? document.getElementById('quickTelefone').value.trim() : '';

    const res = window.CondoStore.addMorador({
      nome,
      role,
      email,
      telefone,
      apartamento,
      cpf: 'Autorizado Pelo Síndico'
    });

    if (!res.success) {
      alert(`⚠️ RECUSADO:\n\n${res.message}`);
      return;
    }

    window.CondoStore.updateMoradorStatus(res.morador.id, 'Aprovado');

    App.showToast(`Morador "${nome}" (Apto ${apartamento}) APROVADO como ${role}!`, 'success');
    document.getElementById('modalQuickApprove').remove();
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
