/* ----------------------------------------------------
   Modern Life Residence - Painel Administrativo do Síndico
   Síndico: Alessandro Cristiano da Silva
   Gerenciamento, Aprovação e Exclusão de Cadastros
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
            <div style="text-align: right;">
              <span class="badge badge-warning" style="font-size: 0.95rem; padding: 0.5rem 0.9rem;">
                ${pendentes.length} Cadastros Pendentes
              </span>
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
              Clique em <strong>"Autorizar Acesso"</strong> para aprovar ou em <strong>"Excluir"</strong> para remover a solicitação.
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
                    <th>Unidade</th>
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
                          <button class="btn-secondary btn-sm btn-danger" style="background: #FFEBEE; color: #C62828;" onclick="AdminComponent.excluirMorador('${p.id}', '${p.nome}')">
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
                  <th>Unidade</th>
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
                      <td>Apto ${m.apartamento} - Bloco ${m.bloco || 'A'}</td>
                      <td>${m.email}</td>
                      <td><span class="badge badge-info">${m.role}</span></td>
                      <td><span class="badge badge-success">${m.status}</span></td>
                      <td style="text-align: center;">
                        ${isAdmin ? `
                          <span style="font-size: 0.78rem; color: var(--text-muted); font-style: italic;">
                            <span class="material-symbols-outlined" style="font-size: 0.9rem; vertical-align: middle;">lock</span> Não Excluível
                          </span>
                        ` : `
                          <button class="btn-secondary btn-sm btn-danger" style="background: #FFEBEE; color: #C62828; padding: 0.4rem 0.75rem;" onclick="AdminComponent.excluirMorador('${m.id}', '${m.nome}')">
                            <span class="material-symbols-outlined" style="font-size: 0.95rem;">delete</span> Excluir Cadastro
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

  aprovarMorador(id) {
    window.CondoStore.updateMoradorStatus(id, 'Aprovado');
    App.showToast('Acesso do morador autorizado com sucesso!', 'success');
    App.render();
  },

  excluirMorador(id, nome) {
    if (!confirm(`Tem certeza que deseja EXCLUIR permanentemente o cadastro de "${nome}"?`)) {
      return;
    }

    const res = window.CondoStore.deleteMorador(id);
    if (res.success) {
      App.showToast(`Cadastro de "${nome}" foi excluído com sucesso.`, 'success');
      App.render();
    } else {
      alert(res.message);
    }
  }
};
