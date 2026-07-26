/* ----------------------------------------------------
   Modern Life Residence - Painel Administrativo do Síndico
   Otimizado 100% para Celulares (iOS / Android) & Desktop
   Síndico: Alessandro Cristiano da Silva
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
            Este painel é de uso exclusivo do Síndico <strong>Alessandro Cristiano da Silva</strong> para aprovação, gestão e autorização de moradores.
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
        
        <!-- Banner Principal do Síndico (Otimizado para Celular) -->
        <div class="card-widget" style="background: linear-gradient(135deg, #1F4D30 0%, #2E6B42 100%); color: white; padding: 1.25rem;">
          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            <div>
              <span class="badge" style="background: rgba(255,255,255,0.2); color: white; margin-bottom: 0.4rem;">
                <span class="material-symbols-outlined" style="font-size: 0.85rem;">verified</span> PAINEL ADMINISTRATIVO MASTER
              </span>
              <h2 style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 700;">
                Gestão do Síndico Alessandro
              </h2>
              <p style="font-size: 0.82rem; opacity: 0.9;">
                E-mail oficial: <code>condominio.modern.life@gmail.com</code>
              </p>
            </div>

            <!-- Botão de Autorização Rápida no Celular -->
            <button class="btn-primary" style="background: white; color: var(--primary-dark); font-weight: 700; width: 100%; justify-content: center; padding: 0.85rem; font-size: 0.92rem; box-shadow: var(--shadow-md);" onclick="AdminComponent.openQuickApproveModal()">
              <span class="material-symbols-outlined" style="color: var(--primary);">person_add</span> ➕ Aprovar / Liberar Morador no Celular
            </button>
          </div>
        </div>

        <!-- Seção 1: Solicitações de Cadastro Pendentes (Formato Cards no Celular) -->
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
              <span style="font-size: 0.8rem; opacity: 0.8;">Para autorizar um novo morador que se cadastrou em outro celular, use o botão verde acima!</span>
            </div>
          ` : `
            <!-- Cards Individuais para visualização perfeita em Celulares -->
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
                    <div>📅 Data: ${p.dataCadastro}</div>
                  </div>

                  <div style="display: flex; gap: 0.5rem; margin-top: 0.4rem;">
                    <button class="btn-primary btn-sm" style="flex: 1; justify-content: center; background: #2E6B42; padding: 0.75rem; font-weight: 700;" onclick="AdminComponent.aprovarMorador('${p.id}')">
                      <span class="material-symbols-outlined" style="font-size: 1.1rem;">check_circle</span> Autorizar
                    </button>
                    <button class="btn-secondary btn-sm btn-danger" style="background: #FFEBEE; color: #C62828; padding: 0.75rem;" onclick="AdminComponent.excluirMorador('${p.id}', '${p.nome}', '${p.apartamento}')">
                      <span class="material-symbols-outlined" style="font-size: 1.1rem;">delete</span> Excluir
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Seção 2: Lista de Moradores Com Acesso Liberado -->
        <div class="card-widget" style="padding: 1.25rem;">
          <div class="card-header" style="margin-bottom: 0.85rem;">
            <div class="card-title">
              <span class="material-symbols-outlined">groups</span> Moradores Com Acesso Autorizado (${aprovados.length})
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${aprovados.map(m => {
              const isAdmin = m.role === 'Administrador' || m.id === 'usr_sindico' || m.email.toLowerCase() === 'condominio.modern.life@gmail.com';
              return `
                <div style="background: var(--bg-app); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.85rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                  <div>
                    <div style="font-weight: 700; font-size: 0.95rem; color: var(--primary-dark);">
                      ${m.nome} ${isAdmin ? '<span class="badge badge-info" style="font-size: 0.7rem; margin-left: 4px;">Síndico Master</span>' : ''}
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">
                      Apto ${m.apartamento} &bull; ${m.email}
                    </div>
                  </div>

                  <div>
                    ${isAdmin ? `
                      <span style="font-size: 0.75rem; color: var(--text-muted); font-style: italic;">
                        🔒 Administrador
                      </span>
                    ` : `
                      <button class="btn-secondary btn-sm btn-danger" style="background: #FFEBEE; color: #C62828; padding: 0.5rem 0.75rem;" onclick="AdminComponent.excluirMorador('${m.id}', '${m.nome}', '${m.apartamento}')">
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

  openQuickApproveModal() {
    const existing = document.getElementById('modalQuickApprove');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="modal-overlay active" id="modalQuickApprove">
        <div class="modal-card" style="max-width: 480px;">
          <div class="modal-header" style="background: var(--primary-dark); color: white;">
            <div class="modal-title" style="color: white; font-weight: 700; font-size: 1.1rem;">
              ➕ Aprovar Morador no Celular
            </div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalQuickApprove').remove()">✕</button>
          </div>
          <div class="modal-body">
            <div style="background: var(--primary-light); padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.82rem; color: var(--primary-dark); margin-bottom: 1rem; border-left: 3px solid var(--primary);">
              💡 <strong>Liberação Instantânea:</strong> Digite o e-mail ou nome do morador que solicitou o cadastro. O acesso aos balancetes e documentos será liberado na hora!
            </div>

            <form onsubmit="AdminComponent.submeterAprovacaoRapida(event)">
              <div class="form-group">
                <label class="form-label">Nome Completo do Morador</label>
                <input type="text" id="quickNome" class="form-control" placeholder="Ex: João da Silva" required>
              </div>

              <div class="form-group">
                <label class="form-label">E-mail do Morador</label>
                <input type="email" id="quickEmail" class="form-control" placeholder="morador@exemplo.com" required>
              </div>

              <div class="form-group">
                <label class="form-label">Unidade / Apto</label>
                <input type="text" id="quickApto" class="form-control" placeholder="Ex: Apt 402" required>
              </div>

              <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-weight: 700; font-size: 0.95rem;">
                <span class="material-symbols-outlined">check_circle</span> Conceder Acesso Autorizado
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
    const email = document.getElementById('quickEmail').value.trim();
    const apartamento = document.getElementById('quickApto').value.trim();

    const newMorador = window.CondoStore.addMorador({
      nome,
      email,
      apartamento,
      cpf: 'Autorizado via Celular'
    });

    window.CondoStore.updateMoradorStatus(newMorador.id, 'Aprovado');

    App.showToast(`Morador "${nome}" (Apto ${apartamento}) APROVADO com sucesso!`, 'success');
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
